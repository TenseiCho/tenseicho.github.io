import { Pool } from 'pg';
import type { APIRoute } from 'astro';

const pool = new Pool({
  connectionString: import.meta.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Initialize the table if it doesn't exist
await pool.query(`
  CREATE TABLE IF NOT EXISTS post_reactions (
    id SERIAL PRIMARY KEY,
    post_slug VARCHAR(255) NOT NULL,
    reaction_type VARCHAR(50) NOT NULL,
    user_ip VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(post_slug, reaction_type, user_ip)
  );
`);

export const GET: APIRoute = async ({ url, clientAddress }) => {
  try {
    const postSlug = url.searchParams.get('postSlug');
    if (!postSlug) {
      return new Response(JSON.stringify({ error: 'Post slug is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get reaction counts
    const result = await pool.query(
      `SELECT reaction_type, COUNT(*) as count 
       FROM post_reactions 
       WHERE post_slug = $1 
       GROUP BY reaction_type`,
      [postSlug]
    );

    // Get user's reactions
    const userReactions = await pool.query(
      `SELECT reaction_type 
       FROM post_reactions 
       WHERE post_slug = $1 AND user_ip = $2`,
      [postSlug, clientAddress]
    );

    const counts = {
      like: 0,
      dislike: 0,
      heart: 0
    };

    result.rows.forEach(row => {
      if (row.reaction_type in counts) {
        counts[row.reaction_type] = parseInt(row.count);
      }
    });

    return new Response(JSON.stringify({
      counts,
      userReactions: userReactions.rows.map(row => row.reaction_type)
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error fetching reactions:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const POST: APIRoute = async ({ request, clientAddress }) => {
  try {
    const { postSlug, reactionType } = await request.json();

    if (!postSlug || !reactionType) {
      return new Response(JSON.stringify({ error: 'Post slug and reaction type are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Check if user has already reacted to this post
    const existingReaction = await pool.query(
      'SELECT reaction_type FROM post_reactions WHERE post_slug = $1 AND user_ip = $2',
      [postSlug, clientAddress]
    );

    if (existingReaction.rows.length > 0) {
      return new Response(JSON.stringify({ error: 'User has already reacted to this post' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Add new reaction
    await pool.query(
      'INSERT INTO post_reactions (post_slug, reaction_type, user_ip) VALUES ($1, $2, $3)',
      [postSlug, reactionType, clientAddress]
    );

    // Get updated counts
    const result = await pool.query(
      `SELECT reaction_type, COUNT(*) as count 
       FROM post_reactions 
       WHERE post_slug = $1 
       GROUP BY reaction_type`,
      [postSlug]
    );

    const counts = {
      like: 0,
      dislike: 0,
      heart: 0
    };

    result.rows.forEach(row => {
      if (row.reaction_type in counts) {
        counts[row.reaction_type] = parseInt(row.count);
      }
    });

    return new Response(JSON.stringify({ counts }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error adding reaction:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}; 
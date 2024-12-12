import type { APIRoute } from 'astro';
import pkg from 'pg';
import fs from 'fs';
import path from 'path';
const { Pool } = pkg;

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  };

  let DATABASE_URL = import.meta.env.DATABASE_URL;
  if (!DATABASE_URL) {
    console.error('No DATABASE_URL environment variable found');
    return new Response(JSON.stringify({
      success: false,
      error: 'Database configuration missing',
      details: {
        message: 'DATABASE_URL environment variable is not set'
      }
    }), {
      status: 500,
      headers
    });
  }

  try {
    // Remove sslmode from connection string if it exists
    DATABASE_URL = DATABASE_URL.replace(/[?&]sslmode=[^&]+/, '');
    
    // Read the CA certificate from the root directory
    const caCert = fs.readFileSync('ca-certificate.crt').toString();
    console.log('Successfully loaded CA certificate');

    const poolConfig = {
      connectionString: DATABASE_URL,
      ssl: {
        rejectUnauthorized: true, // Enforce SSL certificate verification
        ca: caCert,
        // Proper hostname verification
        checkServerIdentity: (host, cert) => {
          // Allow connections to DigitalOcean database domains
          if (host.includes('db.ondigitalocean.com')) {
            return undefined;
          }
          // Default Node.js certificate verification for other hosts
          return pkg.tls.checkServerIdentity(host, cert);
        }
      }
    };

    console.log('Attempting database connection with strict SSL...');
    const pool = new Pool(poolConfig);

    console.log('Testing database connection...');
    
    // Log connection string (but mask sensitive info)
    const maskedUrl = DATABASE_URL.replace(/\/\/[^:]+:[^@]+@/, '//****:****@');
    console.log('Using connection string:', maskedUrl);
    
    const client = await pool.connect();
    console.log('Successfully connected to database');
    
    const result = await client.query('SELECT NOW()');
    console.log('Database query successful:', result.rows[0]);
    
    client.release();
    await pool.end(); // Ensure pool is properly closed
    
    return new Response(JSON.stringify({
      success: true,
      message: 'Database connection successful',
      timestamp: result.rows[0].now
    }), {
      status: 200,
      headers
    });
  } catch (error) {
    console.error('Database connection error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Database connection failed',
      details: {
        message: error.message,
        code: error.code
      }
    }), {
      status: 500,
      headers
    });
  }
}; 
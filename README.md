# TenseiCho's Personal Website

This is the repository for my personal website, built with Astro. It showcases my projects, blog posts, and provides information about me as a software engineer, 3D artist, and YouTuber.

## 🚀 Project Structure

Inside of this project, you'll see the following folders and files:

```text
/
├── public/
│   └── (static assets like images and icons)
├── src/
│   ├── components/
│   ├── content/
│   │   └── projects/
│   ├── layouts/
│   ├── pages/
│   │   └── posts/
│   └── styles/
├── astro.config.mjs
└── package.json
```

- `public/`: Contains static assets that are served as-is.
- `src/components/`: Reusable Astro components.
- `src/content/projects/`: Markdown files for project descriptions.
- `src/layouts/`: Layout components for structuring pages.
- `src/pages/`: Astro pages and blog post markdown files.
- `src/styles/`: Global CSS styles.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |

## 👀 Features

- Responsive design
- Dark/Light mode toggle
- Project showcase
- Blog with Markdown support
- "Like" functionality for blog posts

## 🚀 Deployment

This site is automatically deployed to GitHub Pages using GitHub Actions. Any push to the `main` branch will trigger a new build and deployment.

## 📝 License

This project is open source and available under the [MIT License](LICENSE).
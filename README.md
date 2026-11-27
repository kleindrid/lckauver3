<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/903948ba-90ae-4cc9-b431-d56d82a50c76

## Run Locally

> **Important:** Do **not** open `index.html` directly via `file://` (double-clicking the file). This is a Vite + React + TypeScript project that uses `<script type="module">`, Tailwind CSS compilation, and `import.meta.glob`, which require Vite to bundle/serve over HTTP (`file://` blocks ES module scripts due to browser CORS rules).

**Prerequisites:** Node.js (v20+)

1. Install dependencies:
   `npm install`
2. (Optional) Set `GEMINI_API_KEY` in `.env.local` if needed.
3. Run the development server:
   `npm run dev`
4. To test the production build locally (simulating GitHub Pages):
   `npm run build && npm run preview`

## Deploy to GitHub Pages

This repository includes `.github/workflows/deploy.yml` and `base: './'` in `vite.config.ts`.

1. Push the project (including `.github/workflows/deploy.yml`) to the `main` (or `master`) branch on GitHub.
2. In your GitHub repository, go to **Settings → Pages**.
3. Under **Build and deployment → Source**, select **GitHub Actions** (do **not** select "Deploy from a branch", otherwise GitHub Pages serves the raw unbuilt `index.html` and shows a blank white page).
4. Once the workflow finishes, your app will be live at `https://<username>.github.io/<repo-name>/`.

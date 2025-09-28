# SoundCloud Playlist Finder

A static React app + optional Netlify serverless proxy.

## Hosting on GitHub Pages
1. Create a new GitHub repository and upload these files.
2. Commit `index.html`, `app.js`, and the `netlify/functions` folder.
3. In the repo settings, enable **Pages** and set the branch to `main` and root directory `/`.
4. Visit your site at `https://<username>.github.io/<repo>/`.

## Notes
- By default the app tries to fetch SoundCloud directly, but due to CORS this often fails. Deploy the included Netlify function and set `PROXY_BASE` in `app.js` to its URL for reliable results.
- The proxy simply fetches the SoundCloud page server-side and returns HTML as JSON.

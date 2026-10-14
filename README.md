# Daily Affirmations PWA

A calm, beginner-friendly affirmation quiz built with vanilla HTML, CSS and JavaScript. It supports multiple-choice and typed-answer questions, saves progress on the current device, and can work offline after the app shell has been cached.

## Files

- `index.html` — page structure and content areas
- `style.css` — responsive visual design
- `app.js` — questions, answer checking, score and local progress
- `manifest.json` — installable web app metadata
- `service-worker.js` — offline cache
- `icons/` — app icons

## Run locally

A service worker needs a secure context. For local testing, use a local development server rather than opening `index.html` directly as a `file://` URL.

If you have Python installed, open a terminal in this folder and run:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000` in your browser. Visit once while online/connected to the local server, reload, and test offline from browser DevTools. The localhost origin is treated as secure for service-worker development.

## Publish with GitHub Pages

1. Create a new GitHub repository, for example `affirmation-quiz`.
2. Upload all files and the `icons` folder while preserving the folder structure.
3. Commit the files to the `main` branch.
4. In the repository, open **Settings → Pages**.
5. Under **Build and deployment**, choose **Deploy from a branch**.
6. Select branch `main` and folder `/(root)`, then save.
7. Wait for the deployment to finish. GitHub will show your public HTTPS URL, usually `https://YOUR-USERNAME.github.io/affirmation-quiz/`.
8. Open the URL while online and wait for the first page load and service-worker cache to complete.
9. On Android Chrome, open the browser menu and choose **Install app** or **Add to Home screen** if offered. On desktop, look for the install icon in the address bar or browser menu.

## Test offline

1. Open the deployed site online.
2. Reload once after the first visit so the service worker can install and cache the app shell.
3. Open DevTools → Application → Service Workers and confirm the worker is active; in Cache Storage, check for `daily-affirmations-v1`.
4. Enable airplane mode or DevTools' offline mode.
5. Reload the site or launch the installed app. The app shell and quiz should still open.
6. Complete a question offline, reload, and check that today's progress remains.

The first visit and initial caching require a connection. Offline behavior depends on the browser retaining the cached files and site data.

## Edit the affirmations

Open `app.js` and edit the `QUESTIONS` array. Each question has:
- `id`: unique identifier
- `type`: `"mcq"` or `"typed"`
- `prompt`: the instruction shown to the learner
- `affirmation`: the exact expected answer
- `options`: four choices for MCQs; an empty array for typed questions

For MCQs, the exact correct option should match `affirmation`. Typed answers are strict apart from capitalization, leading/trailing whitespace, and repeated whitespace.

After changing app files, update `CACHE_NAME` in `service-worker.js` (for example, from `daily-affirmations-v1` to `daily-affirmations-v2`). This tells the browser to install a fresh cache. Commit and push the change; GitHub Pages will redeploy.

## Progress and privacy

Progress is stored in the browser's `localStorage` on the device. It is not sent to a server and does not synchronize to another device. Clearing browser site data can erase it. Use the reset button to clear only today's recorded progress.

## Beginner design notes

- **Vanilla JavaScript:** no framework or build step, so you can see how HTML, CSS and JS work together.
- **Relative paths (`./...`):** keep the app working when hosted inside a GitHub Pages repository subpath.
- **Service worker:** browsers only allow this powerful offline mechanism in secure contexts such as HTTPS or localhost.
- **Cache version:** changing the version lets the browser replace older cached app files after updates.
- **`localStorage`:** easy for a small amount of progress data; a larger app could use IndexedDB.
- **Normalization:** typed answers ignore case and extra whitespace, but still require the same words and order.

## Limitations in this starter

- Sample affirmations are included directly in `app.js`.
- The daily streak uses the browser's local calendar date.
- Progress is device/browser-specific, not cloud-synced.
- The app has no account, backend, or real-time sharing of personal progress.

# Deploying ShotBot

## Updating the live site (push your changes)

Your live site (e.g. shot-dot.vercel.app) is linked to GitHub. When you send your latest code to GitHub, Vercel updates the site automatically. You don’t have to click “Deploy” anywhere.

**Steps:**

1. **Save your work** in Cursor.
2. **Open the terminal** in Cursor: **Terminal → New Terminal** (panel at the bottom).
3. **Run these three commands**, one at a time (copy, paste, press Enter):

   **First** – collect the files you changed:
   ```
   git add .
   ```

   **Second** – save a snapshot with a short note (you can change the message in quotes):
   ```
   git commit -m "My updates"
   ```

   **Third** – send that snapshot to GitHub:
   ```
   git push
   ```
   (You must run `git push` in **your** terminal so GitHub can use your sign-in; the AI can’t push for you.)

4. **Wait a minute or two** – Vercel will rebuild the site. Refresh your live URL to see the changes.

**In short:** Save → `git add .` → `git commit -m "My updates"` → `git push` (in your terminal) → wait → check the live site.

---

## Vercel (recommended)

1. Push your code and import the project in [Vercel](https://vercel.com).
2. Add the Anthropic API key:
   - **Settings → Environment Variables**
   - Name: `ANTHROPIC_API_KEY`
   - Value: your key from [Anthropic Console](https://console.anthropic.com/)
3. Deploy. The app uses the serverless function at `/api/anthropic` so the key stays server-side and CORS is not an issue.

## Test the proxy locally (manual test)

This runs the app and the API proxy on your machine so you can see everything working before you deploy.

1. **Get an API key** (if you don’t have one): go to [console.anthropic.com](https://console.anthropic.com/), sign in, and create an API key.

2. **Create a `.env` file** in the project folder (same folder as `package.json`) with one line:
   ```
   ANTHROPIC_API_KEY=your_key_here
   ```
   Use your real key. Do **not** add `VITE_ANTHROPIC_API_KEY` — we want the app to use the proxy.

3. **Install the Vercel CLI** (one-time):
   ```bash
   npm install -g vercel
   ```

4. **Run the app with the proxy:**
   ```bash
   npm run dev:proxy
   ```
   Or, if you didn’t add the script: `vercel dev`

5. **Open the URL** shown in the terminal (e.g. `http://localhost:3000`).

6. **Try it:**
   - Upload a photo and run **Analyze** (photo analysis).
   - Or open **Ask AI Tutor** and ask a question.

If those work, the proxy is working locally and will behave the same when you deploy to Vercel.

## Local development (other options)

- **Simple dev (key in browser):**  
  Create a `.env` with `VITE_ANTHROPIC_API_KEY=your_key` and run `npm run dev`. The app calls Anthropic directly (fine for local only; don’t use this in production).
- **Proxy locally (same as production):**  
  Use the “Test the proxy locally” steps above (`npm run dev:proxy` and `ANTHROPIC_API_KEY` in `.env`).

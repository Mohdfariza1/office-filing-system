# Office Filing System

A simple tracker for official paper documents in the office (letters from agencies, government notices, circulars, approvals, agreements). It answers one question: **where is the document now?**

The usual failure: a document goes into the Director's office, comes out signed, and nobody knows where it went next. This app makes "came back from Director" a step that cannot be saved without naming the destination (a filing location, a staff member, or an outside party).

## How it works
- **New document**: register it when it lands on the desk, with the sender and their reference number so it can be found again by either. Tick "Going straight to the Director" if that is where it goes first.
- **Dashboard**: what is with the Director, what is back on the desk with no home, what is overdue.
- **Came back**: record the outcome and, in the same step, where it goes now.
- **Register**: full list, search by ref, title, sender or location. Click a row for the full history.
- **Settings**: filing locations, staff names, backup and restore.

Overdue flags: 3 days with the Director, 1 day back on the desk with no home, 7 days with a staff member.

## Running it
Open `index.html` in a browser. No install, no build, no server. Works offline.

Data is saved in that browser on that PC only. Download a backup from Settings regularly. If several people need to update it from different PCs, that needs a shared backend, which this version does not have.

## Scanned copies in Google Drive
Each document can carry links to scanned copies. Two ways:
- **Paste a Drive link**: works with no setup. Upload the scan to Drive yourself, copy its link, use **Attach scan** on the document.
- **Upload from the app**: needs a one-time setup of a small Google Apps Script in your own Google account. Scans land in a Drive folder called "Office Filing System", named by document ref.

Setup (about 5 minutes, once):
1. Open https://script.google.com with the office Google account and create a new project.
2. Delete the sample code, paste in `drive-upload.gs` from this repo.
3. Change `SECRET` to a long random text. Keep it private.
4. Deploy → New deployment → type **Web app** → Execute as **Me** → Who has access **Anyone** → Deploy. Approve the permission prompt (it asks for Drive access because the script creates files in your Drive).
5. Copy the web app URL (ends in `/exec`).
6. In the app, Settings → Google Drive scans: paste the URL and the same secret, Save, then **Test connection**.

If you change the script later, use Deploy → Manage deployments → edit → New version, or the URL keeps serving the old code.

The secret only stops strangers uploading junk into your folder. It sits in the browser settings on the office PC, so treat it like an office password, not a bank one.

## Deploy
Netlify serves the repo root as-is (`netlify.toml`).

# Office Filing System

A simple tracker for paper documents in the office. It answers one question: **where is the document now?**

The usual failure: a document goes into the Director's office, comes out signed, and nobody knows where it went next. This app makes "came back from Director" a step that cannot be saved without naming the destination (a filing location, a staff member, or an outside party).

## How it works
- **New document**: register it when it lands on the desk. Tick "Going straight to the Director" if that is where it goes first.
- **Dashboard**: what is with the Director, what is back on the desk with no home, what is overdue.
- **Came back**: record the outcome and, in the same step, where it goes now.
- **Register**: full list, search by ref, title, sender or location. Click a row for the full history.
- **Settings**: filing locations, staff names, backup and restore.

Overdue flags: 3 days with the Director, 1 day back on the desk with no home, 7 days with a staff member.

## Running it
Open `index.html` in a browser. No install, no build, no server. Works offline.

Data is saved in that browser on that PC only. Download a backup from Settings regularly. If several people need to update it from different PCs, that needs a shared backend, which this version does not have.

## Deploy
Netlify serves the repo root as-is (`netlify.toml`).

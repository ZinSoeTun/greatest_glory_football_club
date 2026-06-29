# Greatest Glory Football Club Website

Static football club website built with plain `HTML`, `CSS`, and `JavaScript`.

This package gives you:

- A branded public website based on the provided club logo and its black-gold color palette
- An `admin.html` content manager for club profile, fixtures, results, highlights, announcements, and media
- A demo `localStorage` mode so the site works immediately without any backend
- A sample Google Apps Script backend that stores records in a CSV file and uploads files to Google Drive
- A structure that can be published to GitHub Pages

## Files

- `index.html`: public club website
- `detail.html`: detail page for single records
- `admin.html`: browser-based CRUD panel
- `assets/styles/`: website and admin styles
- `assets/scripts/`: shared data layer and page scripts
- `backend/Code.gs`: Google Apps Script sample API
- `backend/SETUP.md`: deployment instructions for Google Drive mode

## Quick Start

1. Open `index.html` to view the site.
2. Open `admin.html` to edit the demo data in your browser.
3. If you want GitHub Pages + Google Drive mode, deploy `backend/Code.gs` as a Google Apps Script web app and follow `backend/SETUP.md`.

## Important Architecture Note

Because GitHub Pages is static hosting, it cannot directly update CSV files or Google Drive by itself.

To make CRUD work without a traditional database:

- Frontend: `HTML + CSS + JS` on GitHub Pages
- API layer: Google Apps Script web app
- Data store: CSV file in Google Drive
- Media store: image/video/audio/pdf/excel files in a Google Drive folder

That keeps the public website simple while still letting the club manage content from the browser.

# Google Drive CSV Backend Setup

This setup lets a static GitHub Pages site read and write content without using a traditional database.

## Architecture

- Public website: `index.html` on GitHub Pages
- Admin panel: `admin.html`
- API layer: Google Apps Script web app
- Data file: one CSV inside Google Drive
- Uploaded assets: a Google Drive folder for images, videos, PDFs, audio, and documents

## 1. Create the Apps Script project

1. Go to [script.google.com](https://script.google.com).
2. Create a new project.
3. Replace the default code with the contents of `Code.gs`.
4. Save the project.

## 2. Add script properties

Open `Project Settings` -> `Script Properties` and add:

- `ADMIN_KEY`
  Use a long random secret. You will type this into `admin.html`.
- `CSV_FILE_NAME`
  Example: `ggfc-records.csv`
- `DATA_FOLDER_NAME`
  Example: `GGFC Website Data`
- `MEDIA_FOLDER_NAME`
  Example: `ggfc-media`

Optional:

- `DATA_FOLDER_ID`
  If you want to force everything into an existing Drive folder, set the folder ID here.

## 3. Deploy the web app

1. Click `Deploy` -> `New deployment`.
2. Choose `Web app`.
3. Set `Execute as`: `Me`
4. Set access to a public-readable option that works for your use case.
5. Deploy and copy the `/exec` URL.

## 4. Connect the public site

Open `assets/scripts/config.js` and set:

```js
window.GG_CONFIG = {
  ...,
  publicApiUrl: "YOUR_APPS_SCRIPT_EXEC_URL",
};
```

When this value is present, `index.html` and `detail.html` will try to read live data from Google Drive through Apps Script.

## 5. Connect the admin panel

1. Open `admin.html`.
2. Change `Mode` to `Google Drive mode`.
3. Paste the Apps Script URL.
4. Paste the same `ADMIN_KEY`.
5. Save settings.

The key is stored only in that browser's local storage, not hard-coded into the project.

## 6. Publish to GitHub Pages

Push the project to a public GitHub repository and enable GitHub Pages.

## Notes

- GitHub Pages alone cannot edit CSV files or Google Drive directly, so the Apps Script layer is required.
- The sample code stores all content rows in one CSV file and uploaded files in a Drive folder.
- When you edit a record and upload a new file, the old Drive file is moved to trash.
- If you want stronger security later, keep the public website on GitHub Pages and move the admin page behind a private URL or access layer.

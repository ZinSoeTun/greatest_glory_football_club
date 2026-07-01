const GGFC_HEADERS = [
  "id",
  "collection",
  "title",
  "slug",
  "status",
  "date",
  "time",
  "location",
  "opponent",
  "venue",
  "competition",
  "score",
  "summary",
  "body",
  "badge",
  "tags",
  "externalUrl",
  "mediaType",
  "fileId",
  "fileUrl",
  "fileName",
  "heroTitle",
  "heroText",
  "motto",
  "foundedYear",
  "city",
  "ground",
  "contactEmail",
  "contactPhone",
  "facebookUrl",
  "youtubeUrl",
  "instagramUrl",
  "createdAt",
  "updatedAt"
];

function doGet(e) {
  try {
    const action = (e && e.parameter && e.parameter.action) || "list";
    if (action === "bridge") {
      return buildBridgeHtml_((e && e.parameter && e.parameter.bridgeId) || "");
    }

    if (action !== "list") {
      throw new Error("Unsupported action.");
    }

    return jsonResponse_({
      ok: true,
      data: handleBridgeRequest({ action: "list" }),
    });
  } catch (error) {
    return jsonResponse_({
      ok: false,
      error: error.message,
    });
  }
}

function doPost(e) {
  try {
    const payload = JSON.parse((e && e.postData && e.postData.contents) || "{}");
    return jsonResponse_({ ok: true, data: handleBridgeRequest(payload) });
  } catch (error) {
    return jsonResponse_({
      ok: false,
      error: error.message,
    });
  }
}

function handleBridgeRequest(payload) {
  const request = payload || {};
  const action = request.action || "list";

  if (action === "list") {
    return {
      records: getRecords_(),
      generatedAt: new Date().toISOString(),
    };
  }

  if (action === "login") {
    return createSession_(request.adminKey);
  }

  if (action === "validateSession") {
    return getSessionSnapshot_(request.sessionToken);
  }

  if (action === "logout") {
    if (request.adminKey) {
      authorizeAdminKey_(request.adminKey);
    }
    revokeSession_(request.sessionToken);
    return { loggedOut: true };
  }

  if (action === "upsert") {
    authorizeRequest_(request);
    return upsertRecord_(request.collection, request.record || {}, request.file || null, request.previousFileId || "");
  }

  if (action === "delete") {
    authorizeRequest_(request);
    return deleteRecord_(request.collection, request.id);
  }

  throw new Error("Unsupported action.");
}

function buildBridgeHtml_(bridgeId) {
  const html = HtmlService.createHtmlOutput(`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GGFC Bridge</title>
  </head>
  <body>
    <script>
      (function () {
        const BRIDGE_CHANNEL = "GGFC_APPS_SCRIPT_BRIDGE_V1";
        const BRIDGE_ID = ${JSON.stringify(String(bridgeId || ""))};

        function respond(message) {
          if (window.parent && window.parent !== window) {
            window.parent.postMessage(
              Object.assign(
                {
                  channel: BRIDGE_CHANNEL,
                  bridgeId: BRIDGE_ID,
                },
                message || {}
              ),
              "*"
            );
          }
        }

        window.addEventListener("message", function (event) {
          const request = event.data || {};
          if (
            request.channel !== BRIDGE_CHANNEL ||
            request.bridgeId !== BRIDGE_ID ||
            request.type !== "request"
          ) {
            return;
          }

          google.script.run
            .withSuccessHandler(function (data) {
              respond({
                type: "response",
                requestId: request.requestId || "",
                ok: true,
                data: data,
              });
            })
            .withFailureHandler(function (error) {
              respond({
                type: "response",
                requestId: request.requestId || "",
                ok: false,
                error: error && error.message ? error.message : String(error || "Bridge request failed."),
              });
            })
            .handleBridgeRequest(request.payload || {});
        });

        respond({
          type: "ready",
        });
      })();
    </script>
  </body>
</html>`);

  return html.setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function authorizeAdminKey_(adminKey) {
  const settings = getSettings_();
  if (!settings.adminKey) {
    throw new Error("Script property ADMIN_KEY is missing.");
  }
  if (!adminKey || adminKey !== settings.adminKey) {
    throw new Error("Invalid admin key.");
  }
}

function authorizeRequest_(payload) {
  if (payload && payload.adminKey) {
    authorizeAdminKey_(payload.adminKey);
    return true;
  }

  if (payload && payload.sessionToken && validateSessionToken_(payload.sessionToken)) {
    return true;
  }

  throw new Error("Authentication required.");
}

function getSettings_() {
  const properties = PropertiesService.getScriptProperties().getProperties();
  const ttlMinutes = Number(properties.SESSION_TTL_MINUTES || "360");
  return {
    adminKey: properties.ADMIN_KEY || "",
    dataFolderId: properties.DATA_FOLDER_ID || "",
    csvFileName: properties.CSV_FILE_NAME || "ggfc-records.csv",
    mediaFolderName: properties.MEDIA_FOLDER_NAME || "ggfc-media",
    dataFolderName: properties.DATA_FOLDER_NAME || "GGFC Website Data",
    sessionTtlSeconds: Math.max(300, Math.min(21600, Math.floor(ttlMinutes * 60) || 21600)),
  };
}

function sessionCacheKey_(sessionToken) {
  return "ggfc-session:" + String(sessionToken || "");
}

function createSession_(adminKey) {
  authorizeAdminKey_(adminKey);

  const settings = getSettings_();
  const authenticatedAt = new Date().toISOString();
  const sessionToken = Utilities.getUuid().replace(/-/g, "") + Utilities.getUuid().replace(/-/g, "");
  const expiresAt = new Date(Date.now() + settings.sessionTtlSeconds * 1000).toISOString();
  const session = {
    authenticatedAt: authenticatedAt,
    expiresAt: expiresAt,
  };

  CacheService.getScriptCache().put(sessionCacheKey_(sessionToken), JSON.stringify(session), settings.sessionTtlSeconds);

  return {
    sessionToken: sessionToken,
    authenticatedAt: authenticatedAt,
    expiresAt: expiresAt,
  };
}

function readSession_(sessionToken) {
  if (!sessionToken) {
    return null;
  }

  const raw = CacheService.getScriptCache().get(sessionCacheKey_(sessionToken));
  if (!raw) {
    return null;
  }

  try {
    const session = JSON.parse(raw);
    if (session.expiresAt && new Date(session.expiresAt).getTime() <= Date.now()) {
      revokeSession_(sessionToken);
      return null;
    }
    return session;
  } catch (error) {
    revokeSession_(sessionToken);
    return null;
  }
}

function validateSessionToken_(sessionToken) {
  return !!readSession_(sessionToken);
}

function getSessionSnapshot_(sessionToken) {
  const session = readSession_(sessionToken);
  if (!session) {
    throw new Error("Session expired or invalid.");
  }

  return {
    valid: true,
    sessionToken: sessionToken,
    authenticatedAt: session.authenticatedAt || "",
    expiresAt: session.expiresAt || "",
  };
}

function revokeSession_(sessionToken) {
  if (!sessionToken) {
    return;
  }

  CacheService.getScriptCache().remove(sessionCacheKey_(sessionToken));
}

function getDataFolder_() {
  const settings = getSettings_();
  if (settings.dataFolderId) {
    return DriveApp.getFolderById(settings.dataFolderId);
  }

  const folders = DriveApp.getFoldersByName(settings.dataFolderName);
  if (folders.hasNext()) {
    return folders.next();
  }

  return DriveApp.createFolder(settings.dataFolderName);
}

function getMediaFolder_() {
  const settings = getSettings_();
  const dataFolder = getDataFolder_();
  const folders = dataFolder.getFoldersByName(settings.mediaFolderName);
  if (folders.hasNext()) {
    return folders.next();
  }
  return dataFolder.createFolder(settings.mediaFolderName);
}

function getCsvFile_() {
  const settings = getSettings_();
  const dataFolder = getDataFolder_();
  const files = dataFolder.getFilesByName(settings.csvFileName);
  if (files.hasNext()) {
    return files.next();
  }

  const file = dataFolder.createFile(settings.csvFileName, GGFC_HEADERS.join(",") + "\n", MimeType.CSV);
  return file;
}

function getRecords_() {
  const csvFile = getCsvFile_();
  const raw = csvFile.getBlob().getDataAsString("UTF-8");
  if (!raw.trim()) {
    return [];
  }

  const rows = Utilities.parseCsv(raw);
  if (!rows.length) {
    return [];
  }

  const header = rows[0];
  return rows.slice(1).filter(function (row) {
    return row.join("").trim() !== "";
  }).map(function (row) {
    const record = {};
    header.forEach(function (column, index) {
      record[column] = row[index] || "";
    });
    return ensureRecordShape_(record);
  });
}

function writeRecords_(records) {
  const csvFile = getCsvFile_();
  const lines = [GGFC_HEADERS.join(",")];
  records.forEach(function (record) {
    const row = GGFC_HEADERS.map(function (column) {
      return csvValue_(record[column]);
    }).join(",");
    lines.push(row);
  });
  csvFile.setContent(lines.join("\n"));
}

function csvValue_(value) {
  const stringValue = String(value || "");
  return '"' + stringValue.replace(/"/g, '""') + '"';
}

function ensureRecordShape_(record) {
  const next = {};
  GGFC_HEADERS.forEach(function (column) {
    next[column] = record[column] || "";
  });
  return next;
}

function slugify_(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function inferMediaType_(mimeType) {
  if (!mimeType) {
    return "document";
  }
  if (mimeType.indexOf("image/") === 0) {
    return "image";
  }
  if (mimeType.indexOf("video/") === 0) {
    return "video";
  }
  if (mimeType.indexOf("audio/") === 0) {
    return "audio";
  }
  return "document";
}

function buildRecord_(collection, draft, existing) {
  const now = new Date().toISOString();
  const next = ensureRecordShape_(existing || {});

  GGFC_HEADERS.forEach(function (column) {
    if (draft.hasOwnProperty(column) && draft[column] !== null && draft[column] !== undefined) {
      next[column] = String(draft[column]);
    }
  });

  next.id = draft.id || existing.id || [collection, new Date().getTime()].join("-");
  next.collection = collection;
  next.title = draft.title || existing.title || "Untitled record";
  next.slug = draft.slug ? slugify_(draft.slug) : slugify_(existing.slug || next.title || next.id);
  next.tags = String(draft.tags || existing.tags || "")
    .split(",")
    .map(function (item) {
      return item.trim();
    })
    .filter(Boolean)
    .join(", ");
  next.createdAt = existing.createdAt || now;
  next.updatedAt = now;

  return next;
}

function saveFile_(filePayload, previousFileId) {
    if (previousFileId) {
      try {
        DriveApp.getFileById(previousFileId).setTrashed(true);
      } catch (error) {
        Logger.log("Previous file could not be removed: " + error.message); 
      }
    }

  const mediaFolder = getMediaFolder_(); 
  const bytes = Utilities.base64Decode(filePayload.base64 || "");
  const blob = Utilities.newBlob(bytes, filePayload.mimeType || MimeType.PLAIN_TEXT, filePayload.name || "asset");
  const file = mediaFolder.createFile(blob);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

  const fileId = file.getId();
  const mediaType = inferMediaType_(filePayload.mimeType); 
  
  let previewUrl = file.getUrl();
  if (mediaType === "image") {
    previewUrl = "http://googleusercontent.com/profile/picture/4" + fileId;
  }

  return {
    fileId: fileId,
    fileUrl: file.getUrl(),
    previewUrl: previewUrl, 
    fileName: file.getName(),
    mediaType: mediaType, 
  };
}

function upsertRecord_(collection, draft, filePayload, previousFileId) {
  if (!collection) {
    throw new Error("Collection is required."); 
  }

  const records = getRecords_();
  const index = records.findIndex(function (item) {
    return item.id === draft.id;
  });
  const existing = index > -1 ? records[index] : {}; 
  const next = buildRecord_(collection, draft, existing);

  if (filePayload && filePayload.base64) {
    const savedFile = saveFile_(filePayload, previousFileId || existing.fileId);
    next.fileId = savedFile.fileId; 
    next.fileUrl = savedFile.fileUrl;
    next.previewUrl = savedFile.previewUrl;
    next.fileName = savedFile.fileName;
    next.mediaType = next.mediaType || savedFile.mediaType; 
  } else {
    if (existing.fileId && (next.mediaType === "image" || (!next.mediaType && inferMediaType_(existing.mimeType) === "image"))) {
      next.previewUrl = "http://googleusercontent.com/profile/picture/5" + existing.fileId;
    } else {
      next.previewUrl = existing.previewUrl || next.fileUrl || "";
    }
  }

  let nextRecords = records.slice();
  if (collection === "profile") { 
    nextRecords = nextRecords.filter(function (item) {
      return item.collection !== "profile";
    });
    nextRecords.unshift(next);
  } else if (index > -1) {
    nextRecords[index] = next;
  } else {
    nextRecords.push(next);
  }

  writeRecords_(nextRecords); 
  return { 
    records: nextRecords,
    record: next,
  };
}

function deleteRecord_(collection, id) {
  if (!collection || !id) {
    throw new Error("Collection and id are required.");
  }

  const records = getRecords_();
  const existing = records.find(function (item) {
    return item.collection === collection && item.id === id;
  });

  if (!existing) {
    throw new Error("Record not found.");
  }

  if (existing.fileId) {
    try {
      DriveApp.getFileById(existing.fileId).setTrashed(true);
    } catch (error) {
      Logger.log("Attached file could not be removed: " + error.message);
    }
  }

  const nextRecords = records.filter(function (item) {
    return !(item.collection === collection && item.id === id);
  });

  writeRecords_(nextRecords);
  return {
    records: nextRecords,
  };
}

function jsonResponse_(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

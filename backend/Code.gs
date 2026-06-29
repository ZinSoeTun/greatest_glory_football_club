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
    if (action !== "list") {
      throw new Error("Unsupported action.");
    }

    return jsonResponse_({
      ok: true,
      data: {
        records: getRecords_(),
        generatedAt: new Date().toISOString(),
      },
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
    const action = payload.action || "";

    if (action === "upsert") {
      authorize_(payload.adminKey);
      const result = upsertRecord_(payload.collection, payload.record || {}, payload.file || null, payload.previousFileId || "");
      return jsonResponse_({ ok: true, data: result });
    }

    if (action === "delete") {
      authorize_(payload.adminKey);
      const result = deleteRecord_(payload.collection, payload.id);
      return jsonResponse_({ ok: true, data: result });
    }

    throw new Error("Unsupported action.");
  } catch (error) {
    return jsonResponse_({
      ok: false,
      error: error.message,
    });
  }
}

function authorize_(adminKey) {
  const settings = getSettings_();
  if (!settings.adminKey) {
    throw new Error("Script property ADMIN_KEY is missing.");
  }
  if (!adminKey || adminKey !== settings.adminKey) {
    throw new Error("Invalid admin key.");
  }
}

function getSettings_() {
  const properties = PropertiesService.getScriptProperties().getProperties();
  return {
    adminKey: properties.ADMIN_KEY || "",
    dataFolderId: properties.DATA_FOLDER_ID || "",
    csvFileName: properties.CSV_FILE_NAME || "ggfc-records.csv",
    mediaFolderName: properties.MEDIA_FOLDER_NAME || "ggfc-media",
    dataFolderName: properties.DATA_FOLDER_NAME || "GGFC Website Data",
  };
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

  return {
    fileId: file.getId(),
    fileUrl: file.getUrl(),
    fileName: file.getName(),
    mediaType: inferMediaType_(filePayload.mimeType),
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
    next.fileName = savedFile.fileName;
    next.mediaType = next.mediaType || savedFile.mediaType;
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

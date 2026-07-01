(function () {
  const { ClubStore, COLLECTION_DEFINITIONS, helpers } = window.GGCore;
  const store = new ClubStore(window.GG_CONFIG);
  const params = new URLSearchParams(window.location.search);
  const collection = params.get("collection") || "highlights";
  const slug = params.get("slug") || "";

  const UI_LABELS = {
    Scheduled: "စီစဉ်ထားသည်",
    Postponed: "ရွှေ့ဆိုင်းထားသည်",
    Live: "တိုက်ရိုက်",
    Completed: "ပြီးဆုံး",
    Finished: "ပြီးဆုံး",
    Abandoned: "ရပ်နား",
    Awarded: "အတည်ပြုရလဒ်",
    image: "ပုံရိပ်",
    video: "ဗီဒီယို",
    audio: "အသံ",
    document: "စာရွက်စာတမ်း",
    link: "လင့်ခ်",
  };

  const FACT_FIELD_ORDER = {
    profile: [
      "motto",
      "foundedYear",
      "city",
      "ground",
      "contactEmail",
      "contactPhone",
      "facebookUrl",
      "youtubeUrl",
      "instagramUrl",
      "updatedAt",
    ],
    announcements: ["date", "badge", "fileName", "createdAt", "updatedAt"],
    fixtures: [
      "status",
      "date",
      "time",
      "opponent",
      "competition",
      "venue",
      "location",
      "fileName",
      "updatedAt",
    ],
    results: [
      "status",
      "date",
      "time",
      "opponent",
      "competition",
      "venue",
      "location",
      "score",
      "fileName",
      "updatedAt",
    ],
    highlights: ["date", "badge", "fileName", "updatedAt"],
    media: ["mediaType", "date", "fileName", "updatedAt"],
  };

  const EXTRA_LABELS = {
    fileName: "ဖိုင်အမည်",
    createdAt: "စတင်ထည့်သွင်းချိန်",
    updatedAt: "နောက်ဆုံးပြင်ဆင်ချိန်",
    facebookUrl: "Facebook",
    youtubeUrl: "YouTube",
    instagramUrl: "Instagram",
  };

  function localizeValue(value, fallback) {
    return UI_LABELS[value] || value || fallback || "";
  }

  function detailUrl(record) {
    return (
      "detail.html?collection=" +
      encodeURIComponent(collection) +
      "&slug=" +
      encodeURIComponent(record.slug || record.id)
    );
  }

  function definitionLabel(fieldName) {
    const definition = COLLECTION_DEFINITIONS[collection];
    const field =
      definition && Array.isArray(definition.fields)
        ? definition.fields.find(function (item) {
            return item.name === fieldName;
          })
        : null;

    return EXTRA_LABELS[fieldName] || (field && field.label) || fieldName;
  }

  function formatTimestamp(value) {
    if (!value) {
      return "";
    }

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      return helpers.escapeHtml(String(value));
    }

    return helpers.escapeHtml(
      [
        helpers.formatDate(parsed.toISOString()),
        helpers.toMyanmarDigits(
          parsed.getHours().toString().padStart(2, "0") +
            ":" +
            parsed.getMinutes().toString().padStart(2, "0"),
        ),
      ]
        .filter(Boolean)
        .join(" | "),
    );
  }

  function buildNoticeMessage(data) {
    if (!data || !data._source) {
      return "";
    }

    if (data._source === "remote-unavailable") {
      return "Public Google Drive data ကို အခု browser က တိုက်ရိုက်မယူနိုင်သေးပါ။ Apps Script web app access setting ကို public ဖွင့်ထား/မထားနဲ့ `publicApiUrl` deploy ပြီး/မပြီး ပြန်စစ်ပါ။";
    }

    if (data._source === "cache") {
      return "Live data မရသေးလို့ browser cache ထဲက နောက်ဆုံး snapshot ကို ပြထားပါတယ်။";
    }

    return "";
  }

  function renderSyncNotice(data) {
    const element = document.getElementById("publicSyncNotice");
    if (!element) {
      return;
    }

    const message = buildNoticeMessage(data);
    element.hidden = !message;
    element.textContent = message;
  }

  function renderTagRow(tags) {
    const tagHtml = helpers
      .parseTags(tags)
      .map(function (tag) {
        return '<span class="tag">' + helpers.escapeHtml(tag) + "</span>";
      })
      .join("");

    return tagHtml ? '<div class="tag-row">' + tagHtml + "</div>" : "";
  }

  function createFactCard(label, value, isHtml) {
    if (!value) {
      return "";
    }

    return [
      '<article class="detail-fact">',
      "<span>" + helpers.escapeHtml(label) + "</span>",
      isHtml
        ? '<div class="detail-fact-value">' + value + "</div>"
        : "<strong>" + helpers.escapeHtml(value) + "</strong>",
      "</article>",
    ].join("");
  }

  function createLinkValue(url, label) {
    return (
      '<a class="text-link" href="' +
      helpers.escapeHtml(url) +
      '" target="_blank" rel="noreferrer">' +
      helpers.escapeHtml(label || url) +
      "</a>"
    );
  }

  function buildFacts(record) {
    const fields = FACT_FIELD_ORDER[collection] || [];

    return fields
      .map(function (fieldName) {
        const rawValue = record[fieldName];
        if (!rawValue) {
          return "";
        }

        if (fieldName === "date") {
          return createFactCard(
            definitionLabel(fieldName),
            helpers.formatDate(rawValue),
          );
        }
        if (fieldName === "time") {
          return createFactCard(
            definitionLabel(fieldName),
            helpers.formatTime(rawValue),
          );
        }
        if (fieldName === "status" || fieldName === "mediaType") {
          return createFactCard(
            definitionLabel(fieldName),
            localizeValue(rawValue),
          );
        }
        if (fieldName === "createdAt" || fieldName === "updatedAt") {
          return createFactCard(
            definitionLabel(fieldName),
            formatTimestamp(rawValue),
            true,
          );
        }
        if (/Url$/.test(fieldName)) {
          return createFactCard(
            definitionLabel(fieldName),
            createLinkValue(rawValue, rawValue),
            true,
          );
        }

        return createFactCard(definitionLabel(fieldName), rawValue);
      })
      .filter(Boolean)
      .join("");
  }

  function buildProfileLinks(record) {
    const links = [
      { label: "Facebook", url: record.facebookUrl },
      { label: "YouTube", url: record.youtubeUrl },
      { label: "Instagram", url: record.instagramUrl },
    ].filter(function (item) {
      return item.url;
    });

    if (!links.length) {
      return "";
    }

    return [
      '<section class="detail-section">',
      "<h2>ချိတ်ဆက်ရန် link များ</h2>",
      '<div class="detail-link-list">',
      links
        .map(function (item) {
          return (
            '<a class="button button-secondary button-link" href="' +
            helpers.escapeHtml(item.url) +
            '" target="_blank" rel="noreferrer">' +
            helpers.escapeHtml(item.label) +
            "</a>"
          );
        })
        .join(""),
      "</div>",
      "</section>",
    ].join("");
  }

  function renderAsset(record) {
    const asset = helpers.resolveRecordAsset(record);

    if (asset.kind === "empty") {
      return [
        '<div class="asset-card">',
        '<div class="section-chip">ဖိုင် / public link</div>',
        '<div class="detail-empty">ဒီ record အတွက် ဖိုင် (သို့) public link မချိတ်ထားသေးပါ။</div>',
        "</div>",
      ].join("");
    }

    let previewHtml = '<div class="detail-empty">Preview မရသေးပါ။</div>';
    if (asset.kind === "image") {
      let srcUrl = convertDriveUrl(asset.previewUrl || asset.fileUrl || "");
      previewHtml =
        '<img src="' +
        helpers.escapeHtml(srcUrl) +
        '" alt="' +
        helpers.escapeHtml(record.title || "") +
        '">';
    } else if (asset.kind === "video") {
      previewHtml =
        '<video controls preload="metadata" src="' +
        helpers.escapeHtml(asset.previewUrl) +
        '"></video>';
    } else if (asset.kind === "audio") {
      previewHtml =
        '<audio controls preload="metadata" src="' +
        helpers.escapeHtml(asset.previewUrl) +
        '"></audio>';
    } else if (asset.kind === "iframe") {
      previewHtml =
        '<iframe src="' +
        helpers.escapeHtml(asset.previewUrl) +
        '" loading="lazy" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>';
    }

    const fileName = asset.fileName
      ? '<p class="asset-note"><strong>ဖိုင်:</strong> ' +
        helpers.escapeHtml(asset.fileName) +
        "</p>"
      : "";
    const note = asset.note
      ? '<p class="asset-note">' + helpers.escapeHtml(asset.note) + "</p>"
      : "";
    const actions = (asset.actions || [])
      .map(function (action) {
        return (
          '<a class="button button-secondary button-link" href="' +
          helpers.escapeHtml(action.url) +
          '" target="_blank" rel="noreferrer">' +
          helpers.escapeHtml(action.label) +
          "</a>"
        );
      })
      .join("");

    return [
      '<div class="asset-card">',
      '<div class="section-chip">ချိတ်ဆက်ထားတဲ့ ဖိုင် / preview</div>',
      '<div class="asset-preview-shell">',
      previewHtml,
      "</div>",
      fileName,
      note,
      actions ? '<div class="detail-link-list">' + actions + "</div>" : "",
      "</div>",
    ].join("");
  }

  function renderSingleRecord(record) {
    const meta = [
      helpers.formatDateTime(record.date, record.time),
      record.competition,
      record.venue,
      record.location,
      record.score,
      localizeValue(record.status),
      localizeValue(record.mediaType),
    ]
      .filter(Boolean)
      .join(" | ");

    document.getElementById("detailTitle").textContent =
      record.title || "အသေးစိတ်အချက်အလက်";
    document.getElementById("detailMeta").textContent = meta;

    const sections = [
      record.badge
        ? '<div class="section-chip">' +
          helpers.escapeHtml(record.badge) +
          "</div>"
        : "",
      record.summary
        ? '<section class="detail-section"><h2>အကျဉ်းချုပ်</h2>' +
          helpers.textToHtml(record.summary) +
          "</section>"
        : "",
      record.body
        ? '<section class="detail-section"><h2>အသေးစိတ်</h2>' +
          helpers.textToHtml(record.body) +
          "</section>"
        : "",
      renderTagRow(record.tags)
        ? '<section class="detail-section"><h2>Tag များ</h2>' +
          renderTagRow(record.tags) +
          "</section>"
        : "",
      buildFacts(record)
        ? '<section class="detail-section"><h2>အချက်အလက်အပြည့်အစုံ</h2><div class="detail-facts-grid">' +
          buildFacts(record) +
          "</div></section>"
        : "",
      record.externalUrl
        ? '<section class="detail-section"><h2>ပြင်ပ link</h2><div class="detail-link-list"><a class="button button-secondary button-link" href="' +
          helpers.escapeHtml(record.externalUrl) +
          '" target="_blank" rel="noreferrer">ပြင်ပ link ကိုဖွင့်မယ်</a></div></section>'
        : "",
      collection === "profile" ? buildProfileLinks(record) : "",
    ].filter(Boolean);

    document.getElementById("detailBody").innerHTML = sections.join("");
    document.getElementById("detailAsset").innerHTML = renderAsset(record);
  }

  function renderCollectionArchive(records) {
    const definition = COLLECTION_DEFINITIONS[collection];
    document.getElementById("detailTitle").textContent =
      (definition ? definition.label : "အချက်အလက်များ") + " မှတ်တမ်း";
    document.getElementById("detailMeta").textContent =
      "ဒီ section ထဲက record အားလုံးကို အောက်မှာ ကြည့်နိုင်ပါတယ်။";

    if (!records.length) {
      document.getElementById("detailBody").innerHTML =
        '<div class="empty-state">ဒီ section ထဲမှာ record မရှိသေးပါ။</div>';
      document.getElementById("detailAsset").innerHTML =
        '<div class="detail-empty">စီမံခန့်ခွဲမှုစာမျက်နှာကနေ ပထမဆုံးအချက်အလက်ကို ထည့်နိုင်ပါတယ်။</div>';
      return;
    }

    document.getElementById("detailBody").innerHTML = records
      .map(function (record) {
        return [
          '<article class="feature-card detail-archive-card">',
          "<h3>" + helpers.escapeHtml(record.title) + "</h3>",
          '<div class="meta-line">' +
            helpers.escapeHtml(
              helpers.formatDateTime(record.date, record.time),
            ) +
            "</div>",
          "<p>" +
            helpers.escapeHtml(record.summary || record.body || "") +
            "</p>",
          renderTagRow(record.tags),
          '<a class="text-link" href="' +
            detailUrl(record) +
            '">အသေးစိတ်ကြည့်မယ်</a>',
          "</article>",
        ].join("");
      })
      .join("");

    document.getElementById("detailAsset").innerHTML =
      '<div class="detail-empty">စာရင်းထဲက record တစ်ခုကို နှိပ်ပြီး အပြည့်အစုံနဲ့ ချိတ်ထားတဲ့ဖိုင်တွေကို ကြည့်နိုင်ပါတယ်။</div>';
  }

  function renderLoadingState() {
    document.getElementById("detailTitle").textContent =
      "အချက်အလက်များကို ရယူနေပါတယ်...";
    document.getElementById("detailMeta").textContent =
      "Google Drive ကနေ record ကို ဆွဲယူနေပါတယ်။";
    document.getElementById("detailBody").innerHTML = [
      '<div class="loading-card" aria-hidden="true">',
      '<span class="loading-chip">တင်နေပါတယ်</span>',
      '<div class="loading-line loading-line-title"></div>',
      '<div class="loading-line"></div>',
      '<div class="loading-line"></div>',
      '<div class="loading-line loading-line-short"></div>',
      "</div>",
    ].join("");
    document.getElementById("detailAsset").innerHTML = [
      '<div class="loading-card" aria-hidden="true">',
      '<span class="loading-chip">ဖိုင်</span>',
      '<div class="loading-line loading-line-title"></div>',
      '<div class="loading-line"></div>',
      '<div class="loading-line loading-line-short"></div>',
      "</div>",
    ].join("");
  }

  function recordsForCollection(data, collectionName) {
    return helpers.sortRecords(
      (data && Array.isArray(data.records) ? data.records : []).filter(
        function (item) {
          return item.collection === collectionName;
        },
      ),
      collectionName,
    );
  }

  function convertDriveUrl(url) {
    if (!url || typeof url !== "string") return url;
    let finalUrl = url.trim();

    if (
      finalUrl.includes("drive.google.com") ||
      finalUrl.includes("docs.google.com")
    ) {
      let fileId = "";

      if (finalUrl.includes("/file/d/")) {
        fileId = finalUrl.split("/file/d/")[1].split("/")[0];
      } else if (finalUrl.includes("id=")) {
        const match = finalUrl.match(/id=([a-zA-Z0-9_-]+)/);
        if (match) fileId = match[1];
      }

      if (fileId) {
        return "https://lh3.googleusercontent.com/d/" + fileId;
      }
    }
    return finalUrl;
  }

  function renderSnapshot(data) {
    renderSyncNotice(data);

    if (!slug) {
      renderCollectionArchive(recordsForCollection(data, collection));
      return;
    }

    const record = recordsForCollection(data, collection).find(function (item) {
      return item.slug === slug || item.id === slug;
    });

    if (!record) {
      document.getElementById("detailTitle").textContent = "အချက်အလက် မတွေ့ပါ";
      document.getElementById("detailMeta").textContent =
        "တောင်းဆိုထားတဲ့ record ကို ရှာမတွေ့ပါ။";
      document.getElementById("detailBody").innerHTML =
        '<div class="empty-state">ဒီ record ကို ဖျက်ပြီးဖြစ်နိုင်သလို link မှားနေခြင်းလည်း ဖြစ်နိုင်ပါတယ်။</div>';
      document.getElementById("detailAsset").innerHTML =
        '<div class="detail-empty">Admin panel မှာ record ရှိ/မရှိ ပြန်စစ်နိုင်ပါတယ်။</div>';
      return;
    }

    renderSingleRecord(record);
  }

  async function init() {
    const definition = COLLECTION_DEFINITIONS[collection];
    if (!definition) {
      document.getElementById("detailTitle").textContent =
        "မသိတဲ့ section ဖြစ်နေပါတယ်";
      document.getElementById("detailMeta").textContent =
        "တောင်းဆိုထားတဲ့ section ကို စနစ်က မတွေ့ပါ။";
      document.getElementById("detailBody").innerHTML =
        '<div class="empty-state">ပင်မစာမျက်နှာကို ပြန်သွားပြီး မှန်ကန်တဲ့ section ကို ပြန်ရွေးပါ။</div>';
      document.getElementById("detailAsset").innerHTML =
        '<div class="detail-empty">Link ကို ပြန်စစ်ပြီး ထပ်မံဖွင့်ကြည့်ပါ။</div>';
      return;
    }

    renderLoadingState();

    const cachedData = store.getCachedData("site");
    if (
      cachedData &&
      Array.isArray(cachedData.records) &&
      cachedData.records.length
    ) {
      renderSnapshot(Object.assign({ _source: "cache" }, cachedData));
    }

    const remoteData = await store.fetchAll("site");
    renderSnapshot(remoteData);
  }

  init();
})();

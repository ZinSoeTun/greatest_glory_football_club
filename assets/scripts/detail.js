(function () {
  const { ClubStore, COLLECTION_DEFINITIONS, helpers } = window.GGCore;
  const store = new ClubStore(window.GG_CONFIG);
  const params = new URLSearchParams(window.location.search);
  const collection = params.get("collection") || "highlights";
  const slug = params.get("slug") || "";

  function detailUrl(record) {
    return "detail.html?collection=" + encodeURIComponent(collection) + "&slug=" + encodeURIComponent(record.slug || record.id);
  }

  function renderAsset(record) {
    const url = record.fileUrl || record.externalUrl || "";
    if (!url) {
      return '<div class="detail-empty">No file or public link has been attached to this record yet.</div>';
    }

    if (helpers.isImage(url, record.mediaType)) {
      return '<img src="' + helpers.escapeHtml(url) + '" alt="' + helpers.escapeHtml(record.title) + '">';
    }

    if (helpers.isVideo(url, record.mediaType)) {
      return '<video controls src="' + helpers.escapeHtml(url) + '"></video>';
    }

    if (helpers.isAudio(url, record.mediaType)) {
      return '<audio controls src="' + helpers.escapeHtml(url) + '"></audio>';
    }

    return '<p><a class="text-link" href="' + helpers.escapeHtml(url) + '" target="_blank" rel="noreferrer">Open attached asset</a></p>';
  }

  function renderSingleRecord(record) {
    const meta = [
      helpers.formatDateTime(record.date, record.time),
      record.competition,
      record.venue,
      record.location,
      record.score,
      record.status,
    ]
      .filter(Boolean)
      .join(" • ");

    document.getElementById("detailTitle").textContent = record.title || "Record detail";
    document.getElementById("detailMeta").textContent = meta;

    const tagLine = helpers
      .parseTags(record.tags)
      .map(function (tag) {
        return '<span class="tag">' + helpers.escapeHtml(tag) + "</span>";
      })
      .join("");

    document.getElementById("detailBody").innerHTML = [
      record.badge ? '<div class="section-chip">' + helpers.escapeHtml(record.badge) + "</div>" : "",
      record.summary ? "<h2>Summary</h2>" + helpers.textToHtml(record.summary) : "",
      record.body ? "<h2>Details</h2>" + helpers.textToHtml(record.body) : "",
      record.opponent ? "<h3>Opponent</h3><p>" + helpers.escapeHtml(record.opponent) + "</p>" : "",
      record.externalUrl ? '<p><a class="text-link" href="' + helpers.escapeHtml(record.externalUrl) + '" target="_blank" rel="noreferrer">Open external link</a></p>' : "",
      tagLine ? '<div class="tag-row">' + tagLine + "</div>" : "",
    ].join("");
    document.getElementById("detailAsset").innerHTML = renderAsset(record);
  }

  function renderCollectionArchive(records) {
    const definition = COLLECTION_DEFINITIONS[collection];
    document.getElementById("detailTitle").textContent = (definition ? definition.label : "Records") + " Archive";
    document.getElementById("detailMeta").textContent = "Browse all current records in this section.";

    if (!records.length) {
      document.getElementById("detailBody").innerHTML = '<div class="empty-state">No records available in this section yet.</div>';
      document.getElementById("detailAsset").innerHTML = '<div class="detail-empty">Use the admin page to add your first record.</div>';
      return;
    }

    document.getElementById("detailBody").innerHTML = records
      .map(function (record) {
        return [
          '<article class="feature-card">',
          "<h3>" + helpers.escapeHtml(record.title) + "</h3>",
          '<div class="meta-line">' + helpers.escapeHtml(helpers.formatDateTime(record.date, record.time)) + "</div>",
          "<p>" + helpers.escapeHtml(record.summary || "") + "</p>",
          '<a class="text-link" href="' + detailUrl(record) + '">Open detail</a>',
          "</article>",
        ].join("");
      })
      .join("");

    document.getElementById("detailAsset").innerHTML =
      '<div class="detail-empty">Choose a record from the list to see its full details and attached media.</div>';
  }

  async function init() {
    const definition = COLLECTION_DEFINITIONS[collection];
    if (!definition) {
      document.getElementById("detailTitle").textContent = "Unknown collection";
      document.getElementById("detailMeta").textContent = "The requested section does not exist.";
      document.getElementById("detailBody").innerHTML = '<div class="empty-state">Please return to the homepage and open a valid section.</div>';
      return;
    }

    if (!slug) {
      const records = await store.list(collection, "site");
      renderCollectionArchive(records);
      return;
    }

    const record = await store.find(collection, slug, "slug", "site");
    if (!record) {
      document.getElementById("detailTitle").textContent = "Record not found";
      document.getElementById("detailMeta").textContent = "The requested record could not be found.";
      document.getElementById("detailBody").innerHTML = '<div class="empty-state">The record may have been removed or the link may be incorrect.</div>';
      return;
    }

    renderSingleRecord(record);
  }

  init();
})();

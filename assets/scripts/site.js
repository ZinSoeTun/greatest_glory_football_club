(function () {
  const { ClubStore, helpers } = window.GGCore;
  const store = new ClubStore(window.GG_CONFIG);

  const navToggle = document.querySelector(".nav-toggle");
  const primaryNav = document.getElementById("primary-nav");

  if (navToggle && primaryNav) {
    navToggle.addEventListener("click", function () {
      const isOpen = primaryNav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  function detailUrl(collection, record) {
    return "detail.html?collection=" + encodeURIComponent(collection) + "&slug=" + encodeURIComponent(record.slug || record.id);
  }

  function buildMeta(record) {
    return [
      helpers.formatDateTime(record.date, record.time),
      record.competition,
      record.venue,
      record.location,
    ]
      .filter(Boolean)
      .join(" • ");
  }

  function createEmptyState(message) {
    return '<div class="empty-state">' + helpers.escapeHtml(message) + "</div>";
  }

  function createMatchCard(collection, record, withScore) {
    return [
      '<article class="match-card">',
      '<div class="card-label"><strong>' + helpers.escapeHtml(record.status || collection) + "</strong></div>",
      "<h3>" + helpers.escapeHtml(record.title) + "</h3>",
      '<div class="meta-line">' + helpers.escapeHtml(buildMeta(record)) + "</div>",
      record.score ? '<div class="score-line">' + helpers.escapeHtml(record.score) + "</div>" : "",
      "<p>" + helpers.escapeHtml(record.summary || "") + "</p>",
      '<a class="text-link" href="' + detailUrl(collection, record) + '">Open detail</a>',
      "</article>",
    ].join("");
  }

  function createFeatureCard(record) {
    return [
      '<article class="feature-card">',
      '<div class="card-label"><strong>' + helpers.escapeHtml(record.badge || "Highlight") + "</strong></div>",
      "<h3>" + helpers.escapeHtml(record.title) + "</h3>",
      '<div class="meta-line">' + helpers.escapeHtml(helpers.formatDate(record.date)) + "</div>",
      "<p>" + helpers.escapeHtml(record.summary || "") + "</p>",
      '<div class="tag-row">' +
        helpers
          .parseTags(record.tags)
          .slice(0, 3)
          .map(function (tag) {
            return '<span class="tag">' + helpers.escapeHtml(tag) + "</span>";
          })
          .join("") +
        "</div>",
      '<a class="text-link" href="' + detailUrl("highlights", record) + '">Read more</a>',
      "</article>",
    ].join("");
  }

  function createMediaCard(record) {
    const previewUrl = record.fileUrl || record.externalUrl || "";
    let preview = '<div class="media-preview"><span class="asset-label">No preview yet</span></div>';

    if (previewUrl && helpers.isImage(previewUrl, record.mediaType)) {
      preview = '<div class="media-preview"><img src="' + helpers.escapeHtml(previewUrl) + '" alt="' + helpers.escapeHtml(record.title) + '"></div>';
    } else if (previewUrl && helpers.isVideo(previewUrl, record.mediaType)) {
      preview = '<div class="media-preview"><span class="asset-label">Video ready</span></div>';
    } else if (previewUrl && helpers.isAudio(previewUrl, record.mediaType)) {
      preview = '<div class="media-preview"><span class="asset-label">Audio ready</span></div>';
    }

    return [
      '<article class="media-card">',
      preview,
      '<div class="card-label"><strong>' + helpers.escapeHtml(record.mediaType || "media") + "</strong></div>",
      "<h3>" + helpers.escapeHtml(record.title) + "</h3>",
      "<p>" + helpers.escapeHtml(record.summary || "") + "</p>",
      '<a class="text-link" href="' + detailUrl("media", record) + '">View asset</a>',
      "</article>",
    ].join("");
  }

  function renderProfile(profile) {
    document.getElementById("heroTitle").textContent = profile.heroTitle || profile.title || "Greatest Glory Football Club";
    document.getElementById("heroText").textContent = profile.heroText || profile.summary || "";
    document.getElementById("clubNameHeading").textContent = profile.title || "Greatest Glory Football Club";
    document.getElementById("clubSummary").textContent = profile.body || profile.summary || "";
    document.getElementById("foundedYear").textContent = profile.foundedYear || "2026";
    document.getElementById("clubCity").textContent = profile.city || "Yangon";
    document.getElementById("clubGround").textContent = profile.ground || "Glory Arena";
    document.getElementById("clubMotto").textContent = profile.motto || "Rise With Purpose";

    const email = document.getElementById("contactEmail");
    const phone = document.getElementById("contactPhone");
    if (profile.contactEmail) {
      email.textContent = profile.contactEmail;
      email.href = "mailto:" + profile.contactEmail;
    }
    if (profile.contactPhone) {
      phone.textContent = profile.contactPhone;
      phone.href = "tel:" + profile.contactPhone.replace(/\s+/g, "");
    }

    const socialLinks = document.getElementById("socialLinks");
    const socials = [
      { label: "Facebook", url: profile.facebookUrl },
      { label: "YouTube", url: profile.youtubeUrl },
      { label: "Instagram", url: profile.instagramUrl },
    ].filter(function (item) {
      return item.url;
    });

    socialLinks.innerHTML = socials
      .map(function (item) {
        return '<a href="' + helpers.escapeHtml(item.url) + '" target="_blank" rel="noreferrer">' + helpers.escapeHtml(item.label) + "</a>";
      })
      .join("");
  }

  function renderNextMatch(fixtures) {
    const container = document.getElementById("nextMatchCard");
    const nextMatch = fixtures[0];
    if (!nextMatch) {
      container.innerHTML = createEmptyState("No fixture yet. Use admin mode to add one.");
      return;
    }

    container.innerHTML = [
      "<h3>" + helpers.escapeHtml(nextMatch.opponent || nextMatch.title) + "</h3>",
      '<div class="meta-line">' + helpers.escapeHtml(buildMeta(nextMatch)) + "</div>",
      "<p>" + helpers.escapeHtml(nextMatch.summary || "") + "</p>",
      '<a class="text-link" href="' + detailUrl("fixtures", nextMatch) + '">Match details</a>',
    ].join("");
  }

  function renderTicker(announcements) {
    const container = document.getElementById("announcementTicker");
    if (!announcements.length) {
      container.innerHTML = '<div class="ticker-pill">Add club news from the admin panel.</div>';
      return;
    }
    container.innerHTML = announcements
      .slice(0, 4)
      .map(function (item) {
        return '<a class="ticker-pill" href="' + detailUrl("announcements", item) + '">' + helpers.escapeHtml(item.title) + "</a>";
      })
      .join("");
  }

  function renderGrid(containerId, records, renderer, emptyMessage) {
    const container = document.getElementById(containerId);
    if (!records.length) {
      container.innerHTML = createEmptyState(emptyMessage);
      return;
    }
    container.innerHTML = records.map(renderer).join("");
  }

  async function init() {
    const profile = await store.getProfile("site");
    const announcements = await store.list("announcements", "site");
    const fixtures = await store.list("fixtures", "site");
    const results = await store.list("results", "site");
    const highlights = await store.list("highlights", "site");
    const media = await store.list("media", "site");

    renderProfile(profile);
    renderNextMatch(fixtures);
    renderTicker(announcements);
    renderGrid("fixturesGrid", fixtures.slice(0, 3), function (record) {
      return createMatchCard("fixtures", record);
    }, "No fixtures yet.");
    renderGrid("resultsGrid", results.slice(0, 3), function (record) {
      return createMatchCard("results", record, true);
    }, "No results yet.");
    renderGrid("highlightsGrid", highlights.slice(0, 3), createFeatureCard, "No highlights yet.");
    renderGrid("mediaGrid", media.slice(0, 3), createMediaCard, "No media records yet.");
  }

  init();
})();

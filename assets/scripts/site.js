(function () {
  const { ClubStore, helpers } = window.GGCore;
  const store = new ClubStore(window.GG_CONFIG);

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

  const navToggle = document.querySelector(".nav-toggle");
  const primaryNav = document.getElementById("primary-nav");

  if (navToggle && primaryNav) {
    navToggle.addEventListener("click", function () {
      const isOpen = primaryNav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  function localizeValue(value, fallback) {
    return UI_LABELS[value] || value || fallback || "";
  }

  function detailUrl(collection, record) {
    return (
      "detail.html?collection=" +
      encodeURIComponent(collection) +
      "&slug=" +
      encodeURIComponent(record.slug || record.id)
    );
  }

  function buildMeta(record) {
    return [
      helpers.formatDateTime(record.date, record.time),
      record.competition,
      record.venue,
      record.location,
    ]
      .filter(Boolean)
      .join(" | ");
  }

  function createEmptyState(message) {
    return '<div class="empty-state">' + helpers.escapeHtml(message) + "</div>";
  }

  function buildNoticeMessage(data) {
    if (!data || !data._source) {
      return "";
    }

    if (data._source === "remote-unavailable") {
      return "Public Google Drive data ကို အခု browser က တိုက်ရိုက်မယူနိုင်သေးပါ။ Apps Script web app access setting နဲ့ `publicApiUrl` deploy အခြေအနေကို ပြန်စစ်ပေးပါ။";
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

  function createMatchCard(collection, record) {
    return [
      '<article class="match-card">',
      '<div class="card-label"><strong>' +
        helpers.escapeHtml(
          localizeValue(record.status || collection, "ပွဲစဉ်"),
        ) +
        "</strong></div>",
      "<h3>" + helpers.escapeHtml(record.title) + "</h3>",
      '<div class="meta-line">' +
        helpers.escapeHtml(buildMeta(record)) +
        "</div>",
      record.score
        ? '<div class="score-line">' +
          helpers.escapeHtml(record.score) +
          "</div>"
        : "",
      "<p>" + helpers.escapeHtml(record.summary || "") + "</p>",
      '<a class="text-link" href="' +
        detailUrl(collection, record) +
        '">အသေးစိတ်ကြည့်မယ်</a>',
      "</article>",
    ].join("");
  }

  function createFeatureCard(record) {
    return [
      '<article class="feature-card">',
      '<div class="card-label"><strong>' +
        helpers.escapeHtml(record.badge || "ထင်ရှားသတင်း") +
        "</strong></div>",
      "<h3>" + helpers.escapeHtml(record.title) + "</h3>",
      '<div class="meta-line">' +
        helpers.escapeHtml(helpers.formatDate(record.date)) +
        "</div>",
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
      '<a class="text-link" href="' +
        detailUrl("highlights", record) +
        '">ဆက်ဖတ်မယ်</a>',
      "</article>",
    ].join("");
  }

  function assetPreviewLabel(asset) {
    if (!asset || asset.kind === "empty") {
      return "preview မရှိသေးပါ";
    }
    if (
      asset.kind === "video" ||
      (asset.kind === "iframe" && asset.mediaType === "video")
    ) {
      return "ဗီဒီယို preview";
    }
    if (
      asset.kind === "audio" ||
      (asset.kind === "iframe" && asset.mediaType === "audio")
    ) {
      return "အသံဖိုင် preview";
    }
    if (asset.kind === "iframe") {
      return "ဖိုင် preview";
    }
    if (asset.kind === "link") {
      return "ပြင်ပ link";
    }
    return asset.previewLabel || "preview";
  }

  function createMediaCard(record) {
    const asset = helpers.resolveRecordAsset(record);
    let preview =
      '<div class="media-preview"><span class="asset-label">' +
      helpers.escapeHtml(assetPreviewLabel(asset)) +
      "</span></div>";

    if (asset.kind === "image" && asset.previewUrl) {
      let srcUrl = convertDriveUrl(asset.previewUrl || asset.fileUrl || "");
      previewHtml =
        '<img src="' +
        helpers.escapeHtml(srcUrl) +
        '" alt="' +
        helpers.escapeHtml(record.title || "") +
        '">';
    }

    return [
      '<article class="media-card">',
      preview,
      '<div class="card-label"><strong>' +
        helpers.escapeHtml(localizeValue(record.mediaType, "မီဒီယာ")) +
        "</strong></div>",
      "<h3>" + helpers.escapeHtml(record.title) + "</h3>",
      "<p>" + helpers.escapeHtml(record.summary || "") + "</p>",
      '<a class="text-link" href="' +
        detailUrl("media", record) +
        '">ဖိုင်ကြည့်မယ်</a>',
      "</article>",
    ].join("");
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

  function renderProfile(profile) {
    document.getElementById("heroTitle").textContent =
      profile.heroTitle || profile.title || "အသင်း profile ကို ဒီနေရာမှာ ပြမယ်";
    document.getElementById("heroText").textContent =
      profile.heroText ||
      profile.summary ||
      "Admin control room ထဲက Club Profile section မှာ official အသင်းအချက်အလက်တွေ ထည့်ပြီး ဒီနေရာကို ဖြည့်နိုင်ပါတယ်။";
    document.getElementById("clubNameHeading").textContent =
      profile.title || "အသင်းနာမည် မထည့်ရသေးပါ";
    document.getElementById("clubSummary").textContent =
      profile.body ||
      profile.summary ||
      "အသင်းအကြောင်းအရာ၊ ရည်ရွယ်ချက်၊ ဆက်သွယ်ရန်နဲ့ social link တွေကို admin မှာထည့်လိုက်ရင် ဒီစာသားနေရာမှာ တကယ့် content ကို ပြသပါမယ်။";
    document.getElementById("foundedYear").textContent =
      profile.foundedYear || "-";
    document.getElementById("clubCity").textContent = profile.city || "-";
    document.getElementById("clubGround").textContent = profile.ground || "-";
    document.getElementById("clubMotto").textContent =
      profile.motto || "ဆောင်ပုဒ် မထည့်ရသေးပါ";

    const email = document.getElementById("contactEmail");
    const phone = document.getElementById("contactPhone");
    if (profile.contactEmail) {
      email.textContent = profile.contactEmail;
      email.href = "mailto:" + profile.contactEmail;
    } else {
      email.textContent = "Email မထည့်ရသေးပါ";
      email.removeAttribute("href");
    }

    if (profile.contactPhone) {
      phone.textContent = profile.contactPhone;
      phone.href = "tel:" + profile.contactPhone.replace(/\s+/g, "");
    } else {
      phone.textContent = "ဖုန်းနံပါတ် မထည့်ရသေးပါ";
      phone.removeAttribute("href");
    }

    const socialLinks = document.getElementById("socialLinks");
    const socials = [
      { label: "Facebook", url: profile.facebookUrl },
      { label: "YouTube", url: profile.youtubeUrl },
      { label: "Instagram", url: profile.instagramUrl },
    ].filter(function (item) {
      return item.url;
    });

    socialLinks.innerHTML = socials.length
      ? socials
          .map(function (item) {
            return (
              '<a href="' +
              helpers.escapeHtml(item.url) +
              '" target="_blank" rel="noreferrer">' +
              helpers.escapeHtml(item.label) +
              "</a>"
            );
          })
          .join("")
      : '<span class="empty-inline">Social link မထည့်ရသေးပါ</span>';
  }

  function renderNextMatch(fixtures) {
    const container = document.getElementById("nextMatchCard");
    const nextMatch = fixtures[0];
    if (!nextMatch) {
      container.innerHTML = createEmptyState(
        "ပွဲစဉ်မရှိသေးပါ။ စီမံခန့်ခွဲမှုစာမျက်နှာကနေ ပွဲစဉ်အသစ် ထည့်နိုင်ပါတယ်။",
      );
      return;
    }

    container.innerHTML = [
      "<h3>" +
        helpers.escapeHtml(nextMatch.opponent || nextMatch.title) +
        "</h3>",
      '<div class="meta-line">' +
        helpers.escapeHtml(buildMeta(nextMatch)) +
        "</div>",
      "<p>" + helpers.escapeHtml(nextMatch.summary || "") + "</p>",
      '<a class="text-link" href="' +
        detailUrl("fixtures", nextMatch) +
        '">ပွဲအသေးစိတ်</a>',
    ].join("");
  }

  function renderTicker(announcements) {
    const container = document.getElementById("announcementTicker");
    if (!announcements.length) {
      container.innerHTML =
        '<div class="ticker-pill">စီမံခန့်ခွဲမှုစာမျက်နှာကနေ အသင်းသတင်းများ ထည့်နိုင်ပါတယ်။</div>';
      return;
    }

    container.innerHTML = announcements
      .slice(0, 4)
      .map(function (item) {
        return (
          '<a class="ticker-pill" href="' +
          detailUrl("announcements", item) +
          '">' +
          helpers.escapeHtml(item.title) +
          "</a>"
        );
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

  function createLoadingBlock(label) {
    return [
      '<div class="loading-card" aria-hidden="true">',
      '<span class="loading-chip">' +
        helpers.escapeHtml(label || "တင်နေပါတယ်") +
        "</span>",
      '<div class="loading-line loading-line-title"></div>',
      '<div class="loading-line"></div>',
      '<div class="loading-line loading-line-short"></div>',
      "</div>",
    ].join("");
  }

  function renderLoadingState() {
    document.getElementById("heroTitle").textContent =
      "အချက်အလက်များကို ရယူနေပါတယ်...";
    document.getElementById("heroText").textContent =
      "Google Drive နဲ့ ချိတ်ထားတဲ့ club data တွေကို ဆွဲယူနေပါတယ်။";
    document.getElementById("clubNameHeading").textContent =
      "Club profile ကို ပြင်ဆင်နေပါတယ်...";
    document.getElementById("clubSummary").textContent =
      "ပေါ်လာမယ့် အချက်အလက်များကို စနစ်က ပြင်ဆင်နေပါတယ်။";
    document.getElementById("foundedYear").textContent = "...";
    document.getElementById("clubCity").textContent = "...";
    document.getElementById("clubGround").textContent = "...";
    document.getElementById("clubMotto").textContent = "တင်နေပါတယ်...";
    document.getElementById("contactEmail").textContent = "တင်နေပါတယ်...";
    document.getElementById("contactEmail").removeAttribute("href");
    document.getElementById("contactPhone").textContent = "တင်နေပါတယ်...";
    document.getElementById("contactPhone").removeAttribute("href");
    document.getElementById("socialLinks").innerHTML =
      '<span class="loading-inline">Social link များကို ရယူနေပါတယ်...</span>';
    document.getElementById("nextMatchCard").innerHTML =
      createLoadingBlock("နောက်လာမယ့်ပွဲ");
    document.getElementById("announcementTicker").innerHTML =
      '<div class="loading-inline">သတင်းနဲ့ update များကို ရယူနေပါတယ်...</div>';
    document.getElementById("fixturesGrid").innerHTML =
      createLoadingBlock("ပွဲစဉ်") +
      createLoadingBlock("ပွဲစဉ်") +
      createLoadingBlock("ပွဲစဉ်");
    document.getElementById("resultsGrid").innerHTML =
      createLoadingBlock("ရလဒ်") +
      createLoadingBlock("ရလဒ်") +
      createLoadingBlock("ရလဒ်");
    document.getElementById("highlightsGrid").innerHTML =
      createLoadingBlock("ထင်ရှားသတင်း") +
      createLoadingBlock("ထင်ရှားသတင်း") +
      createLoadingBlock("ထင်ရှားသတင်း");
    document.getElementById("mediaGrid").innerHTML =
      createLoadingBlock("မီဒီယာ") +
      createLoadingBlock("မီဒီယာ") +
      createLoadingBlock("မီဒီယာ");
  }

  function recordsForCollection(data, collection) {
    return helpers.sortRecords(
      (data && Array.isArray(data.records) ? data.records : []).filter(
        function (item) {
          return item.collection === collection;
        },
      ),
      collection,
    );
  }

  function renderSnapshot(data) {
    renderSyncNotice(data);

    const profile = recordsForCollection(data, "profile")[0] || {};
    const announcements = recordsForCollection(data, "announcements");
    const fixtures = recordsForCollection(data, "fixtures");
    const results = recordsForCollection(data, "results");
    const highlights = recordsForCollection(data, "highlights");
    const media = recordsForCollection(data, "media");

    renderProfile(profile);
    renderNextMatch(fixtures);
    renderTicker(announcements);
    renderGrid(
      "fixturesGrid",
      fixtures.slice(0, 3),
      function (record) {
        return createMatchCard("fixtures", record);
      },
      "ပွဲစဉ် မရှိသေးပါ။",
    );
    renderGrid(
      "resultsGrid",
      results.slice(0, 3),
      function (record) {
        return createMatchCard("results", record);
      },
      "ရလဒ် မရှိသေးပါ။",
    );
    renderGrid(
      "highlightsGrid",
      highlights.slice(0, 3),
      createFeatureCard,
      "Highlight မရှိသေးပါ။",
    );
    renderGrid(
      "mediaGrid",
      media.slice(0, 3),
      createMediaCard,
      "မီဒီယာ record မရှိသေးပါ။",
    );
  }

  async function init() {
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

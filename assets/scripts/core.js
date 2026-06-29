(function () {
  const config = window.GG_CONFIG || {};
  const COLLECTION_ORDER = [
    "profile",
    "announcements",
    "fixtures",
    "results",
    "highlights",
    "media",
  ];

  const DEFAULT_PROFILE = {
    id: "profile-main",
    collection: "profile",
    title: "Greatest Glory Football Club",
    slug: "club-profile",
    heroTitle: "From fresh ambition to fearless football.",
    heroText:
      "Greatest Glory Football Club is a young community-driven team building a serious identity through discipline, youth development, and bold attacking energy.",
    summary:
      "A newly formed football club with a premium identity, local ambition, and a long-term plan to grow into a respected name on and off the pitch.",
    body:
      "Greatest Glory Football Club was created to bring committed players, supporters, and volunteers together around a modern football project. The club is still in its early stage, but the goal is clear: build a strong culture, develop talented players, and create matchdays that the local community genuinely cares about.",
    motto: "Rise With Purpose",
    foundedYear: "2026",
    city: "Yangon",
    ground: "Glory Arena",
    contactEmail: "hello@greatestgloryfc.club",
    contactPhone: "+95 9 000 000 000",
    facebookUrl: "https://facebook.com/",
    youtubeUrl: "https://youtube.com/",
    instagramUrl: "https://instagram.com/",
    createdAt: "2026-06-29T00:00:00.000Z",
    updatedAt: "2026-06-29T00:00:00.000Z",
  };

  const SEED_RECORDS = [
    DEFAULT_PROFILE,
    {
      id: "announce-launch",
      collection: "announcements",
      title: "Club launch and supporter registration open",
      slug: "club-launch-supporter-registration",
      badge: "Announcement",
      date: "2026-07-05",
      summary:
        "Supporters can start registering interest for matchday updates, volunteer opportunities, and early club news.",
      body:
        "Greatest Glory FC is officially beginning its public journey. Early supporters can join the contact list, help with matchday operations, and stay close to the first chapter of the club's story.",
      tags: "supporters, launch, community",
      createdAt: "2026-06-29T00:00:00.000Z",
      updatedAt: "2026-06-29T00:00:00.000Z",
    },
    {
      id: "announce-trials",
      collection: "announcements",
      title: "Open trials planned for emerging local talent",
      slug: "open-trials-emerging-local-talent",
      badge: "Trials",
      date: "2026-07-12",
      summary:
        "The club intends to welcome ambitious young players who want to compete in a disciplined environment.",
      body:
        "Initial player assessments will focus on work rate, positional understanding, and coachability. The club wants to build around players who are serious about growth and teamwork.",
      tags: "academy, talent, trials",
      createdAt: "2026-06-29T00:00:00.000Z",
      updatedAt: "2026-06-29T00:00:00.000Z",
    },
    {
      id: "fixture-royal-tigers",
      collection: "fixtures",
      title: "Pre-season friendly vs Royal Tigers FC",
      slug: "pre-season-friendly-vs-royal-tigers-fc",
      status: "Scheduled",
      date: "2026-07-20",
      time: "16:00",
      opponent: "Royal Tigers FC",
      venue: "Glory Arena",
      location: "Yangon",
      competition: "Pre-season Friendly",
      summary:
        "A first public test for the squad with emphasis on organisation, pressing structure, and transitions.",
      body:
        "This match is intended to set the tone for the club's playing identity. Supporters should expect energy, aggressive pressing, and a strong desire to control tempo from the first whistle.",
      tags: "friendly, home, pre-season",
      createdAt: "2026-06-29T00:00:00.000Z",
      updatedAt: "2026-06-29T00:00:00.000Z",
    },
    {
      id: "fixture-east-harbour",
      collection: "fixtures",
      title: "City Challenge Cup vs East Harbour Athletic",
      slug: "city-challenge-cup-vs-east-harbour-athletic",
      status: "Scheduled",
      date: "2026-07-30",
      time: "18:30",
      opponent: "East Harbour Athletic",
      venue: "Victory Municipal Ground",
      location: "Yangon",
      competition: "City Challenge Cup",
      summary:
        "A higher-intensity fixture that should reveal how quickly the squad adapts to competitive pressure.",
      body:
        "The City Challenge Cup match is expected to test the club's shape, mentality, and in-game discipline against a sharper opponent.",
      tags: "cup, away, test",
      createdAt: "2026-06-29T00:00:00.000Z",
      updatedAt: "2026-06-29T00:00:00.000Z",
    },
    {
      id: "result-city-united",
      collection: "results",
      title: "Training match vs City United U21",
      slug: "training-match-vs-city-united-u21",
      status: "Finished",
      date: "2026-06-21",
      time: "17:00",
      opponent: "City United U21",
      venue: "Glory Arena",
      location: "Yangon",
      competition: "Training Match",
      score: "GGFC 2 - 1 City United U21",
      summary:
        "A confident second-half display showed promise in midfield structure and quick wing combinations.",
      body:
        "Greatest Glory FC responded well after conceding early, finishing stronger and showing the kind of intensity the coaching staff wants to build around.",
      tags: "friendly, development, win",
      createdAt: "2026-06-29T00:00:00.000Z",
      updatedAt: "2026-06-29T00:00:00.000Z",
    },
    {
      id: "result-starline",
      collection: "results",
      title: "Closed-door friendly vs Starline FC",
      slug: "closed-door-friendly-vs-starline-fc",
      status: "Finished",
      date: "2026-06-14",
      time: "15:30",
      opponent: "Starline FC",
      venue: "Training Ground B",
      location: "Yangon",
      competition: "Friendly",
      score: "GGFC 1 - 1 Starline FC",
      summary:
        "The squad showed defensive discipline and kept shape well, even though chance creation still needs work.",
      body:
        "A tight draw gave the staff useful information about distances between the lines and the need for sharper decision making in the final third.",
      tags: "friendly, analysis, draw",
      createdAt: "2026-06-29T00:00:00.000Z",
      updatedAt: "2026-06-29T00:00:00.000Z",
    },
    {
      id: "highlight-identity",
      collection: "highlights",
      title: "What Greatest Glory FC wants to stand for",
      slug: "what-greatest-glory-fc-wants-to-stand-for",
      badge: "Feature",
      date: "2026-06-29",
      summary:
        "The club wants to be known for energy, discipline, and a style of football that feels ambitious from day one.",
      body:
        "More than results alone, the project is about identity. The long-term ambition is to become a club that local supporters trust, enjoy, and proudly represent. That means setting standards early in training, communication, and matchday professionalism.",
      externalUrl: "",
      tags: "identity, culture, long-term",
      createdAt: "2026-06-29T00:00:00.000Z",
      updatedAt: "2026-06-29T00:00:00.000Z",
    },
    {
      id: "highlight-supporters",
      collection: "highlights",
      title: "Why the supporter culture matters this early",
      slug: "why-the-supporter-culture-matters-this-early",
      badge: "Supporters",
      date: "2026-06-28",
      summary:
        "Building a strong football environment begins before the club becomes famous. The atmosphere starts now.",
      body:
        "The website, announcements, and media board are designed to help a young club look organised and trustworthy. Supporters do not only arrive after success; they help create the conditions for it.",
      externalUrl: "",
      tags: "supporters, media, launch",
      createdAt: "2026-06-29T00:00:00.000Z",
      updatedAt: "2026-06-29T00:00:00.000Z",
    },
    {
      id: "media-crest",
      collection: "media",
      title: "Official club crest",
      slug: "official-club-crest",
      mediaType: "image",
      date: "2026-06-29",
      summary:
        "The first visual identity anchor for the club, used across match graphics and branded materials.",
      fileUrl: "assets/images/logo.png",
      fileName: "logo.png",
      tags: "branding, crest, image",
      createdAt: "2026-06-29T00:00:00.000Z",
      updatedAt: "2026-06-29T00:00:00.000Z",
    },
    {
      id: "media-sponsor-pack",
      collection: "media",
      title: "Future sponsor presentation slot",
      slug: "future-sponsor-presentation-slot",
      mediaType: "document",
      date: "2026-06-29",
      summary:
        "This slot can later point to a Google Drive PDF, Excel budget, or partnership proposal uploaded from the admin panel.",
      externalUrl: "",
      tags: "documents, sponsorship, drive",
      createdAt: "2026-06-29T00:00:00.000Z",
      updatedAt: "2026-06-29T00:00:00.000Z",
    },
  ];

  const COLLECTION_DEFINITIONS = {
    profile: {
      label: "Club Profile",
      description: "Main club identity content for the homepage.",
      allowMultiple: false,
      fields: [
        { name: "title", label: "Club Name", type: "text", required: true, placeholder: "Greatest Glory Football Club" },
        { name: "heroTitle", label: "Hero Title", type: "text", required: true, placeholder: "From fresh ambition to fearless football." },
        { name: "heroText", label: "Hero Intro", type: "textarea", required: true, placeholder: "Short intro for the hero section." },
        { name: "summary", label: "Short Summary", type: "textarea", required: true, placeholder: "Short club summary." },
        { name: "body", label: "Club Story", type: "textarea", required: true, placeholder: "Longer story about the club." },
        { name: "motto", label: "Motto", type: "text", placeholder: "Rise With Purpose" },
        { name: "foundedYear", label: "Founded Year", type: "text", placeholder: "2026" },
        { name: "city", label: "Base City", type: "text", placeholder: "Yangon" },
        { name: "ground", label: "Home Ground", type: "text", placeholder: "Glory Arena" },
        { name: "contactEmail", label: "Contact Email", type: "email", placeholder: "hello@greatestgloryfc.club" },
        { name: "contactPhone", label: "Contact Phone", type: "text", placeholder: "+95 9 000 000 000" },
        { name: "facebookUrl", label: "Facebook URL", type: "url", placeholder: "https://facebook.com/..." },
        { name: "youtubeUrl", label: "YouTube URL", type: "url", placeholder: "https://youtube.com/..." },
        { name: "instagramUrl", label: "Instagram URL", type: "url", placeholder: "https://instagram.com/..." },
      ],
    },
    announcements: {
      label: "Announcements",
      description: "Ticker news, launch notes, and club updates.",
      allowMultiple: true,
      fields: [
        { name: "title", label: "Title", type: "text", required: true, placeholder: "Club launch and supporter registration open" },
        { name: "slug", label: "Custom Slug", type: "text", placeholder: "Leave blank to auto-generate" },
        { name: "badge", label: "Badge", type: "text", placeholder: "Announcement" },
        { name: "date", label: "Date", type: "date" },
        { name: "summary", label: "Summary", type: "textarea", required: true, placeholder: "Short announcement summary." },
        { name: "body", label: "Full Message", type: "textarea", placeholder: "Longer text for detail view." },
        { name: "tags", label: "Tags", type: "text", placeholder: "supporters, launch, community" },
        { name: "externalUrl", label: "External Link", type: "url", placeholder: "Optional external page or document link" },
        { name: "file", label: "Attach File", type: "file", accept: "image/*,video/*,audio/*,.pdf,.csv,.xlsx,.xls,.doc,.docx" },
      ],
    },
    fixtures: {
      label: "Fixtures",
      description: "Upcoming match schedule with kickoff details.",
      allowMultiple: true,
      fields: [
        { name: "title", label: "Match Title", type: "text", required: true, placeholder: "Pre-season friendly vs Royal Tigers FC" },
        { name: "slug", label: "Custom Slug", type: "text", placeholder: "Leave blank to auto-generate" },
        { name: "status", label: "Status", type: "select", options: ["Scheduled", "Postponed", "Live", "Completed"] },
        { name: "date", label: "Date", type: "date" },
        { name: "time", label: "Kickoff Time", type: "time" },
        { name: "opponent", label: "Opponent", type: "text", placeholder: "Royal Tigers FC" },
        { name: "venue", label: "Venue", type: "text", placeholder: "Glory Arena" },
        { name: "location", label: "City / Location", type: "text", placeholder: "Yangon" },
        { name: "competition", label: "Competition", type: "text", placeholder: "Pre-season Friendly" },
        { name: "summary", label: "Summary", type: "textarea", placeholder: "Short fixture note." },
        { name: "body", label: "Detail", type: "textarea", placeholder: "Longer fixture preview." },
        { name: "tags", label: "Tags", type: "text", placeholder: "friendly, home, pre-season" },
        { name: "externalUrl", label: "External Link", type: "url", placeholder: "Optional ticket, livestream, or reference link" },
      ],
    },
    results: {
      label: "Results",
      description: "Completed match results and short reports.",
      allowMultiple: true,
      fields: [
        { name: "title", label: "Match Title", type: "text", required: true, placeholder: "Training match vs City United U21" },
        { name: "slug", label: "Custom Slug", type: "text", placeholder: "Leave blank to auto-generate" },
        { name: "status", label: "Status", type: "select", options: ["Finished", "Abandoned", "Awarded"] },
        { name: "date", label: "Date", type: "date" },
        { name: "time", label: "Kickoff Time", type: "time" },
        { name: "opponent", label: "Opponent", type: "text", placeholder: "City United U21" },
        { name: "venue", label: "Venue", type: "text", placeholder: "Glory Arena" },
        { name: "location", label: "City / Location", type: "text", placeholder: "Yangon" },
        { name: "competition", label: "Competition", type: "text", placeholder: "Training Match" },
        { name: "score", label: "Score Line", type: "text", placeholder: "GGFC 2 - 1 City United U21" },
        { name: "summary", label: "Summary", type: "textarea", placeholder: "Short result summary." },
        { name: "body", label: "Match Report", type: "textarea", placeholder: "Longer match analysis." },
        { name: "tags", label: "Tags", type: "text", placeholder: "win, development, analysis" },
        { name: "externalUrl", label: "External Link", type: "url", placeholder: "Optional report or highlight link" },
      ],
    },
    highlights: {
      label: "Highlights",
      description: "Feature stories, videos, and spotlight content.",
      allowMultiple: true,
      fields: [
        { name: "title", label: "Title", type: "text", required: true, placeholder: "What Greatest Glory FC wants to stand for" },
        { name: "slug", label: "Custom Slug", type: "text", placeholder: "Leave blank to auto-generate" },
        { name: "badge", label: "Badge", type: "text", placeholder: "Feature" },
        { name: "date", label: "Date", type: "date" },
        { name: "summary", label: "Summary", type: "textarea", required: true, placeholder: "Short highlight summary." },
        { name: "body", label: "Detail", type: "textarea", placeholder: "Longer article text." },
        { name: "externalUrl", label: "Video or Article Link", type: "url", placeholder: "YouTube, Drive, or any public link" },
        { name: "tags", label: "Tags", type: "text", placeholder: "identity, culture, launch" },
        { name: "file", label: "Attach File", type: "file", accept: "image/*,video/*,audio/*,.pdf" },
      ],
    },
    media: {
      label: "Media Board",
      description: "Images, videos, audio, documents, and Drive-based assets.",
      allowMultiple: true,
      fields: [
        { name: "title", label: "Title", type: "text", required: true, placeholder: "Official club crest" },
        { name: "slug", label: "Custom Slug", type: "text", placeholder: "Leave blank to auto-generate" },
        { name: "mediaType", label: "Media Type", type: "select", options: ["image", "video", "audio", "document", "link"] },
        { name: "date", label: "Date", type: "date" },
        { name: "summary", label: "Summary", type: "textarea", required: true, placeholder: "Short media description." },
        { name: "externalUrl", label: "External Link", type: "url", placeholder: "Optional Google Drive or public URL" },
        { name: "tags", label: "Tags", type: "text", placeholder: "branding, crest, image" },
        { name: "file", label: "Upload File", type: "file", accept: "image/*,video/*,audio/*,.pdf,.csv,.xlsx,.xls,.doc,.docx" },
      ],
    },
  };

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function nowIso() {
    return new Date().toISOString();
  }

  function uid(prefix) {
    return [prefix || "ggfc", Date.now().toString(36), Math.random().toString(36).slice(2, 8)].join("-");
  }

  function slugify(value) {
    return String(value || "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80);
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function textToHtml(value) {
    return String(value || "")
      .split(/\n+/)
      .filter(Boolean)
      .map(function (line) {
        return "<p>" + escapeHtml(line) + "</p>";
      })
      .join("");
  }

  function truncate(value, maxLength) {
    const text = String(value || "");
    if (text.length <= maxLength) {
      return text;
    }
    return text.slice(0, maxLength - 1).trimEnd() + "…";
  }

  function parseTags(value) {
    if (Array.isArray(value)) {
      return value.filter(Boolean);
    }
    return String(value || "")
      .split(",")
      .map(function (item) {
        return item.trim();
      })
      .filter(Boolean);
  }

  function joinTags(value) {
    return parseTags(value).join(", ");
  }

  function formatDate(value) {
    if (!value) {
      return "";
    }
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      return value;
    }
    return parsed.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  function formatDateTime(dateValue, timeValue) {
    const dateText = formatDate(dateValue);
    if (!dateText && !timeValue) {
      return "";
    }
    if (!timeValue) {
      return dateText;
    }
    return [dateText, timeValue].filter(Boolean).join(" • ");
  }

  function sortRecords(records, collection) {
    const list = clone(records || []);
    const order = collection === "fixtures" ? 1 : -1;
    return list.sort(function (left, right) {
      const leftValue = new Date(left.date || left.createdAt || 0).getTime();
      const rightValue = new Date(right.date || right.createdAt || 0).getTime();
      return (leftValue - rightValue) * order;
    });
  }

  function inferMediaType(mimeType, fallback) {
    if (fallback) {
      return fallback;
    }
    if (!mimeType) {
      return "document";
    }
    if (mimeType.startsWith("image/")) {
      return "image";
    }
    if (mimeType.startsWith("video/")) {
      return "video";
    }
    if (mimeType.startsWith("audio/")) {
      return "audio";
    }
    return "document";
  }

  function isImage(url, mediaType) {
    return mediaType === "image" || /\.(png|jpe?g|gif|webp|svg)$/i.test(url || "");
  }

  function isVideo(url, mediaType) {
    return mediaType === "video" || /\.(mp4|webm|ogg)$/i.test(url || "");
  }

  function isAudio(url, mediaType) {
    return mediaType === "audio" || /\.(mp3|wav|ogg|aac)$/i.test(url || "");
  }

  function createSeedData() {
    return { records: clone(SEED_RECORDS) };
  }

  function normalizeRecord(collection, draft, existingRecord) {
    const current = existingRecord ? clone(existingRecord) : {};
    const title = draft.title || current.title || "Untitled record";
    const next = Object.assign({}, current, draft, {
      collection: collection,
      title: title,
      slug: draft.slug ? slugify(draft.slug) : slugify(current.slug || title || uid(collection)),
      tags: joinTags(draft.tags || current.tags || ""),
      updatedAt: nowIso(),
    });

    if (!next.id) {
      next.id = uid(collection);
    }

    if (!next.createdAt) {
      next.createdAt = next.updatedAt;
    }

    return next;
  }

  function serializeDataUrl(file, maxSize) {
    return new Promise(function (resolve, reject) {
      if (!file) {
        resolve(null);
        return;
      }

      if (file.size > maxSize) {
        reject(new Error("Selected file is larger than the configured upload limit."));
        return;
      }

      const reader = new FileReader();
      reader.onerror = function () {
        reject(new Error("Failed to read the selected file."));
      };
      reader.onload = function () {
        const dataUrl = String(reader.result || "");
        resolve({
          name: file.name,
          type: file.type,
          size: file.size,
          dataUrl: dataUrl,
          base64: dataUrl.includes(",") ? dataUrl.split(",")[1] : "",
        });
      };
      reader.readAsDataURL(file);
    });
  }

  class LocalAdapter {
    constructor(storageKey) {
      this.storageKey = storageKey;
    }

    fetchAll() {
      const raw = window.localStorage.getItem(this.storageKey);
      if (!raw) {
        const seed = createSeedData();
        this.saveAll(seed);
        return seed;
      }

      try {
        const parsed = JSON.parse(raw);
        if (!parsed || !Array.isArray(parsed.records)) {
          throw new Error("Invalid local data.");
        }
        return parsed;
      } catch (error) {
        const seed = createSeedData();
        this.saveAll(seed);
        return seed;
      }
    }

    saveAll(data) {
      window.localStorage.setItem(this.storageKey, JSON.stringify(data));
      return data;
    }

    async upsert(collection, record, options) {
      const data = this.fetchAll();
      const list = data.records.slice();
      const index = list.findIndex(function (item) {
        return item.id === record.id;
      });
      const existing = index >= 0 ? list[index] : null;
      const next = normalizeRecord(collection, record, existing);

      if (options && options.filePayload) {
        next.fileName = options.filePayload.name;
        next.fileUrl = options.filePayload.dataUrl || next.fileUrl || "";
        next.mediaType = inferMediaType(options.filePayload.type, next.mediaType);
      }

      if (collection === "profile") {
        const filtered = list.filter(function (item) {
          return item.collection !== "profile";
        });
        filtered.unshift(next);
        data.records = filtered;
      } else if (index >= 0) {
        list[index] = next;
        data.records = list;
      } else {
        list.push(next);
        data.records = list;
      }

      this.saveAll(data);
      return { records: data.records, record: next };
    }

    async remove(collection, id) {
      const data = this.fetchAll();
      data.records = data.records.filter(function (item) {
        return !(item.collection === collection && item.id === id);
      });
      this.saveAll(data);
      return { records: data.records };
    }
  }

  class AppsScriptAdapter {
    constructor(settings) {
      this.url = settings.url;
      this.adminKey = settings.adminKey || "";
    }

    async request(method, payload) {
      if (!this.url) {
        throw new Error("Apps Script URL is missing.");
      }

      const requestOptions = {
        method: method,
      };

      let url = this.url;
      if (method === "GET") {
        url += "?action=list";
      } else {
        // Use a simple text/plain request so the browser does not send an OPTIONS preflight.
        requestOptions.headers = {
          "Content-Type": "text/plain;charset=utf-8",
        };
        requestOptions.body = JSON.stringify(payload || {});
      }

      let response;
      try {
        response = await fetch(url, requestOptions);
      } catch (error) {
        throw new Error(
          "The browser could not reach Apps Script. Check that the web app is deployed, the /exec URL is correct, and the deployment allows browser access."
        );
      }

      if (!response.ok) {
        throw new Error("Remote request failed with status " + response.status + ".");
      }

      const result = await response.json();
      if (!result.ok) {
        throw new Error(result.error || "Remote request failed.");
      }

      return result.data;
    }

    async fetchAll() {
      return this.request("GET");
    }

    async upsert(collection, record, options) {
      const payload = {
        action: "upsert",
        adminKey: this.adminKey,
        collection: collection,
        record: record,
      };

      if (options && options.filePayload) {
        payload.file = {
          name: options.filePayload.name,
          mimeType: options.filePayload.type,
          base64: options.filePayload.base64,
        };
        payload.previousFileId = record.fileId || "";
      }

      return this.request("POST", payload);
    }

    async remove(collection, id) {
      return this.request("POST", {
        action: "delete",
        adminKey: this.adminKey,
        collection: collection,
        id: id,
      });
    }
  }

  class ClubStore {
    constructor(settings) {
      this.config = settings || config;
      this.localAdapter = new LocalAdapter(this.config.localStorageKey);
      this.localAdapter.fetchAll();
    }

    getRemoteSettings(publicOnly) {
      let saved = {};
      try {
        saved = JSON.parse(window.localStorage.getItem(this.config.remoteSettingsKey) || "{}");
      } catch (error) {
        saved = {};
      }

      return {
        url: publicOnly ? this.config.publicApiUrl || saved.url || "" : saved.url || this.config.publicApiUrl || "",
        adminKey: publicOnly ? "" : saved.adminKey || "",
      };
    }

    saveRemoteSettings(settings) {
      const next = {
        url: settings.url || "",
        adminKey: settings.adminKey || "",
      };
      window.localStorage.setItem(this.config.remoteSettingsKey, JSON.stringify(next));
      return next;
    }

    resolveAdapter(mode) {
      if (mode === "remote" || mode === "remotePublic") {
        const remoteSettings = this.getRemoteSettings(mode === "remotePublic");
        if (!remoteSettings.url) {
          throw new Error("Apps Script URL is not configured.");
        }
        return new AppsScriptAdapter(remoteSettings);
      }
      return this.localAdapter;
    }

    async fetchAll(mode) {
      const adapterMode = mode || "local";
      if (adapterMode === "site") {
        const publicSettings = this.getRemoteSettings(true);
        if (publicSettings.url) {
          try {
            return await new AppsScriptAdapter(publicSettings).fetchAll();
          } catch (error) {
            return this.localAdapter.fetchAll();
          }
        }
        return this.localAdapter.fetchAll();
      }

      if (adapterMode === "adminAuto") {
        const savedMode = window.localStorage.getItem(this.config.adminModeKey) || "local";
        if (savedMode === "remote") {
          try {
            return await this.resolveAdapter("remote").fetchAll();
          } catch (error) {
            return this.localAdapter.fetchAll();
          }
        }
        return this.localAdapter.fetchAll();
      }

      return this.resolveAdapter(adapterMode).fetchAll();
    }

    async list(collection, mode) {
      const data = await this.fetchAll(mode);
      return sortRecords(
        (data.records || []).filter(function (item) {
          return item.collection === collection;
        }),
        collection
      );
    }

    async getProfile(mode) {
      const profiles = await this.list("profile", mode);
      return profiles[0] || clone(DEFAULT_PROFILE);
    }

    async find(collection, value, field, mode) {
      const list = await this.list(collection, mode);
      return (
        list.find(function (item) {
          return item[field] === value;
        }) || null
      );
    }

    async upsert(collection, record, mode, file) {
      const payload = Object.assign({}, record);
      const options = {};

      if (file) {
        options.filePayload = await serializeDataUrl(file, this.config.maxInlineFileSize);
      }

      const result = await this.resolveAdapter(mode).upsert(collection, payload, options);
      return result.record || null;
    }

    async remove(collection, id, mode) {
      return this.resolveAdapter(mode).remove(collection, id);
    }
  }

  window.GGCore = {
    COLLECTION_ORDER: COLLECTION_ORDER,
    COLLECTION_DEFINITIONS: COLLECTION_DEFINITIONS,
    ClubStore: ClubStore,
    DEFAULT_PROFILE: clone(DEFAULT_PROFILE),
    helpers: {
      clone: clone,
      escapeHtml: escapeHtml,
      formatDate: formatDate,
      formatDateTime: formatDateTime,
      inferMediaType: inferMediaType,
      isAudio: isAudio,
      isImage: isImage,
      isVideo: isVideo,
      joinTags: joinTags,
      parseTags: parseTags,
      slugify: slugify,
      sortRecords: sortRecords,
      textToHtml: textToHtml,
      truncate: truncate,
    },
  };
})();

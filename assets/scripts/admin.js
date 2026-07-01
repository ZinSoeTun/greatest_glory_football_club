(function () {
  const { ClubStore, COLLECTION_ORDER, COLLECTION_DEFINITIONS, helpers } = window.GGCore;
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

  const FIELD_TEXT = {
    "Custom Slug": "စိတ်ကြိုက် slug",
    "Leave blank to auto-generate": "မဖြည့်လျှင် စနစ်က အလိုအလျောက်ထုတ်ပေးမယ်",
    Badge: "တံဆိပ်စာ",
    "Video / Article Link": "ဗီဒီယို / ဆောင်းပါး လင့်ခ်",
    "Media type": "မီဒီယာအမျိုးအစား",
    "Media Type": "မီဒီယာအမျိုးအစား",
    "External Link": "ပြင်ပလင့်ခ်",
  };

  const LOCAL_SESSION_HOURS = Math.max(1, Number(window.GG_CONFIG.localSessionHours || 12));

  const state = {
    collection: "profile",
    mode: window.localStorage.getItem(window.GG_CONFIG.adminModeKey) || "local",
    editingId: null,
    authSession: null,
    records: [],
    pendingAction: "",
    workspaceReady: false,
  };

  const elements = {
    modeSelect: document.getElementById("modeSelect"),
    endpointInput: document.getElementById("endpointInput"),
    adminKeyInput: document.getElementById("adminKeyInput"),
    saveSettingsButton: document.getElementById("saveSettingsButton"),
    testConnectionButton: document.getElementById("testConnectionButton"),
    unlockAdminButton: document.getElementById("unlockAdminButton"),
    logoutButton: document.getElementById("logoutButton"),
    demoBehaviorSelect: document.getElementById("demoBehaviorSelect"),
    loadDemoDataButton: document.getElementById("loadDemoDataButton"),
    resetLocalDataButton: document.getElementById("resetLocalDataButton"),
    dataSourceChip: document.getElementById("dataSourceChip"),
    authStatus: document.getElementById("authStatus"),
    dataSourceStatus: document.getElementById("dataSourceStatus"),
    collectionsPanel: document.getElementById("collectionsPanel"),
    statusPanel: document.getElementById("statusPanel"),
    collectionTabs: document.getElementById("collectionTabs"),
    statusBox: document.getElementById("statusBox"),
    authGate: document.getElementById("authGate"),
    workspaceArea: document.getElementById("workspaceArea"),
    adminTitle: document.getElementById("adminTitle"),
    adminDescription: document.getElementById("adminDescription"),
    newRecordButton: document.getElementById("newRecordButton"),
    recordForm: document.getElementById("recordForm"),
    recordList: document.getElementById("recordList"),
    editorModeChip: document.getElementById("editorModeChip"),
    recordCountChip: document.getElementById("recordCountChip"),
  };

  function toMyanmarDigits(value) {
    return String(value == null ? "" : value).replace(/\d/g, function (digit) {
      return "၀၁၂၃၄၅၆၇၈၉"[Number(digit)];
    });
  }

  function localizeValue(value, fallback) {
    return UI_LABELS[value] || fallback || value || "";
  }

  function localizeFieldText(value) {
    return FIELD_TEXT[value] || value || "";
  }

  function setMessage(element, message, isError) {
    if (!element) {
      return;
    }

    element.textContent = message;
    element.style.color = isError ? "#ffc9c9" : "";
  }

  function setStatus(message, isError) {
    setMessage(elements.statusBox, message, isError);
  }

  function setAuthStatus(message, isError) {
    setMessage(elements.authStatus, message, isError);
  }

  function setDataSourceStatus(message, isError) {
    setMessage(elements.dataSourceStatus, message, isError);
  }

  function getSaveRecordButton() {
    return document.getElementById("saveRecordButton");
  }

  function getResetFormButton() {
    return document.getElementById("resetFormButton");
  }

  function getRemoteSettings() {
    return store.getRemoteSettings(false);
  }

  function getDemoBehavior() {
    return store.getLocalDemoBehavior();
  }

  function describeDemoBehavior(mode) {
    return mode === "seed"
      ? "Browser data မရှိတော့ရင် demo data ပြန်တင်မယ့် mode ကို ဖွင့်ထားပါတယ်။"
      : "Dummy data auto fallback ကို ပိတ်ထားပါတယ်။ Site က empty start နဲ့ပဲ စမယ်။";
  }

  function collectionLabel(collection) {
    return COLLECTION_DEFINITIONS[collection].label;
  }

  function updateModeChip() {
    const label = state.mode === "remote" ? "Google Drive" : "Local Demo";
    const suffix = state.authSession ? " | Authenticated" : " | Locked";
    elements.dataSourceChip.textContent = label + suffix;
  }

  function sessionMatchesCurrentMode(session) {
    if (!session || session.mode !== state.mode) {
      return false;
    }

    if (session.mode === "remote") {
      const remoteSettings = getRemoteSettings();
      return Boolean(session.sessionToken && session.url && session.url === remoteSettings.url);
    }

    return true;
  }

  function isSessionExpired(session) {
    if (!session || !session.expiresAt) {
      return false;
    }

    const expiresAt = new Date(session.expiresAt).getTime();
    return Number.isFinite(expiresAt) && expiresAt <= Date.now();
  }

  function isAuthenticatedForUi() {
    return Boolean(state.authSession && sessionMatchesCurrentMode(state.authSession) && !isSessionExpired(state.authSession));
  }

  function lockedMessage() {
    return state.mode === "remote"
      ? "Google Drive admin feature တွေကိုသုံးဖို့ Apps Script admin login ဝင်ပါ။"
      : "Local demo admin feature တွေကိုသုံးဖို့ password နဲ့ အတည်ပြုဝင်ပါ။";
  }

  function syncSettingsUi() {
    const remoteSettings = getRemoteSettings();
    elements.modeSelect.value = state.mode;
    elements.endpointInput.value = remoteSettings.url || "";
    elements.adminKeyInput.value = remoteSettings.adminKey || "";
    elements.demoBehaviorSelect.value = getDemoBehavior();
    updateModeChip();
  }

  function showProtectedUi(isAuthenticated) {
    elements.collectionsPanel.hidden = !isAuthenticated;
    elements.statusPanel.hidden = !isAuthenticated;
    elements.workspaceArea.hidden = !isAuthenticated;
    elements.authGate.hidden = isAuthenticated;
    elements.unlockAdminButton.hidden = isAuthenticated;
    elements.logoutButton.hidden = !isAuthenticated;
    updateModeChip();
    syncActionAvailability();
  }

  function setButtonBusy(button, isBusy, busyLabel) {
    if (!button) {
      return;
    }

    if (isBusy) {
      if (!button.dataset.defaultLabel) {
        button.dataset.defaultLabel = button.textContent;
      }
      button.classList.add("is-loading");
      button.setAttribute("aria-busy", "true");
      if (busyLabel) {
        button.textContent = busyLabel;
      }
      return;
    }

    button.classList.remove("is-loading");
    button.removeAttribute("aria-busy");
    if (button.dataset.defaultLabel) {
      button.textContent = button.dataset.defaultLabel;
    }
  }

  function syncActionAvailability() {
    const isAuthenticated = isAuthenticatedForUi();
    const isBusy = Boolean(state.pendingAction);

    elements.modeSelect.disabled = isBusy;
    elements.endpointInput.disabled = isBusy;
    elements.adminKeyInput.disabled = isBusy;
    elements.demoBehaviorSelect.disabled = isBusy;
    elements.saveSettingsButton.disabled = isBusy;
    elements.testConnectionButton.disabled = isBusy;
    elements.unlockAdminButton.disabled = isBusy;
    elements.logoutButton.disabled = !isAuthenticated || isBusy;
    elements.loadDemoDataButton.disabled = !isAuthenticated || isBusy;
    elements.resetLocalDataButton.disabled = !isAuthenticated || isBusy;
    elements.newRecordButton.disabled = !isAuthenticated || isBusy;

    Array.from(elements.collectionTabs.querySelectorAll("[data-collection]")).forEach(function (button) {
      button.disabled = !isAuthenticated || isBusy;
    });

    Array.from(elements.recordList.querySelectorAll("[data-action]")).forEach(function (button) {
      button.disabled = !isAuthenticated || isBusy;
    });

    const saveRecordButton = getSaveRecordButton();
    const resetFormButton = getResetFormButton();
    if (saveRecordButton) {
      saveRecordButton.disabled = !isAuthenticated || isBusy;
    }
    if (resetFormButton) {
      resetFormButton.disabled = isBusy;
    }

    elements.recordForm.classList.toggle("is-busy", isBusy);
    elements.recordList.classList.toggle("is-busy", isBusy);
  }

  async function runBusyTask(key, button, busyLabel, pendingMessage, task) {
    if (state.pendingAction) {
      setStatus("လက်ရှိလုပ်ဆောင်ချက်ပြီးအောင် ခဏစောင့်ပေးပါ။", false);
      return null;
    }

    state.pendingAction = key || "busy";
    setButtonBusy(button, true, busyLabel);
    syncActionAvailability();
    if (pendingMessage) {
      setStatus(pendingMessage, false);
    }

    try {
      return await task();
    } finally {
      setButtonBusy(button, false);
      state.pendingAction = "";
      syncActionAvailability();
    }
  }

  function isAuthErrorMessage(message) {
    return /authentication required|session expired|session token|invalid admin key/i.test(String(message || ""));
  }

  async function lockWorkspace(message, isError) {
    state.authSession = null;
    store.clearAuthSession();
    showProtectedUi(false);
    setAuthStatus(message || lockedMessage(), isError);
    setStatus(message || "Admin workspace ကို ဖွင့်ဖို့ authenticate ဝင်ပါ။", isError);
  }

  async function clearCurrentSession(message, isError) {
    const currentSession = state.authSession || store.getAuthSession();
    if (currentSession && currentSession.mode === "remote") {
      await store.logoutRemoteSession(currentSession);
    } else {
      store.clearAuthSession();
    }

    state.authSession = null;
    showProtectedUi(false);
    setAuthStatus(message || lockedMessage(), isError);
    setStatus(message || "Admin session ကို ပိတ်လိုက်ပါပြီ။", isError);
  }

  function setCollectionHeading(collection) {
    const definition = COLLECTION_DEFINITIONS[collection];
    elements.adminTitle.textContent = definition.label + " ကို စီမံမယ်";
    elements.adminDescription.textContent = definition.description;
  }

  function setListLoading(message) {
    elements.recordCountChip.textContent = "...";
    elements.recordList.innerHTML =
      '<div class="loading-card" aria-hidden="true">' +
      '<span class="loading-chip">တင်နေပါတယ်</span>' +
      '<div class="loading-line loading-line-title"></div>' +
      '<div class="loading-line"></div>' +
      '<div class="loading-line loading-line-short"></div>' +
      "</div>";
    if (message) {
      setStatus(message, false);
    }
  }

  async function unlockWorkspace(session, message) {
    state.authSession = store.saveAuthSession(session);
    showProtectedUi(true);
    setAuthStatus(message, false);
    setStatus("Admin workspace ကို အောင်မြင်စွာ ဖွင့်ပြီးပါပြီ။", false);

    if (!state.workspaceReady) {
      renderTabs();
      state.workspaceReady = true;
    }

    await loadCollectionView(state.collection);
  }

  async function sha256Hex(value) {
    if (!window.crypto || !window.crypto.subtle) {
      throw new Error("ဒီ browser မှာ secure local authentication မရပါ။");
    }

    const encoded = new TextEncoder().encode(value);
    const digest = await window.crypto.subtle.digest("SHA-256", encoded);
    return Array.from(new Uint8Array(digest))
      .map(function (byte) {
        return byte.toString(16).padStart(2, "0");
      })
      .join("");
  }

  async function authenticateLocal(secret) {
    const expectedHash = String(window.GG_CONFIG.localAdminPasswordHash || "").trim().toLowerCase();
    if (!expectedHash) {
      throw new Error("Local admin password hash ကို config.js ထဲမှာ မသတ်မှတ်ရသေးပါ။");
    }

    if (!secret) {
      throw new Error("Local demo mode အတွက် password ထည့်ပေးပါ။");
    }

    const digest = await sha256Hex(secret.trim());
    if (digest !== expectedHash) {
      throw new Error("Local demo password မမှန်ပါ။");
    }

    const authenticatedAt = new Date();
    return {
      mode: "local",
      authenticatedAt: authenticatedAt.toISOString(),
      expiresAt: new Date(authenticatedAt.getTime() + LOCAL_SESSION_HOURS * 60 * 60 * 1000).toISOString(),
    };
  }

  function requireAuthentication(message) {
    if (!isAuthenticatedForUi()) {
      lockWorkspace(message || "Admin session ကုန်သွားပါပြီ။ ပြန်ဝင်ပေးပါ။", true);
      return false;
    }
    return true;
  }

  function persistSettingsFromInputs() {
    const previousMode = state.mode;
    const previousSettings = getRemoteSettings();
    const previousDemoBehavior = getDemoBehavior();
    const nextMode = elements.modeSelect.value;
    const nextSettings = store.saveRemoteSettings({
      url: elements.endpointInput.value.trim(),
      adminKey: elements.adminKeyInput.value.trim(),
    });
    const nextDemoBehavior = store.saveLocalDemoBehavior(elements.demoBehaviorSelect.value);

    state.mode = nextMode;
    window.localStorage.setItem(window.GG_CONFIG.adminModeKey, nextMode);
    elements.endpointInput.value = nextSettings.url;
    elements.adminKeyInput.value = nextSettings.adminKey;
    elements.demoBehaviorSelect.value = nextDemoBehavior;

    const authRelevantChanged =
      previousMode !== nextMode ||
      previousSettings.url !== nextSettings.url ||
      previousSettings.adminKey !== nextSettings.adminKey;

    updateModeChip();

    return {
      changed: authRelevantChanged || previousDemoBehavior !== nextDemoBehavior,
      authRelevantChanged: authRelevantChanged,
      nextMode: nextMode,
      nextSettings: nextSettings,
      nextDemoBehavior: nextDemoBehavior,
    };
  }

  function buildField(field, value) {
    const safeValue = value || "";
    const common = 'name="' + helpers.escapeHtml(field.name) + '"';
    const required = field.required ? " required" : "";
    const placeholder = field.placeholder ? ' placeholder="' + helpers.escapeHtml(localizeFieldText(field.placeholder)) + '"' : "";
    const label = localizeFieldText(field.label);

    if (field.type === "textarea") {
      return (
        '<label class="field"><span>' +
        helpers.escapeHtml(label) +
        "</span><textarea " +
        common +
        required +
        placeholder +
        ">" +
        helpers.escapeHtml(safeValue) +
        "</textarea></label>"
      );
    }

    if (field.type === "select") {
      return (
        '<label class="field"><span>' +
        helpers.escapeHtml(label) +
        "</span><select " +
        common +
        ">" +
        field.options
          .map(function (option) {
            const optionValue = typeof option === "object" ? option.value : option;
            const optionLabel = typeof option === "object" ? option.label : localizeValue(optionValue, optionValue);
            const selected = optionValue === safeValue ? " selected" : "";
            return '<option value="' + helpers.escapeHtml(optionValue) + '"' + selected + ">" + helpers.escapeHtml(optionLabel) + "</option>";
          })
          .join("") +
        "</select></label>"
      );
    }

    if (field.type === "file") {
      return (
        '<label class="field"><span>' +
        helpers.escapeHtml(label) +
        "</span><input " +
        common +
        ' type="file"' +
        (field.accept ? ' accept="' + helpers.escapeHtml(field.accept) + '"' : "") +
        '><small class="helper-line">Local mode မှာ browser storage ထဲသိမ်းပြီး Google Drive mode မှာတော့ Apps Script ကနေ upload လုပ်ပေးပါမယ်။</small></label>'
      );
    }

    return (
      '<label class="field"><span>' +
      helpers.escapeHtml(label) +
      "</span><input " +
      common +
      ' type="' +
      helpers.escapeHtml(field.type || "text") +
      '"' +
      required +
      placeholder +
      ' value="' +
      helpers.escapeHtml(safeValue) +
      '"></label>'
    );
  }

  function buildFieldEnhanced(field, value) {
    const nextField = Object.assign({}, field);
    if (nextField.label === "File Upload") {
      nextField.label = "ဖိုင် upload";
    }

    if (nextField.type !== "file") {
      return buildField(nextField, value);
    }

    const label = localizeFieldText(nextField.label);
    const common = 'name="' + helpers.escapeHtml(nextField.name) + '"';
    const policy = helpers.describeFilePolicy(nextField, window.GG_CONFIG.maxInlineFileSize);

    return (
      '<label class="field"><span>' +
      helpers.escapeHtml(label) +
      "</span><input " +
      common +
      ' type="file"' +
      (nextField.accept ? ' accept="' + helpers.escapeHtml(nextField.accept) + '"' : "") +
      '><small class="helper-line helper-line-strong">' +
      helpers.escapeHtml(policy) +
      '</small><small class="helper-line">Local mode á€™á€¾á€¬ browser storage á€‘á€²á€žá€­á€™á€ºá€¸á€•á€¼á€®á€¸ Google Drive mode á€™á€¾á€¬á€á€±á€¬á€· Apps Script á€€á€”á€± upload á€œá€¯á€•á€ºá€•á€±á€¸á€•á€«á€™á€šá€ºá‹</small></label>'
    );
  }

  function renderForm(record) {
    const definition = COLLECTION_DEFINITIONS[state.collection];
    const current = record || {};
    elements.editorModeChip.textContent = current.id ? "ပြင်နေ" : "အသစ်";

    const previewLink =
      current.fileUrl || current.externalUrl
        ? '<p class="helper-line">လက်ရှိဖိုင်: <a class="preview-link" href="' +
          helpers.escapeHtml(current.fileUrl || current.externalUrl) +
          '" target="_blank" rel="noreferrer">ဖွင့်ကြည့်မယ်</a></p>'
        : "";

    elements.recordForm.innerHTML = [
      '<input type="hidden" name="id" value="' + helpers.escapeHtml(current.id || "") + '">',
      definition.fields
        .map(function (field) {
          return buildFieldEnhanced(field, current[field.name]);
        })
        .join(""),
      previewLink,
      '<div class="button-row">' +
        '<button class="button button-primary" type="submit" id="saveRecordButton">အချက်အလက် သိမ်းမယ်</button>' +
        '<button class="button button-secondary" type="button" id="resetFormButton">Form ရှင်းမယ်</button>' +
        "</div>",
    ].join("");

    document.getElementById("resetFormButton").addEventListener("click", function () {
      state.editingId = null;
      renderForm(state.collection === "profile" ? state.records[0] || {} : {});
      setStatus("Form ကို မူလအခြေအနေပြန်ထားပြီးပါပြီ။", false);
    });

    syncActionAvailability();
  }

  function renderTabs() {
    elements.collectionTabs.innerHTML = COLLECTION_ORDER.map(function (collection) {
      const activeClass = collection === state.collection ? " is-active" : "";
      return (
        '<button class="tab-button' +
        activeClass +
        '" type="button" data-collection="' +
        helpers.escapeHtml(collection) +
        '">' +
        helpers.escapeHtml(collectionLabel(collection)) +
        "</button>"
      );
    }).join("");
    syncActionAvailability();
  }

  function describeRecord(record) {
    return [
      helpers.formatDateTime(record.date, record.time),
      record.competition,
      record.score,
      localizeValue(record.status),
      localizeValue(record.mediaType),
    ]
      .filter(Boolean)
      .join(" | ");
  }

  function recordOpenUrl(record) {
    return "detail.html?collection=" + encodeURIComponent(record.collection) + "&slug=" + encodeURIComponent(record.slug || record.id);
  }

  async function fetchCollectionRecords() {
    try {
      return await store.list(state.collection, state.mode);
    } catch (error) {
      setStatus(error.message, true);
      return [];
    }
  }

  function renderRecordList(records) {
    state.records = records.slice();
    elements.recordCountChip.textContent = toMyanmarDigits(records.length) + " ခု";

    if (!records.length) {
      elements.recordList.innerHTML = '<div class="empty-state">ဒီ section ထဲမှာ record မရှိသေးပါ။</div>';
      syncActionAvailability();
      return;
    }

    elements.recordList.innerHTML = records
      .map(function (record) {
        return [
          '<article class="record-card">',
          "<h3>" + helpers.escapeHtml(record.title || "ခေါင်းစဉ် မထည့်ရသေးပါ") + "</h3>",
          describeRecord(record) ? '<p class="meta-copy">' + helpers.escapeHtml(describeRecord(record)) + "</p>" : "",
          "<p>" + helpers.escapeHtml(helpers.truncate(record.summary || record.body || "အကျဉ်းချုပ် မရှိသေးပါ။", 160)) + "</p>",
          '<div class="record-actions">' +
            '<button class="button button-secondary" type="button" data-action="edit" data-id="' +
            helpers.escapeHtml(record.id) +
            '">ပြင်မယ်</button>' +
            '<a class="button button-secondary" href="' +
            helpers.escapeHtml(recordOpenUrl(record)) +
            '" target="_blank" rel="noreferrer">ဖွင့်ကြည့်မယ်</a>' +
            (state.collection === "profile"
              ? ""
              : '<button class="button button-danger" type="button" data-action="delete" data-id="' +
                helpers.escapeHtml(record.id) +
                '">ဖျက်မယ်</button>') +
            "</div>",
          "</article>",
        ].join("");
      })
      .join("");

    syncActionAvailability();
  }

  async function loadRecords(preloadedRecords) {
    const records = Array.isArray(preloadedRecords) ? preloadedRecords : await fetchCollectionRecords();
    renderRecordList(records);
    return records;
  }

  async function loadCollectionView(collection) {
    state.collection = collection;
    state.editingId = null;
    renderTabs();
    setCollectionHeading(collection);
    setListLoading(collectionLabel(collection) + " data ကို ရယူနေပါတယ်...");

    const currentRecords = await fetchCollectionRecords();
    renderRecordList(currentRecords);
    renderForm(collection === "profile" ? currentRecords[0] || {} : {});
    return currentRecords;
  }

  async function switchCollection(collection, button) {
    return runBusyTask(
      "switchCollection",
      button || null,
      "ဖွင့်နေ...",
      collectionLabel(collection) + " ကို load လုပ်နေပါတယ်...",
      async function () {
        return loadCollectionView(collection);
      }
    );
  }

  async function handleProtectedError(error) {
    const message = error && error.message ? error.message : String(error || "Unknown error");
    if (isAuthErrorMessage(message)) {
      await lockWorkspace("Admin session မမှန်တော့ပါ။ `Admin ဝင်မယ်` ကိုနှိပ်ပြီး ပြန်ဝင်ပေးပါ။", true);
      return;
    }
    setStatus(message, true);
  }

  async function handleSave(event) {
    event.preventDefault();

    if (!requireAuthentication("အချက်အလက်သိမ်းဖို့ အရင် authenticate ဝင်ပါ။")) {
      return;
    }

    const formData = new FormData(elements.recordForm);
    const definition = COLLECTION_DEFINITIONS[state.collection];
    const record = {
      id: formData.get("id") || undefined,
      collection: state.collection,
    };

    definition.fields.forEach(function (field) {
      if (field.type === "file") {
        return;
      }
      record[field.name] = String(formData.get(field.name) || "").trim();
    });

    const fileField = definition.fields.find(function (field) {
      return field.type === "file";
    });
    const fileInput = fileField ? elements.recordForm.querySelector('input[name="' + fileField.name + '"]') : null;
    const file = fileInput && fileInput.files ? fileInput.files[0] : null;
    const saveButton = getSaveRecordButton();

    if (fileField && file) {
      try {
        helpers.validateFileSelection(file, fileField, window.GG_CONFIG.maxInlineFileSize);
      } catch (error) {
        setStatus(error.message, true);
        return;
      }
    }

    try {
      await runBusyTask(
        "saveRecord",
        saveButton,
        "သိမ်းနေ...",
        collectionLabel(state.collection) + " ကို သိမ်းနေပါတယ်...",
        async function () {
          const saved = await store.upsert(state.collection, record, state.mode, file, state.authSession);
          state.editingId = saved ? saved.id : null;
          const records = await loadRecords();
          setStatus(collectionLabel(state.collection) + " ကို အောင်မြင်စွာ သိမ်းပြီးပါပြီ။", false);

          if (state.collection === "profile") {
            renderForm(records[0] || {});
          } else {
            renderForm({});
          }
        }
      );
    } catch (error) {
      await handleProtectedError(error);
    }
  }

  async function handleListClick(event) {
    const target = event.target.closest("[data-action]");
    if (!target || state.pendingAction) {
      return;
    }

    const action = target.getAttribute("data-action");
    const id = target.getAttribute("data-id");
    if (!action || !id) {
      return;
    }

    const record = state.records.find(function (item) {
      return item.id === id;
    });

    if (!record) {
      setStatus("အချက်အလက်ကို ရှာမတွေ့ပါ။", true);
      return;
    }

    if (action === "edit") {
      state.editingId = id;
      renderForm(record);
      setStatus((record.title || "record") + " ကို ပြင်ဆင်နေပါတယ်။", false);
      return;
    }

    if (!requireAuthentication("ဖျက်ဖို့ အရင် authenticate ဝင်ပါ။")) {
      return;
    }

    const confirmed = window.confirm("ဒီ record ကို ဖျက်မလား?");
    if (!confirmed) {
      return;
    }

    try {
      await runBusyTask(
        "deleteRecord",
        target,
        "ဖျက်နေ...",
        "Record ကို ဖျက်နေပါတယ်...",
        async function () {
          await store.remove(state.collection, id, state.mode, state.authSession);
          renderForm(state.collection === "profile" ? state.records[0] || {} : {});
          await loadRecords();
          setStatus("အချက်အလက်ကို ဖျက်ပြီးပါပြီ။", false);
        }
      );
    } catch (error) {
      await handleProtectedError(error);
    }
  }

  async function saveModeSettings() {
    try {
      await runBusyTask(
        "saveSettings",
        elements.saveSettingsButton,
        "သိမ်းနေ...",
        "Settings ကို သိမ်းနေပါတယ်...",
        async function () {
          const persisted = persistSettingsFromInputs();

          if (persisted.authRelevantChanged && state.authSession) {
            await clearCurrentSession("Settings ပြောင်းထားလို့ admin lock ကို ပြန်ချထားပါတယ်။ ပြန်ဝင်ပေးပါ။", false);
          }

          setDataSourceStatus("ဒီ browser ထဲမှာ settings ကို သိမ်းပြီးပါပြီ။ " + describeDemoBehavior(persisted.nextDemoBehavior), false);
          setAuthStatus(state.authSession ? "လက်ရှိ admin session က active ဖြစ်နေပါတယ်။" : lockedMessage(), false);
        }
      );
    } catch (error) {
      setDataSourceStatus(error.message, true);
    }
  }

  async function testConnection() {
    try {
      await runBusyTask(
        "testConnection",
        elements.testConnectionButton,
        "စမ်းနေ...",
        "ချိတ်ဆက်မှုကို စမ်းနေပါတယ်...",
        async function () {
          const persisted = persistSettingsFromInputs();

          if (persisted.authRelevantChanged && state.authSession) {
            await clearCurrentSession("Settings ပြောင်းထားလို့ session အဟောင်းကို ပိတ်လိုက်ပါတယ်။", false);
          }

          if (state.mode === "local") {
            setDataSourceStatus("Local demo mode အဆင်သင့်ဖြစ်ပါတယ်။ Data တွေကို browser ထဲမှာပဲ သိမ်းပါမယ်။ " + describeDemoBehavior(persisted.nextDemoBehavior), false);
            return;
          }

          const data = await store.fetchAll("remotePublic");
          const recordCount = Array.isArray(data.records) ? data.records.length : 0;
          setDataSourceStatus("Google Drive mode ချိတ်ဆက်မှု အောင်မြင်ပါတယ်။ Public records " + toMyanmarDigits(recordCount) + " ခု ဖတ်လို့ရပါတယ်။", false);

          if (state.authSession && state.authSession.mode === "remote" && sessionMatchesCurrentMode(state.authSession)) {
            await store.validateRemoteSession(state.authSession);
            setAuthStatus("Remote admin session ကလည်း active ဖြစ်နေပါတယ်။", false);
          }
        }
      );
    } catch (error) {
      if (isAuthErrorMessage(error.message)) {
        await lockWorkspace("Remote admin session ကုန်သွားပါပြီ။ ပြန်ဝင်ပေးပါ။", true);
        return;
      }
      setDataSourceStatus(error.message, true);
    }
  }

  async function authenticateAdmin() {
    try {
      await runBusyTask(
        "authenticate",
        elements.unlockAdminButton,
        "ဝင်နေ...",
        "Admin access ကို စစ်နေပါတယ်...",
        async function () {
          const persisted = persistSettingsFromInputs();

          if (persisted.authRelevantChanged && state.authSession) {
            await clearCurrentSession("Settings ပြောင်းထားလို့ session အဟောင်းကို ပိတ်လိုက်ပါတယ်။", false);
          }

          const secret = elements.adminKeyInput.value.trim();

          if (state.mode === "local") {
            const localSession = await authenticateLocal(secret);
            await unlockWorkspace(localSession, "Local demo admin access အောင်မြင်ပါပြီ။");
            setDataSourceStatus("Local demo mode အတွက် admin authentication အောင်မြင်ပါတယ်။ " + describeDemoBehavior(persisted.nextDemoBehavior), false);
            return;
          }

          const remoteSession = await store.authenticateRemote(secret);
          await unlockWorkspace(
            {
              mode: "remote",
              url: persisted.nextSettings.url || getRemoteSettings().url,
              sessionToken: remoteSession.sessionToken,
              authenticatedAt: remoteSession.authenticatedAt || new Date().toISOString(),
              expiresAt: remoteSession.expiresAt || "",
            },
            "Google Drive admin access အောင်မြင်ပါပြီ။"
          );
          setDataSourceStatus("Google Drive mode အတွက် admin session ရပါပြီ။ CRUD လုပ်နိုင်ပါပြီ။", false);
        }
      );
    } catch (error) {
      setAuthStatus(error.message, true);
      setStatus("Admin workspace ကို ဖွင့်မရသေးပါ။", true);
    }
  }

  async function logoutAdmin() {
    try {
      await runBusyTask(
        "logout",
        elements.logoutButton,
        "ထွက်နေ...",
        "Admin session ကို ပိတ်နေပါတယ်...",
        async function () {
          await clearCurrentSession("Admin session ကနေ ထွက်ပြီးပါပြီ။", false);
          setDataSourceStatus("Admin logout အောင်မြင်ပါတယ်။ ပြန်ဝင်ချင်ရင် `Admin ဝင်မယ်` ကိုနှိပ်ပါ။", false);
        }
      );
    } catch (error) {
      setDataSourceStatus(error.message, true);
    }
  }

  async function loadDemoData() {
    if (!requireAuthentication("Demo data ထည့်ဖို့ အရင် authenticate ဝင်ပါ။")) {
      return;
    }

    if (state.mode !== "local") {
      setDataSourceStatus("Demo data ကို local demo mode မှာပဲ ထည့်နိုင်ပါတယ်။", true);
      return;
    }

    const confirmed = window.confirm("လက်ရှိ local data ကို sample content အသစ်နဲ့ အစားထိုးမလား?");
    if (!confirmed) {
      return;
    }

    try {
      await runBusyTask(
        "loadDemoData",
        elements.loadDemoDataButton,
        "ထည့်နေ...",
        "Demo data ကို တင်နေပါတယ်...",
        async function () {
          store.resetLocalData("seed");
          setStatus("Local demo data ကို အောင်မြင်စွာ ထည့်ပြီးပါပြီ။", false);
          setDataSourceStatus("Sample fixtures, results, highlights နဲ့ media demo data တွေကို local mode ထဲသွင်းပြီးပါပြီ။ " + describeDemoBehavior(getDemoBehavior()), false);
          await loadCollectionView(state.collection);
        }
      );
    } catch (error) {
      setDataSourceStatus(error.message, true);
    }
  }

  async function resetLocalData() {
    if (!requireAuthentication("Local data ကို အလွတ်လုပ်ဖို့ အရင် authenticate ဝင်ပါ။")) {
      return;
    }

    if (state.mode !== "local") {
      setDataSourceStatus("Local data reset ကို local demo mode မှာပဲ လုပ်နိုင်ပါတယ်။", true);
      return;
    }

    const confirmed = window.confirm("Local mode ထဲက record အားလုံးကို အလွတ်လုပ်မလား?");
    if (!confirmed) {
      return;
    }

    try {
      await runBusyTask(
        "resetLocalData",
        elements.resetLocalDataButton,
        "ရှင်းနေ...",
        "Local data ကို ရှင်းနေပါတယ်...",
        async function () {
          store.resetLocalData("empty");
          setStatus("Local data ကို အလွတ်လုပ်ပြီးပါပြီ။", false);
          setDataSourceStatus("Dummy data auto ပြန်မပေါ်အောင် local data ကို empty start နဲ့ reset လုပ်ပြီးပါပြီ။ " + describeDemoBehavior(getDemoBehavior()), false);
          await loadCollectionView(state.collection);
        }
      );
    } catch (error) {
      setDataSourceStatus(error.message, true);
    }
  }

  async function applyStoredSession() {
    const storedSession = store.getAuthSession();
    if (!storedSession) {
      await lockWorkspace(lockedMessage(), false);
      return;
    }

    if (!sessionMatchesCurrentMode(storedSession)) {
      await lockWorkspace("Mode (သို့) URL ပြောင်းသွားလို့ session အဟောင်းကို ပိတ်လိုက်ပါတယ်။ ပြန်ဝင်ပေးပါ။", false);
      return;
    }

    if (isSessionExpired(storedSession)) {
      await lockWorkspace("Admin session သက်တမ်းကုန်သွားပါပြီ။ ပြန်ဝင်ပေးပါ။", true);
      return;
    }

    try {
      if (storedSession.mode === "remote") {
        const remoteSession = await store.validateRemoteSession(storedSession);
        await unlockWorkspace(
          {
            mode: "remote",
            url: storedSession.url,
            sessionToken: storedSession.sessionToken,
            authenticatedAt: remoteSession.authenticatedAt || storedSession.authenticatedAt,
            expiresAt: remoteSession.expiresAt || storedSession.expiresAt,
          },
          "Google Drive admin session ကို ပြန်ဖွင့်ပြီးပါပြီ။"
        );
        setDataSourceStatus("Remote admin session က active ဖြစ်နေပါတယ်။", false);
        return;
      }

      await unlockWorkspace(storedSession, "Local demo admin session ကို ပြန်ဖွင့်ပြီးပါပြီ။");
      setDataSourceStatus("Local demo admin session က active ဖြစ်နေပါတယ်။", false);
    } catch (error) {
      await lockWorkspace("သိမ်းထားတဲ့ admin session ကို ပြန်မဖွင့်နိုင်ပါ။ ပြန်ဝင်ပေးပါ။", true);
    }
  }

  function bindEvents() {
    elements.collectionTabs.addEventListener("click", function (event) {
      const button = event.target.closest("[data-collection]");
      if (!button) {
        return;
      }
      switchCollection(button.getAttribute("data-collection"), button);
    });

    elements.recordForm.addEventListener("submit", handleSave);
    elements.recordList.addEventListener("click", handleListClick);
    elements.saveSettingsButton.addEventListener("click", saveModeSettings);
    elements.testConnectionButton.addEventListener("click", testConnection);
    elements.unlockAdminButton.addEventListener("click", authenticateAdmin);
    elements.logoutButton.addEventListener("click", logoutAdmin);
    elements.loadDemoDataButton.addEventListener("click", loadDemoData);
    elements.resetLocalDataButton.addEventListener("click", resetLocalData);

    elements.newRecordButton.addEventListener("click", function () {
      if (!requireAuthentication("Record အသစ်ထည့်ဖို့ အရင် authenticate ဝင်ပါ။")) {
        return;
      }

      if (state.pendingAction) {
        return;
      }

      state.editingId = null;
      if (state.collection === "profile") {
        renderForm(state.records[0] || {});
      } else {
        renderForm({});
      }
      setStatus(collectionLabel(state.collection) + " အတွက် record အသစ်တစ်ခု ထည့်ဖို့ အသင့်ဖြစ်နေပါတယ်။", false);
    });

    elements.modeSelect.addEventListener("change", function () {
      setDataSourceStatus("Mode ပြောင်းထားပါတယ်။ အတည်ပြုဖို့ Settings သိမ်းမယ် ကို နှိပ်ပါ။", false);
    });

    elements.demoBehaviorSelect.addEventListener("change", function () {
      setDataSourceStatus("Local data စတင်ပုံကို ပြောင်းထားပါတယ်။ Settings သိမ်းမယ် ကိုနှိပ်ပြီး အတည်ပြုပါ။ " + describeDemoBehavior(elements.demoBehaviorSelect.value), false);
    });
  }

  async function init() {
    syncSettingsUi();
    renderTabs();
    bindEvents();
    showProtectedUi(false);
    setAuthStatus(lockedMessage(), false);
    setDataSourceStatus("Local demo mode (သို့) Google Drive mode ကိုရွေးပြီး စတင်နိုင်ပါတယ်။ " + describeDemoBehavior(getDemoBehavior()), false);
    await applyStoredSession();
  }

  init();
})();

(function () {
  const { ClubStore, COLLECTION_ORDER, COLLECTION_DEFINITIONS, helpers } = window.GGCore;
  const store = new ClubStore(window.GG_CONFIG);

  const state = {
    collection: "profile",
    mode: window.localStorage.getItem(window.GG_CONFIG.adminModeKey) || "local",
    editingId: null,
  };

  const elements = {
    modeSelect: document.getElementById("modeSelect"),
    endpointInput: document.getElementById("endpointInput"),
    adminKeyInput: document.getElementById("adminKeyInput"),
    saveSettingsButton: document.getElementById("saveSettingsButton"),
    testConnectionButton: document.getElementById("testConnectionButton"),
    collectionTabs: document.getElementById("collectionTabs"),
    statusBox: document.getElementById("statusBox"),
    dataSourceStatus: document.getElementById("dataSourceStatus"),
    adminTitle: document.getElementById("adminTitle"),
    adminDescription: document.getElementById("adminDescription"),
    newRecordButton: document.getElementById("newRecordButton"),
    recordForm: document.getElementById("recordForm"),
    recordList: document.getElementById("recordList"),
    editorModeChip: document.getElementById("editorModeChip"),
    recordCountChip: document.getElementById("recordCountChip"),
  };

  function setStatus(message, isError) {
    elements.statusBox.textContent = message;
    elements.statusBox.style.color = isError ? "#ffc9c9" : "";
    elements.dataSourceStatus.textContent = message;
    elements.dataSourceStatus.style.color = isError ? "#ffc9c9" : "";
  }

  function getRemoteSettings() {
    return store.getRemoteSettings(false);
  }

  function syncSettingsUi() {
    const remoteSettings = getRemoteSettings();
    elements.modeSelect.value = state.mode;
    elements.endpointInput.value = remoteSettings.url || "";
    elements.adminKeyInput.value = remoteSettings.adminKey || "";
  }

  function collectionLabel(collection) {
    return COLLECTION_DEFINITIONS[collection].label;
  }

  function buildField(field, value) {
    const safeValue = value || "";
    const common = 'name="' + helpers.escapeHtml(field.name) + '"';
    const required = field.required ? " required" : "";
    const placeholder = field.placeholder ? ' placeholder="' + helpers.escapeHtml(field.placeholder) + '"' : "";

    if (field.type === "textarea") {
      return (
        '<label class="field"><span>' +
        helpers.escapeHtml(field.label) +
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
        helpers.escapeHtml(field.label) +
        "</span><select " +
        common +
        ">" +
        field.options
          .map(function (option) {
            const selected = option === safeValue ? " selected" : "";
            return '<option value="' + helpers.escapeHtml(option) + '"' + selected + ">" + helpers.escapeHtml(option) + "</option>";
          })
          .join("") +
        "</select></label>"
      );
    }

    if (field.type === "file") {
      return (
        '<label class="field"><span>' +
        helpers.escapeHtml(field.label) +
        "</span><input " +
        common +
        ' type="file"' +
        (field.accept ? ' accept="' + helpers.escapeHtml(field.accept) + '"' : "") +
        "><small class=\"helper-line\">Optional. In local mode, small files are stored in browser storage. In Google Drive mode, files are uploaded through Apps Script.</small></label>"
      );
    }

    return (
      '<label class="field"><span>' +
      helpers.escapeHtml(field.label) +
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

  function renderForm(record) {
    const definition = COLLECTION_DEFINITIONS[state.collection];
    const current = record || {};
    elements.editorModeChip.textContent = current.id ? "Edit" : "Create";

    const previewLink =
      current.fileUrl || current.externalUrl
        ? '<p class="helper-line">Current asset: <a class="preview-link" href="' +
          helpers.escapeHtml(current.fileUrl || current.externalUrl) +
          '" target="_blank" rel="noreferrer">open link</a></p>'
        : "";

    elements.recordForm.innerHTML = [
      '<input type="hidden" name="id" value="' + helpers.escapeHtml(current.id || "") + '">',
      definition.fields
        .map(function (field) {
          return buildField(field, current[field.name]);
        })
        .join(""),
      previewLink,
      '<div class="button-row">' +
        '<button class="button button-primary" type="submit">Save Record</button>' +
        '<button class="button button-secondary" type="button" id="resetFormButton">Clear Form</button>' +
        "</div>",
    ].join("");

    document.getElementById("resetFormButton").addEventListener("click", function () {
      state.editingId = null;
      renderForm({});
    });
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
  }

  function describeRecord(record) {
    return [
      helpers.formatDateTime(record.date, record.time),
      record.competition,
      record.score,
      record.status,
      record.mediaType,
    ]
      .filter(Boolean)
      .join(" • ");
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

  async function loadRecords() {
    const records = await fetchCollectionRecords();
    elements.recordCountChip.textContent = records.length + (records.length === 1 ? " item" : " items");

    if (!records.length) {
      elements.recordList.innerHTML = '<div class="empty-state">No records in this section yet.</div>';
      return;
    }

    elements.recordList.innerHTML = records
      .map(function (record) {
        return [
          '<article class="record-card">',
          "<h3>" + helpers.escapeHtml(record.title || "Untitled record") + "</h3>",
          describeRecord(record) ? '<p class="meta-copy">' + helpers.escapeHtml(describeRecord(record)) + "</p>" : "",
          "<p>" + helpers.escapeHtml(helpers.truncate(record.summary || record.body || "No summary yet.", 160)) + "</p>",
          '<div class="record-actions">' +
            '<button class="button button-secondary" type="button" data-action="edit" data-id="' +
            helpers.escapeHtml(record.id) +
            '">Edit</button>' +
            '<a class="button button-secondary" href="' +
            helpers.escapeHtml(recordOpenUrl(record)) +
            '" target="_blank" rel="noreferrer">Open</a>' +
            (state.collection === "profile"
              ? ""
              : '<button class="button button-danger" type="button" data-action="delete" data-id="' +
                helpers.escapeHtml(record.id) +
                '">Delete</button>') +
            "</div>",
          "</article>",
        ].join("");
      })
      .join("");
  }

  async function switchCollection(collection) {
    state.collection = collection;
    state.editingId = null;
    renderTabs();

    const definition = COLLECTION_DEFINITIONS[collection];
    elements.adminTitle.textContent = "Manage " + definition.label;
    elements.adminDescription.textContent = definition.description;

    const currentRecords = await fetchCollectionRecords();
    renderForm(collection === "profile" ? currentRecords[0] || {} : {});
    await loadRecords();
  }

  async function handleSave(event) {
    event.preventDefault();

    if (state.mode === "remote") {
      const remoteSettings = getRemoteSettings();
      if (!remoteSettings.url || !remoteSettings.adminKey) {
        setStatus("Remote mode needs both Apps Script URL and Admin Key.", true);
        return;
      }
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
    const file = fileField ? elements.recordForm.querySelector('input[name="' + fileField.name + '"]').files[0] : null;

    try {
      const saved = await store.upsert(state.collection, record, state.mode, file);
      state.editingId = saved ? saved.id : null;
      setStatus(collectionLabel(state.collection) + " saved successfully.");
      await loadRecords();
      if (state.collection === "profile") {
        const profile = await store.getProfile(state.mode);
        renderForm(profile);
      } else {
        renderForm({});
      }
    } catch (error) {
      setStatus(error.message, true);
    }
  }

  async function handleListClick(event) {
    const target = event.target.closest("[data-action]");
    if (!target) {
      return;
    }

    const action = target.getAttribute("data-action");
    const id = target.getAttribute("data-id");
    if (!action || !id) {
      return;
    }

    const record = await store.find(state.collection, id, "id", state.mode);
    if (!record) {
      setStatus("Record not found.", true);
      return;
    }

    if (action === "edit") {
      state.editingId = id;
      renderForm(record);
      setStatus("Editing " + (record.title || "record") + ".");
      return;
    }

    if (action === "delete") {
      const confirmed = window.confirm("Delete this record?");
      if (!confirmed) {
        return;
      }
      try {
        await store.remove(state.collection, id, state.mode);
        setStatus("Record deleted.");
        renderForm({});
        await loadRecords();
      } catch (error) {
        setStatus(error.message, true);
      }
    }
  }

  function saveModeSettings() {
    const nextMode = elements.modeSelect.value;
    const nextSettings = store.saveRemoteSettings({
      url: elements.endpointInput.value.trim(),
      adminKey: elements.adminKeyInput.value.trim(),
    });

    state.mode = nextMode;
    window.localStorage.setItem(window.GG_CONFIG.adminModeKey, nextMode);
    elements.endpointInput.value = nextSettings.url;
    elements.adminKeyInput.value = nextSettings.adminKey;
    setStatus("Settings saved in this browser. Loading the selected data source...");
    switchCollection(state.collection);
  }

  async function testConnection() {
    try {
      const settings = getRemoteSettings();
      if (!settings.url) {
        throw new Error("Please enter the Apps Script URL first.");
      }
      const data = await store.fetchAll("remotePublic");
      const recordCount = Array.isArray(data.records) ? data.records.length : 0;
      setStatus("Connection successful. Remote data source is reachable and returned " + recordCount + " record(s).");
    } catch (error) {
      setStatus(error.message, true);
    }
  }

  function bindEvents() {
    elements.collectionTabs.addEventListener("click", function (event) {
      const button = event.target.closest("[data-collection]");
      if (!button) {
        return;
      }
      switchCollection(button.getAttribute("data-collection"));
    });

    elements.recordForm.addEventListener("submit", handleSave);
    elements.recordList.addEventListener("click", handleListClick);
    elements.saveSettingsButton.addEventListener("click", saveModeSettings);
    elements.testConnectionButton.addEventListener("click", testConnection);
    elements.newRecordButton.addEventListener("click", function () {
      state.editingId = null;
      renderForm(state.collection === "profile" ? {} : {});
      setStatus("Ready for a new " + collectionLabel(state.collection).toLowerCase() + " record.");
    });
    elements.modeSelect.addEventListener("change", function () {
      setStatus("Mode changed. Click Save Settings to apply the new data source.");
    });
  }

  async function init() {
    syncSettingsUi();
    renderTabs();
    bindEvents();
    await switchCollection(state.collection);
    setStatus("Ready to manage content.");
  }

  init();
})();

export const CatalogExperience = ({
  mode = "browse",
  supabaseUrl,
  supabaseAnonKey,
  functionsBaseUrl,
}) => {
  const styles = `
    .catalog-shell { color: #18181b; }
    .catalog-panel { border: 1px solid #e4e4e7; background: #fff; color: #18181b; }
    .catalog-muted-panel { border: 1px solid #e4e4e7; background: #f4f4f5; color: #3f3f46; }
    .catalog-control {
      width: 100%;
      border: 1px solid #d4d4d8;
      border-radius: 0.5rem;
      background: #fff;
      color: #18181b;
      padding: 0.5rem 0.75rem;
      font-size: 0.875rem;
      line-height: 1.25rem;
      outline: none;
      box-shadow: 0 1px 2px rgba(24, 24, 27, 0.05);
    }
    .catalog-control::placeholder { color: #71717a; }
    .catalog-control:focus { border-color: #047857; box-shadow: 0 0 0 3px rgba(4, 120, 87, 0.18); }
    .catalog-button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: 1px solid #047857;
      border-radius: 0.5rem;
      background: #047857;
      color: #fff;
      padding: 0.5rem 1rem;
      font-size: 0.875rem;
      font-weight: 700;
      line-height: 1.25rem;
      text-decoration: none;
      transition: background 150ms ease, border-color 150ms ease, opacity 150ms ease;
    }
    .catalog-button:hover { background: #065f46; border-color: #065f46; }
    .catalog-button:disabled { cursor: not-allowed; opacity: 0.65; }
    .catalog-secondary-button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: 1px solid #d4d4d8;
      border-radius: 0.5rem;
      background: #fff;
      color: #18181b;
      padding: 0.5rem 1rem;
      font-size: 0.875rem;
      font-weight: 700;
      line-height: 1.25rem;
      text-decoration: none;
    }
    .catalog-secondary-button:hover { background: #f4f4f5; }
    html.dark .catalog-shell, .dark .catalog-shell, [data-theme="dark"] .catalog-shell { color: #fafafa; }
    html.dark .catalog-panel, .dark .catalog-panel, [data-theme="dark"] .catalog-panel {
      border-color: #27272a;
      background: #09090b;
      color: #fafafa;
    }
    html.dark .catalog-muted-panel, .dark .catalog-muted-panel, [data-theme="dark"] .catalog-muted-panel {
      border-color: #3f3f46;
      background: #18181b;
      color: #d4d4d8;
    }
    html.dark .catalog-control, .dark .catalog-control, [data-theme="dark"] .catalog-control {
      border-color: #3f3f46;
      background: #09090b;
      color: #fafafa;
    }
    html.dark .catalog-control::placeholder, .dark .catalog-control::placeholder, [data-theme="dark"] .catalog-control::placeholder { color: #a1a1aa; }
    html.dark .catalog-button, .dark .catalog-button, [data-theme="dark"] .catalog-button {
      border-color: #34d399;
      background: #34d399;
      color: #052e16;
    }
    html.dark .catalog-button:hover, .dark .catalog-button:hover, [data-theme="dark"] .catalog-button:hover {
      border-color: #6ee7b7;
      background: #6ee7b7;
    }
    html.dark .catalog-secondary-button, .dark .catalog-secondary-button, [data-theme="dark"] .catalog-secondary-button {
      border-color: #3f3f46;
      background: #18181b;
      color: #fafafa;
    }
    html.dark .catalog-secondary-button:hover, .dark .catalog-secondary-button:hover, [data-theme="dark"] .catalog-secondary-button:hover { background: #27272a; }
  `;

  const pricingLabels = {
    free: "Free",
    paid: "Paid",
    contact_sales: "Contact sales",
  };
  const downloadLabels = {
    external_url: "External URL",
    portal_file: "Portal file",
    request_access: "Request access",
  };
  const headers = {
    apikey: supabaseAnonKey,
    Authorization: `Bearer ${supabaseAnonKey}`,
    "Content-Type": "application/json",
  };
  const appsUrl = `${supabaseUrl.replace(/\/$/, "")}/rest/v1/catalog_apps`;
  const edgeUrl = (name) => `${functionsBaseUrl.replace(/\/$/, "")}/${name}`;
  const list = (value) => (Array.isArray(value) ? value : []);
  const slugify = (value) =>
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  const fetchJson = async (url, options = {}) => {
    const response = await fetch(url, options);
    const payload = await response.json().catch(() => null);
    if (!response.ok)
      throw new Error(
        payload?.error ||
          payload?.message ||
          `Request failed with status ${response.status}`,
      );
    return payload;
  };
  const latestVersion = (app) => list(app.versions)[0] || null;
  const productsFor = (app) => [
    ...new Set(
      list(latestVersion(app)?.compatibility)
        .map((item) => item.productName)
        .filter(Boolean),
    ),
  ];
  const field = (label, child) => (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium text-zinc-800 dark:text-zinc-100">
        {label}
      </span>
      {child}
    </label>
  );
  const loadingBox = (label) => (
    <div className="catalog-muted-panel rounded-xl p-6 text-sm">{label}</div>
  );
  const errorBox = (message) => (
    <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-200">
      {message}
    </div>
  );

  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedSlug, setSelectedSlug] = useState("");
  const [selectedVersionId, setSelectedVersionId] = useState("");
  const [query, setQuery] = useState("");
  const [publisherFilter, setPublisherFilter] = useState("");
  const [productFilter, setProductFilter] = useState("");
  const [pricingFilter, setPricingFilter] = useState("");
  const [downloadState, setDownloadState] = useState({
    status: "idle",
    message: "",
    url: "",
  });
  const [submitState, setSubmitState] = useState({
    status: "idle",
    message: "",
  });
  const [form, setForm] = useState({
    name: "",
    slug: "",
    publisher: "",
    publisherUrl: "",
    shortDescription: "",
    longDescription: "",
    appId: "",
    version: "",
    releaseNotes: "",
    pricingType: "free",
    priceText: "Free",
    downloadType: "external_url",
    downloadUrl: "",
    productName: "",
    compatibilityText: "",
  });

  const loadApps = async () => {
    setLoading(true);
    setError("");
    try {
      const rows = await fetchJson(
        `${appsUrl}?status=eq.published&select=*&order=name.asc`,
        { headers },
      );
      setApps(rows);
      const requested = new URLSearchParams(window.location.search).get("app");
      const selected = requested || selectedSlug || rows[0]?.slug || "";
      setSelectedSlug(selected);
      const app = rows.find((item) => item.slug === selected) || rows[0];
      setSelectedVersionId(latestVersion(app)?.id || "");
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApps();
  }, [supabaseUrl, supabaseAnonKey]);

  const selectedApp =
    apps.find((app) => app.slug === selectedSlug) || apps[0] || null;
  const selectedVersions = list(selectedApp?.versions);
  const selectedVersion =
    selectedVersions.find((version) => version.id === selectedVersionId) ||
    selectedVersions[0] ||
    null;
  const publishers = [
    ...new Set(apps.map((app) => app.publisher).filter(Boolean)),
  ].sort();
  const products = [...new Set(apps.flatMap((app) => productsFor(app)))].sort();
  const filteredApps = apps.filter((app) => {
    const latest = latestVersion(app);
    const haystack = [
      app.name,
      app.publisher,
      app.short_description,
      app.long_description,
      ...productsFor(app),
    ]
      .join(" ")
      .toLowerCase();
    return (
      (!query || haystack.includes(query.toLowerCase())) &&
      (!publisherFilter || app.publisher === publisherFilter) &&
      (!productFilter || productsFor(app).includes(productFilter)) &&
      (!pricingFilter || latest?.pricingType === pricingFilter)
    );
  });

  const update = (key, value) =>
    setForm((current) => ({ ...current, [key]: value }));

  const submitApp = async (event) => {
    event.preventDefault();
    setSubmitState({ status: "loading", message: "Creating app..." });
    try {
      const payload = await fetchJson(edgeUrl("create-app"), {
        method: "POST",
        headers,
        body: JSON.stringify({
          ...form,
          slug: form.slug || slugify(form.name),
        }),
      });
      setSubmitState({
        status: "success",
        message: `Created ${payload.name}. It is now visible in the catalog.`,
      });
      await loadApps();
    } catch (submitError) {
      setSubmitState({ status: "error", message: submitError.message });
    }
  };

  const submitVersion = async (event) => {
    event.preventDefault();
    setSubmitState({ status: "loading", message: "Adding version..." });
    try {
      const payload = await fetchJson(edgeUrl("create-version"), {
        method: "POST",
        headers,
        body: JSON.stringify(form),
      });
      setSubmitState({
        status: "success",
        message: `Added version ${payload.version}. It is now visible in the catalog.`,
      });
      await loadApps();
    } catch (submitError) {
      setSubmitState({ status: "error", message: submitError.message });
    }
  };

  const requestDownload = async () => {
    if (!selectedApp || !selectedVersion) return;
    setDownloadState({
      status: "loading",
      message: "Checking access...",
      url: "",
    });
    try {
      const payload = await fetchJson(edgeUrl("request-download"), {
        method: "POST",
        headers,
        body: JSON.stringify({
          appId: selectedApp.id,
          versionId: selectedVersion.id,
        }),
      });
      setDownloadState({
        status: payload.allowed ? "allowed" : "denied",
        message:
          payload.message ||
          (payload.allowed ? "Access approved." : "Access denied."),
        url: payload.downloadUrl || "",
      });
    } catch (downloadError) {
      setDownloadState({
        status: "error",
        message: downloadError.message,
        url: "",
      });
    }
  };

  const formFields = (
    <>
      {field(
        "Version",
        <input
          className="catalog-control"
          required
          value={form.version}
          onChange={(event) => update("version", event.target.value)}
          placeholder="1.0.0"
        />,
      )}
      {field(
        "Release notes",
        <textarea
          className="catalog-control"
          rows="3"
          value={form.releaseNotes}
          onChange={(event) => update("releaseNotes", event.target.value)}
        />,
      )}
      <div className="grid gap-4 md:grid-cols-3">
        {field(
          "Pricing",
          <select
            className="catalog-control"
            value={form.pricingType}
            onChange={(event) => update("pricingType", event.target.value)}
          >
            <option value="free">Free</option>
            <option value="paid">Paid</option>
            <option value="contact_sales">Contact sales</option>
          </select>,
        )}
        {field(
          "Price text",
          <input
            className="catalog-control"
            value={form.priceText}
            onChange={(event) => update("priceText", event.target.value)}
          />,
        )}
        {field(
          "Download type",
          <select
            className="catalog-control"
            value={form.downloadType}
            onChange={(event) => update("downloadType", event.target.value)}
          >
            <option value="external_url">External URL</option>
            <option value="portal_file">Portal file</option>
            <option value="request_access">Request access</option>
          </select>,
        )}
      </div>
      {field(
        "Download URL",
        <input
          className="catalog-control"
          value={form.downloadUrl}
          onChange={(event) => update("downloadUrl", event.target.value)}
          placeholder="https://example.com/download"
        />,
      )}
      <div className="grid gap-4 md:grid-cols-2">
        {field(
          "Compatible product",
          <input
            className="catalog-control"
            required
            value={form.productName}
            onChange={(event) => update("productName", event.target.value)}
            placeholder="Ansys Mechanical"
          />,
        )}
        {field(
          "Compatibility text",
          <input
            className="catalog-control"
            required
            value={form.compatibilityText}
            onChange={(event) =>
              update("compatibilityText", event.target.value)
            }
          />,
        )}
      </div>
    </>
  );

  const renderBrowse = () => (
    <div className="space-y-6">
      <div className="catalog-muted-panel grid gap-3 rounded-xl p-4 md:grid-cols-4">
        {field(
          "Search",
          <input
            className="catalog-control"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search apps"
          />,
        )}
        {field(
          "Publisher",
          <select
            className="catalog-control"
            value={publisherFilter}
            onChange={(event) => setPublisherFilter(event.target.value)}
          >
            <option value="">All publishers</option>
            {publishers.map((publisher) => (
              <option key={publisher} value={publisher}>
                {publisher}
              </option>
            ))}
          </select>,
        )}
        {field(
          "Product",
          <select
            className="catalog-control"
            value={productFilter}
            onChange={(event) => setProductFilter(event.target.value)}
          >
            <option value="">All products</option>
            {products.map((product) => (
              <option key={product} value={product}>
                {product}
              </option>
            ))}
          </select>,
        )}
        {field(
          "Pricing",
          <select
            className="catalog-control"
            value={pricingFilter}
            onChange={(event) => setPricingFilter(event.target.value)}
          >
            <option value="">All pricing</option>
            <option value="free">Free</option>
            <option value="paid">Paid</option>
            <option value="contact_sales">Contact sales</option>
          </select>,
        )}
      </div>
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="grid gap-4 md:grid-cols-2">
          {filteredApps.map((app) => {
            const latest = latestVersion(app);
            return (
              <button
                key={app.id}
                type="button"
                onClick={() => {
                  setSelectedSlug(app.slug);
                  setSelectedVersionId(latest?.id || "");
                  setDownloadState({ status: "idle", message: "", url: "" });
                }}
                className={`catalog-panel rounded-xl p-4 text-left transition hover:border-emerald-600 ${selectedApp?.id === app.id ? "ring-2 ring-emerald-600/30" : ""}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-zinc-950 dark:text-white">
                      {app.name}
                    </h3>
                    <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                      {app.publisher}
                    </p>
                  </div>
                  {latest ? (
                    <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
                      v{latest.version}
                    </span>
                  ) : null}
                </div>
                <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-300">
                  {app.short_description}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {latest ? (
                    <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-100">
                      {pricingLabels[latest.pricingType] || latest.pricingType}
                    </span>
                  ) : null}
                  {productsFor(app)
                    .slice(0, 2)
                    .map((product) => (
                      <span
                        key={product}
                        className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
                      >
                        {product}
                      </span>
                    ))}
                </div>
              </button>
            );
          })}
          {filteredApps.length === 0 ? (
            <div className="catalog-muted-panel rounded-xl p-8 text-center text-sm">
              No apps match the current filters.
            </div>
          ) : null}
        </div>
        <aside className="catalog-panel rounded-xl p-5">
          {selectedApp && selectedVersion ? (
            <div className="space-y-5">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
                  {selectedApp.publisher}
                </p>
                <h2 className="mt-1 text-xl font-semibold text-zinc-950 dark:text-white">
                  {selectedApp.name}
                </h2>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
                  {selectedApp.long_description ||
                    selectedApp.short_description}
                </p>
              </div>
              {field(
                "Version",
                <select
                  className="catalog-control"
                  value={selectedVersion.id}
                  onChange={(event) => setSelectedVersionId(event.target.value)}
                >
                  {selectedVersions.map((version) => (
                    <option key={version.id} value={version.id}>
                      {version.version}
                    </option>
                  ))}
                </select>,
              )}
              <div className="catalog-muted-panel rounded-lg p-3 text-sm">
                <p>
                  <strong>Pricing:</strong>{" "}
                  {selectedVersion.priceText ||
                    pricingLabels[selectedVersion.pricingType]}
                </p>
                <p className="mt-1">
                  <strong>Download type:</strong>{" "}
                  {downloadLabels[selectedVersion.downloadType] ||
                    selectedVersion.downloadType}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-zinc-950 dark:text-white">
                  Release notes
                </h3>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
                  {selectedVersion.releaseNotes || "No release notes provided."}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-zinc-950 dark:text-white">
                  Compatibility
                </h3>
                <ul className="mt-2 space-y-2">
                  {list(selectedVersion.compatibility).map((item, index) => (
                    <li
                      key={`${item.productName}-${index}`}
                      className="catalog-muted-panel rounded-lg p-3 text-sm"
                    >
                      <span className="font-medium">{item.productName}</span>
                      <p className="mt-1">{item.compatibilityText}</p>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-2">
                <button
                  className="catalog-button"
                  type="button"
                  onClick={requestDownload}
                  disabled={downloadState.status === "loading"}
                >
                  {downloadState.status === "loading"
                    ? "Checking..."
                    : "Request download"}
                </button>
                {downloadState.message ? (
                  <p className="text-sm text-zinc-600 dark:text-zinc-300">
                    {downloadState.message}
                  </p>
                ) : null}
                {downloadState.url ? (
                  <a
                    className="text-sm font-medium text-emerald-700 hover:underline dark:text-emerald-300"
                    href={downloadState.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open approved download
                  </a>
                ) : null}
              </div>
            </div>
          ) : (
            <p className="text-sm text-zinc-600 dark:text-zinc-300">
              Select an app to view details.
            </p>
          )}
        </aside>
      </div>
    </div>
  );

  const renderCreate = () => (
    <form
      className="catalog-panel space-y-5 rounded-xl p-5"
      onSubmit={submitApp}
    >
      <div className="grid gap-4 md:grid-cols-2">
        {field(
          "App name",
          <input
            className="catalog-control"
            required
            value={form.name}
            onChange={(event) => update("name", event.target.value)}
          />,
        )}
        {field(
          "Slug",
          <input
            className="catalog-control"
            value={form.slug}
            onChange={(event) => update("slug", slugify(event.target.value))}
            placeholder={slugify(form.name) || "auto-generated"}
          />,
        )}
        {field(
          "Publisher name",
          <input
            className="catalog-control"
            required
            value={form.publisher}
            onChange={(event) => update("publisher", event.target.value)}
            placeholder="Publisher name"
          />,
        )}
        {field(
          "Publisher URL",
          <input
            className="catalog-control"
            value={form.publisherUrl}
            onChange={(event) => update("publisherUrl", event.target.value)}
            placeholder="https://example.com"
          />,
        )}
      </div>
      {field(
        "Short description",
        <input
          className="catalog-control"
          required
          value={form.shortDescription}
          onChange={(event) => update("shortDescription", event.target.value)}
        />,
      )}
      {field(
        "Long description",
        <textarea
          className="catalog-control"
          rows="4"
          value={form.longDescription}
          onChange={(event) => update("longDescription", event.target.value)}
        />,
      )}
      {formFields}
      <div className="flex items-center gap-3">
        <button
          className="catalog-button"
          type="submit"
          disabled={submitState.status === "loading"}
        >
          {submitState.status === "loading" ? "Creating..." : "Create app"}
        </button>
        {submitState.message ? (
          <p className="text-sm text-zinc-600 dark:text-zinc-300">
            {submitState.message}
          </p>
        ) : null}
      </div>
    </form>
  );

  const renderVersion = () => (
    <form
      className="catalog-panel space-y-5 rounded-xl p-5"
      onSubmit={submitVersion}
    >
      <div className="catalog-muted-panel rounded-lg p-3 text-sm">
        New versions publish immediately and appear as the latest version in the
        catalog.
      </div>
      {field(
        "Existing app",
        <select
          className="catalog-control"
          required
          value={form.appId}
          onChange={(event) => update("appId", event.target.value)}
        >
          <option value="">Select app</option>
          {apps.map((app) => (
            <option key={app.id} value={app.id}>
              {app.name} - {app.publisher}
            </option>
          ))}
        </select>,
      )}
      {formFields}
      <div className="flex items-center gap-3">
        <button
          className="catalog-button"
          type="submit"
          disabled={submitState.status === "loading"}
        >
          {submitState.status === "loading" ? "Adding..." : "Add version"}
        </button>
        {submitState.message ? (
          <p className="text-sm text-zinc-600 dark:text-zinc-300">
            {submitState.message}
          </p>
        ) : null}
      </div>
    </form>
  );

  if (loading)
    return (
      <div className="not-prose catalog-shell">
        <style>{styles}</style>
        {loadingBox("Loading catalog...")}
      </div>
    );

  return (
    <div className="not-prose catalog-shell space-y-6">
      <style>{styles}</style>
      {error ? errorBox(error) : null}
      {mode === "create"
        ? renderCreate()
        : mode === "version"
          ? renderVersion()
          : renderBrowse()}
    </div>
  );
};

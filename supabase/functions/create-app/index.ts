import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const pricingTypes = new Set(["free", "paid", "contact_sales"]);
const downloadTypes = new Set(["external_url", "portal_file", "request_access"]);

const json = (body: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const text = (value: unknown) => (typeof value === "string" ? value.trim() : "");

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const supabase = async (path: string, options: RequestInit = {}) => {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Supabase Edge Function environment is not configured.");
  }

  const response = await fetch(`${supabaseUrl.replace(/\/$/, "")}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
      ...(options.headers || {}),
    },
  });
  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(payload?.message || payload?.hint || `Supabase request failed with status ${response.status}`);
  }

  return payload;
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed." }, 405);

  try {
    const body = await req.json();
    const name = text(body.name);
    const slug = text(body.slug) || slugify(name);
    const publisher = text(body.publisher);
    const publisherUrl = text(body.publisherUrl);
    const shortDescription = text(body.shortDescription);
    const longDescription = text(body.longDescription);
    const version = text(body.version);
    const releaseNotes = text(body.releaseNotes);
    const pricingType = text(body.pricingType) || "free";
    const priceText = text(body.priceText) || (pricingType === "free" ? "Free" : "");
    const downloadType = text(body.downloadType) || "external_url";
    const downloadUrl = text(body.downloadUrl);
    const productName = text(body.productName);
    const compatibilityText = text(body.compatibilityText);

    if (!name || !slug || !publisher || !shortDescription || !version || !productName || !compatibilityText) {
      return json({ error: "Missing required app, publisher, version, or compatibility fields." }, 400);
    }

    if (!pricingTypes.has(pricingType) || !downloadTypes.has(downloadType)) {
      return json({ error: "Invalid pricing or download type." }, 400);
    }

    if (downloadUrl && !/^https?:\/\//i.test(downloadUrl)) {
      return json({ error: "Download URL must start with http:// or https://." }, 400);
    }

    const [app] = await supabase("catalog_apps", {
      method: "POST",
      body: JSON.stringify({
        slug,
        name,
        publisher,
        publisher_url: publisherUrl || null,
        short_description: shortDescription,
        long_description: longDescription || null,
        status: "published",
        versions: [
          {
            id: crypto.randomUUID(),
            version,
            releaseNotes: releaseNotes || null,
            pricingType,
            priceText: priceText || null,
            downloadType,
            downloadUrl: downloadUrl || null,
            compatibility: [{ productName, compatibilityText }],
            createdAt: new Date().toISOString(),
          },
        ],
      }),
    });

    return json({ appId: app.id, slug: app.slug, name: app.name, status: app.status });
  } catch (error) {
    return json({ error: error.message || "Unable to create app." }, 500);
  }
});

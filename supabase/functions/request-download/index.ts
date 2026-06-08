import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const text = (value: unknown) => (typeof value === "string" ? value.trim() : "");

const isUuid = (value: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);

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
  if (req.method !== "POST") return json({ allowed: false, message: "Method not allowed." }, 405);

  try {
    const body = await req.json();
    const appId = text(body.appId);
    const versionId = text(body.versionId);

    if (!appId || !versionId || !isUuid(appId) || !isUuid(versionId)) {
      return json({ allowed: false, message: "Valid app and version identifiers are required." }, 400);
    }

    const rows = await supabase(`catalog_apps?id=eq.${appId}&status=eq.published&select=id,name,slug,versions&limit=1`, {
      method: "GET",
      headers: { Prefer: "" },
    });
    const app = rows[0];
    if (!app) return json({ allowed: false, message: "This app is not available for download." }, 404);

    const version = (Array.isArray(app.versions) ? app.versions : []).find((item) => item.id === versionId);
    if (!version) return json({ allowed: false, message: "This version is not available for download." }, 404);

    // TODO: Add CRM entitlement and export-control checks here before production.
    return json({
      allowed: true,
      message: version.downloadUrl
        ? "Access approved for this prototype."
        : "Access approved. This version uses a request-access workflow and does not expose a direct URL.",
      downloadUrl: version.downloadUrl || null,
      downloadType: version.downloadType,
      appName: app.name,
      version: version.version,
    });
  } catch (error) {
    return json({ allowed: false, message: error.message || "Unable to check download access." }, 500);
  }
});

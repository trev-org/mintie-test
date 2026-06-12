import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const AUTH0_USERINFO_URL =
  "https://dev-4zlll1o27ywd47q5.us.auth0.com/userinfo";

const GROUPS_CLAIM = "https://morsemicro.com/groups";
const SESSION_TTL_SECONDS = 60 * 60 * 24;

type DenoServe = (
  handler: (req: Request) => Response | Promise<Response>,
) => void;

const serve = (globalThis as typeof globalThis & { Deno: { serve: DenoServe } })
  .Deno.serve;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders(),
    });
  }

  if (req.method !== "GET" && req.method !== "POST") {
    return json({ error: "method not allowed" }, 405);
  }

  const auth = req.headers.get("authorization");

  if (!auth?.startsWith("Bearer ")) {
    return json({ error: "missing token" }, 401);
  }

  const response = await fetch(AUTH0_USERINFO_URL, {
    headers: { Authorization: auth },
  });

  if (!response.ok) {
    return json({ error: "invalid token" }, 401);
  }

  const info = await response.json();
  const groups = Array.isArray(info[GROUPS_CLAIM]) ? info[GROUPS_CLAIM] : [];

  return json({
    groups,
    expiresAt: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  });
});

function json(body: unknown, status = 200) {
  return Response.json(body, {
    status,
    headers: {
      ...corsHeaders(),
      "Cache-Control": "no-store",
    },
  });
}

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, content-type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  };
}

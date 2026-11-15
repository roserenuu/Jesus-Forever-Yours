const BEEHIIV_SUBSCRIBE = "https://roses-newsletter-dd1f8d.beehiiv.com/subscribe";
const DEFAULT_PUBLICATION_ID = "pub_91a8edaf-62b8-4ac0-8e60-a75ef441a8e7";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function env(name) {
  try {
    if (typeof Netlify !== "undefined" && Netlify.env && typeof Netlify.env.get === "function") {
      const value = Netlify.env.get(name);
      if (value) return value;
    }
  } catch {
    // Fall through to process.env for local checks.
  }
  return process.env[name] || "";
}

function wantsJson(req) {
  const accept = req.headers.get("accept") || "";
  return accept.includes("application/json");
}

function fallbackUrl(email) {
  const url = new URL(BEEHIIV_SUBSCRIBE);
  if (email) url.searchParams.set("email", email);
  return url.toString();
}

function json(body, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", ...extraHeaders },
  });
}

function redirect(to) {
  return new Response(null, { status: 302, headers: { Location: to } });
}

function thankYouRedirect(req, referringSite) {
  let back = "/";
  try {
    if (referringSite) {
      const from = new URL(referringSite, req.url);
      back = from.pathname || "/";
    }
  } catch {
    back = "/";
  }
  const dest = new URL(back, req.url);
  dest.searchParams.set("subscribed", "1");
  return dest.toString();
}

async function readFields(req) {
  const url = new URL(req.url);
  const fields = {
    email: (url.searchParams.get("email") || "").trim(),
    bot: url.searchParams.get("bot-field") || "",
    referringSite: url.searchParams.get("referring_site") || req.headers.get("referer") || "",
  };
  if (req.method !== "POST") return fields;

  const contentType = req.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    const body = await req.json().catch(() => ({}));
    fields.email = String(body.email || fields.email).trim();
    fields.bot = String(body["bot-field"] || fields.bot);
    fields.referringSite = String(body.referring_site || fields.referringSite);
    return fields;
  }

  const text = await req.text();
  const params = new URLSearchParams(text);
  fields.email = (params.get("email") || fields.email).trim();
  fields.bot = params.get("bot-field") || fields.bot;
  fields.referringSite = params.get("referring_site") || fields.referringSite;
  return fields;
}

async function createBeehiivSubscription(email, referringSite) {
  const apiKey = env("BEEHIIV_API_KEY");
  const publicationId = env("BEEHIIV_PUBLICATION_ID") || DEFAULT_PUBLICATION_ID;
  if (!apiKey || !env("BEEHIIV_PUBLICATION_ID")) return { usedApi: false };

  const response = await fetch(
    `https://api.beehiiv.com/v2/publications/${publicationId}/subscriptions`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        reactivate_existing: true,
        send_welcome_email: true,
        utm_source: "jesusforeveryours.com",
        referring_site: referringSite || "https://jesusforeveryours.com/",
      }),
    },
  );

  if (response.ok) return { usedApi: true, ok: true };
  // Duplicate or already-active subscribers should still see a thank-you.
  if (response.status === 400) return { usedApi: true, ok: true };
  return { usedApi: true, ok: false };
}

async function handleSubscribe(req) {
  const asJson = wantsJson(req);
  const fields = await readFields(req);
  const email = fields.email.toLowerCase();

  if (fields.bot) {
    if (asJson) return json({ ok: true });
    return redirect(thankYouRedirect(req, fields.referringSite));
  }

  if (!EMAIL_RE.test(email)) {
    if (asJson) return json({ ok: false, error: "invalid_email" }, 400);
    return redirect(BEEHIIV_SUBSCRIBE);
  }

  try {
    const result = await createBeehiivSubscription(email, fields.referringSite);
    if (result.usedApi && result.ok) {
      if (asJson) return json({ ok: true });
      return redirect(thankYouRedirect(req, fields.referringSite));
    }
  } catch {
    // Fall through to the public Beehiiv subscribe page.
  }

  const dest = fallbackUrl(email);
  if (asJson) return json({ ok: true, redirect: dest });
  return redirect(dest);
}

export default async (req) => {
  switch (req.method) {
    case "GET":
    case "POST":
      return handleSubscribe(req);
    case "OPTIONS":
      return new Response("", { status: 204, headers: { Allow: "GET, POST, OPTIONS" } });
    default:
      return new Response("Method not allowed", {
        status: 405,
        headers: { Allow: "GET, POST, OPTIONS" },
      });
  }
};

export const config = {
  method: ["GET", "POST", "OPTIONS"],
};

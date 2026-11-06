#!/usr/bin/env python3
"""Build every homepage (English + each language) from one template.

    python3 tools/home/build.py

Text lives in tools/home/strings/<code>.json (en.json is the source).
Output: "Forever Yours Website/index.html" and "Forever Yours Website/<code>/index.html".
Edit the template below to change the design for all languages at once.
"""
import html
import json
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parents[2]
SITE = ROOT / "Forever Yours Website"
STRINGS = pathlib.Path(__file__).resolve().parent / "strings"
BASE = "https://jesusforeveryours.com"

# code, hreflang, html lang, og locale, native name, rtl
LANGS = [
    ("en", "en", "en", "en_US", "English", False),
    ("fr", "fr", "fr", "fr_FR", "Français", False),
    ("de", "de", "de", "de_DE", "Deutsch", False),
    ("it", "it", "it", "it_IT", "Italiano", False),
    ("es", "es", "es", "es_ES", "Español", False),
    ("pt-br", "pt-BR", "pt-BR", "pt_BR", "Português (Brasil)", False),
    ("pt-pt", "pt-PT", "pt-PT", "pt_PT", "Português (Portugal)", False),
    ("nl", "nl", "nl", "nl_NL", "Nederlands", False),
    ("sv", "sv", "sv", "sv_SE", "Svenska", False),
    ("da", "da", "da", "da_DK", "Dansk", False),
    ("nb", "nb", "nb", "nb_NO", "Norsk bokmål", False),
    ("fi", "fi", "fi", "fi_FI", "Suomi", False),
    ("pl", "pl", "pl", "pl_PL", "Polski", False),
    ("ne", "ne", "ne", "ne_NP", "नेपाली", False),
    ("hi", "hi", "hi", "hi_IN", "हिन्दी", False),
    ("id", "id", "id", "id_ID", "Bahasa Indonesia", False),
    ("ko", "ko", "ko", "ko_KR", "한국어", False),
    ("fil", "fil", "fil", "fil_PH", "Filipino", False),
    ("sw", "sw", "sw", "sw_KE", "Kiswahili", False),
    ("ru", "ru", "ru", "ru_RU", "Русский", False),
    ("zh-hans", "zh-Hans", "zh-Hans", "zh_CN", "简体中文", False),
    ("ja", "ja", "ja", "ja_JP", "日本語", False),
    ("ar", "ar", "ar", "ar_AR", "العربية", True),
]

# Scripts Playfair Display / Inter don't cover: load a matching Noto pair.
SCRIPT_FONTS = {
    "hi": ("Noto Serif Devanagari", "Noto Sans Devanagari"),
    "ne": ("Noto Serif Devanagari", "Noto Sans Devanagari"),
    "ja": ("Noto Serif JP", "Noto Sans JP"),
    "ko": ("Noto Serif KR", "Noto Sans KR"),
    "zh-hans": ("Noto Serif SC", "Noto Sans SC"),
    "ar": ("Noto Naskh Arabic", "Noto Sans Arabic"),
}

APPSTORE = "https://apps.apple.com/us/app/jesus-forever-yours/id6758735416"
PLAY = "https://play.google.com/store/apps/details?id=com.jesusforeveryours.foreveryours"
APPLE_SVG = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>'
PLAY_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#34A853" d="M3.6 1.8c-.3.3-.5.8-.5 1.4v17.6c0 .6.2 1.1.5 1.4l.1.1 9.9-9.9v-.2L3.7 1.7l-.1.1z"/><path fill="#FBBC04" d="M16.9 15.7l-3.3-3.3v-.2l3.3-3.3.1.1 3.9 2.2c1.1.6 1.1 1.7 0 2.3l-3.9 2.2h-.1z"/><path fill="#EA4335" d="M17 15.6l-3.4-3.4-10 10c.4.4 1 .4 1.7.1L17 15.6"/><path fill="#4285F4" d="M17 8.8L5.3 2.1c-.7-.4-1.3-.3-1.7.1l10 10L17 8.8z"/></svg>'

ICON = '<span class="h-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{}</svg></span>'
ICONS = {
    "letter": '<path d="M4 6h16v12H4z"/><path d="M4 7l8 6 8-6"/>',
    "prayer": '<path d="M12 21s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.5-7 10-7 10z"/>',
    "bible": '<path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3z"/><path d="M8 4v13"/>',
    "buddy": '<path d="M4 5h16v11H8l-4 4z"/>',
    "carousel": '<rect x="7" y="4" width="10" height="16" rx="2"/><path d="M3 7v10M21 7v10"/>',
    "devotional": '<path d="M12 6c-2-1.5-5-2-8-1.5V19c3-.5 6 0 8 1.5 2-1.5 5-2 8-1.5V4.5c-3-.5-6 0-8 1.5z"/><path d="M12 6v14.5"/>',
}


def e(s):
    return html.escape(s, quote=True)


def badges(t):
    return (
        f'<div class="h-badges"><a href="{APPSTORE}" target="_blank" rel="noopener" class="store-badge" aria-label="{e(t["appstore_aria"])}">'
        f'{APPLE_SVG}<span class="store-badge-text"><small>{e(t["appstore_small"])}</small><strong>{e(t["appstore_big"])}</strong></span></a>'
        f'<a href="{PLAY}" target="_blank" rel="noopener" class="store-badge" aria-label="{e(t["play_aria"])}">'
        f'{PLAY_SVG}<span class="store-badge-text"><small>{e(t["play_small"])}</small><strong>{e(t["play_big"])}</strong></span></a></div>'
    )


def page(code, hreflang, lang, locale, name, rtl, t):
    path = "/" if code == "en" else f"/{code}/"
    url = BASE + path
    alternates = "\n".join(
        f'  <link rel="alternate" hreflang="{h}" href="{BASE}{"/" if c == "en" else "/" + c + "/"}" />'
        for c, h, *_ in LANGS
    ) + f'\n  <link rel="alternate" hreflang="x-default" href="{BASE}/" />'
    current = ' aria-current="page"'
    lang_nav = "".join(
        f'<a href="{"/" if c == "en" else "/" + c + "/"}" hreflang="{h}" lang="{h}"{current if c == code else ""}>{n}</a>'
        for c, h, _l, _o, n, _r in LANGS
    )
    fonts = "family=Playfair+Display:ital,wght@0,400;0,500;1,700&family=Inter:wght@400;500;600"
    script_css = ""
    if code in SCRIPT_FONTS:
        serif, sans = SCRIPT_FONTS[code]
        fonts += f"&family={serif.replace(' ', '+')}:wght@400;500;600&family={sans.replace(' ', '+')}:wght@400;500;600"
        script_css = (
            f'\n  <style>:root{{--font-serif:"{serif}","Playfair Display",serif;--serif:"{serif}","Playfair Display",serif;'
            f'--font-sans:"{sans}","Inter",system-ui,sans-serif;--sans:"{sans}","Inter",system-ui,sans-serif}}'
            f'body,p,li,a,button,input{{font-family:var(--font-sans)}}</style>'
        )
    if code == "ko":
        script_css += '\n  <style>.h-hero h1{max-width:none;word-break:keep-all;text-wrap:balance}h2,h3,p{word-break:keep-all}</style>'
    if code in ("ja", "zh-hans"):
        script_css += '\n  <style>.h-hero h1{max-width:8.5em;line-break:strict;overflow-wrap:anywhere}h2,h3,p{line-break:strict}.h-copy{min-width:0}</style>'
    if rtl:
        script_css += '\n  <style>.h-cards,.h-qa,.h-book{text-align:right}</style>'
    ld = {
        "@context": "https://schema.org",
        "@type": "MobileApplication",
        "name": "Jesus Forever Yours",
        "operatingSystem": "iOS, Android",
        "applicationCategory": "LifestyleApplication",
        "inLanguage": hreflang,
        "description": t["ld_description"],
        "url": url,
        "image": f"{BASE}/app-icon.png",
        "author": {"@type": "Person", "name": "Rose Renuu"},
        "offers": {"@type": "Offer", "price": "0", "priceCurrency": "USD"},
        "sameAs": [APPSTORE, PLAY],
    }
    cards = "".join(
        f'<article class="h-card">{ICON.format(ICONS[k])}<h3>{e(t["card_" + k + "_h"])}</h3><p>{e(t["card_" + k + "_p"])}</p></article>'
        for k in ["letter", "prayer", "bible", "buddy", "carousel", "devotional"]
    )
    qa = "".join(
        f'<div class="h-qa-row"><h3>{e(t["q" + str(i)])}</h3><p>{e(t["a" + str(i)])}</p></div>'
        for i in range(1, 5)
    )
    pv = "" if code == "en" else ""  # placeholder for per-language tweaks
    return f'''<!DOCTYPE html>
<html lang="{lang}"{' dir="rtl"' if rtl else ''}>
<head>
  <!-- Generated by tools/home/build.py from tools/home/strings/{code}.json. Edit those, not this file. -->
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{e(t["title"])}</title>
  <meta name="description" content="{e(t["meta_description"])}" />
  <link rel="canonical" href="{url}" />
{alternates}
  <link rel="stylesheet" href="/shared.css" />
  <link rel="stylesheet" href="/site.css">
  <link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="https://fonts.googleapis.com/css2?{fonts}&display=swap">
  <link rel="stylesheet" href="/home.css">
  <link rel="icon" type="image/png" href="/app-icon.png">
  <link rel="apple-touch-icon" href="/app-icon.png">
  <meta property="og:type" content="website">
  <meta property="og:url" content="{url}">
  <meta property="og:locale" content="{locale}">
  <meta property="og:title" content="{e(t["title"])}">
  <meta property="og:description" content="{e(t["meta_description"])}">
  <meta property="og:image" content="{BASE}/app-icon.png">
  <meta property="og:site_name" content="Jesus Forever Yours">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="{e(t["title"])}">
  <meta name="twitter:description" content="{e(t["meta_description"])}">
  <meta name="twitter:image" content="{BASE}/app-icon.png">
  <meta name="apple-itunes-app" content="app-id=6758735416">
  <script type="application/ld+json">
{json.dumps(ld, ensure_ascii=False, indent=2)}
  </script>
  <meta name="p:domain_verify" content="1184f538de9a34e84c5d82cf3ccbd1bf"/>
  <link rel="stylesheet" href="/brand.css">{script_css}
</head>
<body>
<header class="hd"><div class="hd-in"><a href="{path}" class="hd-logo"><img src="/logo-text.png" alt="Jesus Forever Yours" width="177" height="24"></a><nav aria-label="{e(t["nav_label"])}"><a href="{path}" aria-current="page">{e(t["nav_home"])}</a><a href="{path}#app">{e(t["nav_app"])}</a><a href="/digital">{e(t["nav_book"])}</a><a href="/verses/">{e(t["nav_verses"])}</a><a href="/contact">{e(t["nav_contact"])}</a></nav></div></header>
<main>
  <section class="h-hero" id="app">
    <div class="h-copy">
      <h1>{e(t["h1"])}</h1>
      <p class="h-lead">{e(t["lead"])}</p>
      {badges(t)}
    </div>
    <div class="iph" role="img" aria-label="{e(t["phone_aria"])}">
      <span class="iph-btn iph-action"></span><span class="iph-btn iph-volup"></span><span class="iph-btn iph-voldn"></span><span class="iph-btn iph-side"></span><span class="iph-btn iph-cam"></span>
      <div class="iph-bezel"><div class="iph-screen" data-theme="light">
        <div class="iph-slides">
          <img class="is-on" src="/images/screen-letter.webp" data-status="light" alt="" width="588" height="1280">
          <img src="/images/screen-verse.webp" data-status="light" alt="" width="588" height="1280" loading="lazy">
          <img src="/images/screen-prayer.webp" data-status="light" alt="" width="588" height="1280" loading="lazy">
          <img src="/images/screen-carousel.webp" data-status="dark" alt="" width="588" height="1280" loading="lazy">
          <img src="/images/screen-bible.webp" data-status="dark" alt="" width="588" height="1280" loading="lazy">
        </div>
        <div class="iph-status" aria-hidden="true">
          <span class="iph-time">9:41</span>
          <span class="iph-island"></span>
          <span class="iph-icons"><svg viewBox="0 0 18 12"><rect x="0" y="8" width="3" height="4" rx=".7"/><rect x="5" y="5.5" width="3" height="6.5" rx=".7"/><rect x="10" y="3" width="3" height="9" rx=".7"/><rect x="15" y="0" width="3" height="12" rx=".7"/></svg><svg viewBox="0 0 16 12"><path d="M8 2.3c2.4 0 4.6.9 6.2 2.5l1.2-1.2C13.4 1.6 10.8.6 8 .6S2.6 1.6.6 3.6l1.2 1.2C3.4 3.2 5.6 2.3 8 2.3zm0 3.4c1.5 0 2.8.6 3.8 1.5L13 6c-1.3-1.3-3.1-2-5-2s-3.7.7-5 2l1.2 1.2c1-.9 2.3-1.5 3.8-1.5zm0 3.4c.6 0 1.1.2 1.5.6L8 11.2 6.5 9.7c.4-.4.9-.6 1.5-.6z"/></svg><svg viewBox="0 0 27 12"><rect x=".5" y=".5" width="23" height="11" rx="3.2" fill="none" stroke="currentColor" opacity=".4"/><rect x="2" y="2" width="20" height="8" rx="2"/><path d="M25 4v4c.8-.3 1.3-1.1 1.3-2s-.5-1.7-1.3-2z" opacity=".45"/></svg></span>
        </div>
      </div></div>
    </div>
  </section>

  <section class="h-sec">
    <h2>{e(t["inside_h2"])}</h2>
    <div class="h-cards">{cards}</div>
  </section>

  <section class="h-sec" id="book">
    <div class="h-book">
      <img src="/book-cover-cut.webp" alt="{e(t["book_alt"])}" width="420" height="560" loading="lazy">
      <div><h2>{e(t["book_h2"])}</h2><p>{e(t["book_p"])}</p><a class="h-btn" href="/digital">{e(t["book_btn"])}</a></div>
    </div>
  </section>

  <section class="h-sec" id="questions">
    <h2>{e(t["qa_h2"])}</h2>
    <div class="h-qa">{qa}</div>
  </section>

  <section class="h-end">
    <img src="/app-icon.png" alt="" width="64" height="64" class="h-end-ic">
    <h2>{e(t["end_h2"])}</h2>
    {badges(t)}
    <div class="h-letter">
      <form action="{path}" class="email-form" id="newsletterForm" method="POST" name="newsletter" data-netlify="true" netlify-honeypot="bot-field">
        <input type="hidden" name="form-name" value="newsletter" />
        <input type="hidden" name="language" value="{code}" />
        <p class="hp-field" hidden aria-hidden="true"><label>Leave empty <input name="bot-field" tabindex="-1" autocomplete="off" /></label></p>
        <input type="email" id="emailInput" name="email" required autocomplete="email" placeholder="{e(t["email_placeholder"])}" aria-label="{e(t["email_placeholder"])}">
        <button type="submit" id="emailSubmit">{e(t["email_button"])}</button>
      </form>
      <p class="email-success" id="emailSuccess" hidden>{e(t["email_success"])}</p>
    </div>
  </section>
</main>
<footer class="jf"><div class="jf-in"><span>&copy; 2026 Rose Renuu LLC</span><nav aria-label="{e(t["footer_label"])}"><a href="/privacy">{e(t["footer_privacy"])}</a><a href="/terms">{e(t["footer_terms"])}</a><a href="https://instagram.com/jesusforeveryours" rel="noopener">Instagram</a><a href="mailto:support@jesusforeveryours.com">support@jesusforeveryours.com</a></nav></div>
<nav class="jf-lang" aria-label="{e(t["lang_label"])}">{lang_nav}</nav>
</footer>
<script>
  // Email signup -> Netlify Forms ("newsletter")
  document.getElementById('newsletterForm').addEventListener('submit', function (e) {{
    var form = e.target, input = document.getElementById('emailInput');
    if (!input.checkValidity()) {{ e.preventDefault(); input.reportValidity(); return; }}
    if (!window.fetch) return;
    e.preventDefault();
    var btn = document.getElementById('emailSubmit'); btn.disabled = true;
    fetch('/', {{ method: 'POST', headers: {{ 'Content-Type': 'application/x-www-form-urlencoded' }}, body: new URLSearchParams(new FormData(form)).toString() }})
      .then(function (r) {{ if (!r.ok) throw new Error('HTTP ' + r.status); form.style.display = 'none'; document.getElementById('emailSuccess').hidden = false; }})
      .catch(function () {{ btn.disabled = false; form.submit(); }});
  }});
  // Phone: slide through the app screens like swiping on an iPhone.
  (function () {{
    var screen = document.querySelector('.iph-screen');
    var slides = screen ? screen.querySelectorAll('.iph-slides img') : [];
    if (slides.length < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var i = 0, visible = true, timer = null;
    function go() {{
      if (!visible || document.hidden) return;
      var cur = slides[i]; i = (i + 1) % slides.length; var next = slides[i];
      cur.classList.remove('is-on'); cur.classList.add('is-off');
      next.classList.remove('is-off'); next.classList.add('is-on');
      screen.setAttribute('data-theme', next.getAttribute('data-status'));
      setTimeout(function () {{ cur.classList.remove('is-off'); }}, 900);
    }}
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) {{ visible = es[0].isIntersecting; }}).observe(screen);
    timer = setInterval(go, 3600);
  }})();
</script>
</body>
</html>
'''


def main():
    en = json.loads((STRINGS / "en.json").read_text())
    only = set(sys.argv[1:])
    built, missing = [], []
    for code, hreflang, lang, locale, name, rtl in LANGS:
        if only and code not in only:
            continue
        f = STRINGS / f"{code}.json"
        if not f.exists():
            missing.append(code)
            continue
        t = json.loads(f.read_text())
        gaps = [k for k in en if k not in t]
        if gaps:
            sys.exit(f"{code}.json is missing keys: {gaps}")
        out = SITE / ("index.html" if code == "en" else f"{code}/index.html")
        out.write_text(page(code, hreflang, lang, locale, name, rtl, t))
        built.append(code)
    print("built:", " ".join(built))
    if missing:
        print("no strings yet:", " ".join(missing))


if __name__ == "__main__":
    main()

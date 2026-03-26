import puppeteer from 'puppeteer-core';
import fs from 'fs';

const browser = await puppeteer.launch({
  executablePath: '/root/.cache/ms-playwright/chromium-1194/chrome-linux/chrome',
  headless: 'new',
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--window-size=1920,1080']
});

const page = await browser.newPage();
await page.setViewport({ width: 1920, height: 1080 });
await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

console.log('Navigating to creatorcollege.com...');
await page.goto('https://creatorcollege.com', { waitUntil: 'networkidle2', timeout: 60000 });

// Take full page screenshot
await page.screenshot({ path: 'screenshot-full.png', fullPage: true });
console.log('Full page screenshot saved');

// Take viewport screenshots at different scroll positions
const totalHeight = await page.evaluate(() => document.body.scrollHeight);
console.log('Page height:', totalHeight);

for (let i = 0; i * 1080 < totalHeight; i++) {
  await page.evaluate((y) => window.scrollTo(0, y), i * 1080);
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: `screenshot-section-${i}.png` });
  console.log(`Screenshot section ${i} saved`);
}

// Extract full HTML
const html = await page.content();
fs.writeFileSync('scraped-page.html', html);
console.log('HTML saved');

// Extract all styles
const styles = await page.evaluate(() => {
  const results = {};

  // Get computed styles of key elements
  const body = document.body;
  const computedBody = getComputedStyle(body);
  results.bodyBg = computedBody.backgroundColor;
  results.bodyColor = computedBody.color;
  results.bodyFont = computedBody.fontFamily;

  // Get all text content section by section
  const sections = document.querySelectorAll('section, [class*="section"], header, footer, nav, main, [class*="hero"], [class*="banner"]');
  results.sections = [];
  sections.forEach((s, i) => {
    results.sections.push({
      tag: s.tagName,
      className: s.className,
      id: s.id,
      text: s.innerText?.substring(0, 2000),
      bg: getComputedStyle(s).backgroundColor,
      color: getComputedStyle(s).color,
    });
  });

  // Get all links
  results.links = [...document.querySelectorAll('a')].map(a => ({
    text: a.innerText?.trim(),
    href: a.href,
    className: a.className
  }));

  // Get all images
  results.images = [...document.querySelectorAll('img')].map(img => ({
    src: img.src,
    alt: img.alt,
    width: img.naturalWidth,
    height: img.naturalHeight,
    className: img.className
  }));

  // Get all stylesheets content
  results.inlineStyles = [...document.querySelectorAll('style')].map(s => s.textContent);

  // Get all external stylesheet URLs
  results.externalStyles = [...document.querySelectorAll('link[rel="stylesheet"]')].map(l => l.href);

  // Get all headings
  results.headings = [...document.querySelectorAll('h1, h2, h3, h4, h5, h6')].map(h => ({
    tag: h.tagName,
    text: h.innerText,
    fontSize: getComputedStyle(h).fontSize,
    fontWeight: getComputedStyle(h).fontWeight,
    color: getComputedStyle(h).color,
    fontFamily: getComputedStyle(h).fontFamily
  }));

  // Get all buttons
  results.buttons = [...document.querySelectorAll('button, [class*="btn"], [class*="button"], a[class*="cta"]')].map(b => ({
    text: b.innerText?.trim(),
    className: b.className,
    bg: getComputedStyle(b).backgroundColor,
    color: getComputedStyle(b).color,
    borderRadius: getComputedStyle(b).borderRadius,
    padding: getComputedStyle(b).padding,
    fontSize: getComputedStyle(b).fontSize
  }));

  // Get page title and meta
  results.title = document.title;
  results.metaDescription = document.querySelector('meta[name="description"]')?.content;

  // Get all unique font families used
  const allElements = document.querySelectorAll('*');
  const fonts = new Set();
  allElements.forEach(el => {
    fonts.add(getComputedStyle(el).fontFamily);
  });
  results.fonts = [...fonts];

  // Get all unique colors used
  const colors = new Set();
  allElements.forEach(el => {
    const cs = getComputedStyle(el);
    colors.add(cs.color);
    colors.add(cs.backgroundColor);
  });
  results.colors = [...colors].filter(c => c !== 'rgba(0, 0, 0, 0)');

  return results;
});

fs.writeFileSync('scraped-data.json', JSON.stringify(styles, null, 2));
console.log('Styles and data extracted');

// Extract all CSS from external stylesheets
const cssContents = [];
for (const url of styles.externalStyles) {
  try {
    const res = await page.evaluate(async (url) => {
      const r = await fetch(url);
      return await r.text();
    }, url);
    cssContents.push({ url, css: res });
  } catch(e) {
    console.log('Failed to fetch CSS:', url);
  }
}
fs.writeFileSync('scraped-css.json', JSON.stringify(cssContents, null, 2));
console.log('CSS files extracted');

// Get full page text content
const fullText = await page.evaluate(() => document.body.innerText);
fs.writeFileSync('scraped-text.txt', fullText);
console.log('Full text content saved');

await browser.close();
console.log('Done!');

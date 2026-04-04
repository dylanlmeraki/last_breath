const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
(async () => {
  const outDir = path.join(process.cwd(), 'artifacts', 'step4-home-tighten');
  fs.mkdirSync(outDir, { recursive: true });
  const browser = await puppeteer.launch({headless: true});
  const page = await browser.newPage();
  const viewports = [
    { name: 'mobile', width: 430, height: 932 },
    { name: 'compact', width: 1100, height: 760 },
    { name: 'desktop', width: 1440, height: 900 },
  ];
  const results = [];
  for (const viewport of viewports) {
    await page.setViewport({ width: viewport.width, height: viewport.height, isMobile: viewport.name === 'mobile', hasTouch: viewport.name === 'mobile', deviceScaleFactor: 1 });
    const consoleMessages = [];
    const pageErrors = [];
    page.removeAllListeners('console');
    page.removeAllListeners('pageerror');
    page.on('console', msg => {
      const text = msg.text();
      if (!text.includes('Download the React DevTools')) consoleMessages.push({ type: msg.type(), text });
    });
    page.on('pageerror', err => pageErrors.push(String(err)));
    await page.goto('http://127.0.0.1:5000/', { waitUntil: 'networkidle2', timeout: 120000 });
    await page.evaluate(() => window.scrollTo(0, 0));
    await delay(1200);
    const data = await page.evaluate(() => {
      const docEl = document.documentElement;
      const sticky = document.querySelector('[data-testid="mobile-sticky-bar"]');
      const header = document.querySelector('header');
      const proofRail = document.querySelector('.proof-rail-inner');
      const snippets = Array.from(document.querySelectorAll('.project-snippet-media img'));
      const mapCard = document.querySelector('.project-map-card');
      const dividerCount = document.querySelectorAll('.pe-section-divider').length;
      const activeSnippet = document.querySelector('.project-snippet.is-active');
      const projectEvidence = document.querySelector('.project-evidence');
      return {
        shellProfile: document.querySelector('.marketing-portal')?.getAttribute('data-shell-profile'),
        scrollWidth: docEl.scrollWidth,
        clientWidth: docEl.clientWidth,
        hasOverflow: docEl.scrollWidth > docEl.clientWidth,
        headerPosition: header ? getComputedStyle(header).position : null,
        stickyExists: Boolean(sticky),
        stickyPosition: sticky ? getComputedStyle(sticky).position : null,
        stickyBottom: sticky ? getComputedStyle(sticky).bottom : null,
        stickyDisplay: sticky ? getComputedStyle(sticky).display : null,
        proofRailRadius: proofRail ? getComputedStyle(proofRail).borderRadius : null,
        mapHeight: mapCard ? Math.round(mapCard.getBoundingClientRect().height) : null,
        snippetImageCount: snippets.length,
        snippetImageSources: snippets.map((img) => img.getAttribute('src')).filter(Boolean).slice(0, 3),
        dividerCount,
        activeSnippetHeight: activeSnippet ? Math.round(activeSnippet.getBoundingClientRect().height) : null,
        projectEvidenceColumns: projectEvidence ? getComputedStyle(projectEvidence).gridTemplateColumns : null,
        heroHeading: document.querySelector('[data-testid="section-hero"] h1')?.textContent?.trim() ?? null,
      };
    });
    await page.screenshot({ path: path.join(outDir, `${viewport.name}.png`), fullPage: true });
    results.push({ viewport, data, consoleMessages, pageErrors });
  }
  await browser.close();
  console.log(JSON.stringify(results, null, 2));
})();

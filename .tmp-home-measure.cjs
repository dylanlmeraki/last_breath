const puppeteer = require('puppeteer');
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
(async () => {
  const browser = await puppeteer.launch({headless: true});
  const page = await browser.newPage();
  const viewports = [
    { name: 'mobile', width: 430, height: 932, isMobile: false },
    { name: 'compact', width: 1100, height: 760, isMobile: false },
    { name: 'desktop', width: 1440, height: 900, isMobile: false },
  ];
  const results = [];
  for (const viewport of viewports) {
    await page.setViewport({ width: viewport.width, height: viewport.height, deviceScaleFactor: 1, isMobile: viewport.isMobile, hasTouch: viewport.name === 'mobile' });
    const consoleMessages = [];
    const pageErrors = [];
    page.removeAllListeners('console');
    page.removeAllListeners('pageerror');
    page.on('console', msg => {
      const text = msg.text();
      if (!text.includes('Download the React DevTools')) consoleMessages.push(text);
    });
    page.on('pageerror', err => pageErrors.push(String(err)));
    await page.goto('http://127.0.0.1:5000/', { waitUntil: 'networkidle2', timeout: 120000 });
    await delay(1000);
    const data = await page.evaluate(() => {
      const qs = (sel) => document.querySelector(sel);
      const rect = (sel) => {
        const el = qs(sel);
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { width: Math.round(r.width), height: Math.round(r.height), top: Math.round(r.top) };
      };
      const docEl = document.documentElement;
      const sticky = qs('[data-testid="mobile-sticky-bar"]');
      const projectEvidence = qs('.project-evidence');
      const projectMap = qs('.project-map-card');
      const snippet = qs('.project-snippet.is-active');
      return {
        innerWidth: window.innerWidth,
        docClientWidth: docEl.clientWidth,
        scrollWidth: docEl.scrollWidth,
        hasOverflow: docEl.scrollWidth > docEl.clientWidth,
        shellProfile: qs('.marketing-portal')?.getAttribute('data-shell-profile'),
        hero: rect('[data-testid="section-hero"]'),
        proofRail: rect('.proof-rail-inner'),
        projectEvidence: rect('.project-evidence'),
        projectEvidenceColumns: projectEvidence ? getComputedStyle(projectEvidence).gridTemplateColumns : null,
        projectMap: rect('.project-map-card'),
        snippet: rect('.project-snippet.is-active'),
        featuredGrid: rect('.featured-work-grid'),
        stickyExists: Boolean(sticky),
        stickyDisplay: sticky ? getComputedStyle(sticky).display : null,
        stickyPosition: sticky ? getComputedStyle(sticky).position : null,
        sectionDividerCount: document.querySelectorAll('.pe-section-divider').length,
        snippetImageCount: document.querySelectorAll('.project-snippet-media img').length,
      };
    });
    results.push({ viewport, data, consoleMessages, pageErrors });
  }
  await browser.close();
  console.log(JSON.stringify(results, null, 2));
})();

import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('pageerror', err => {
    console.log('PAGE ERROR:', err.toString());
  });
  
  page.on('console', msg => {
    console.log('BROWSER CONSOLE:', msg.type(), msg.text());
  });

  try {
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
    console.log("Page loaded.");
  } catch(e) {
    console.log("Error:", e.message);
  }
  
  await browser.close();
})();

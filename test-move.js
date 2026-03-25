import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000); // 

  const nextBtn = await page.$$('.btn-secondary');
  if (nextBtn.length > 1) {
    await nextBtn[1].click(); // click Next
    await page.waitForTimeout(1000); // wait for anim
    const section = await page.$('#portfolio');
    await section.scrollIntoViewIfNeeded();
    await section.screenshot({ path: 'portfolio-next.png' });
    console.log("Screenshot saved to portfolio-next.png");
  }
  
  await browser.close();
})();

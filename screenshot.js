import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  
  // Wait for loader to disappear
  await page.waitForTimeout(2000); 

  // Scroll to portfolio section
  const section = await page.$('#portfolio');
  if (section) {
    await section.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500); // let animations settle
    await section.screenshot({ path: 'portfolio-screenshot.png' });
    console.log("Screenshot saved to portfolio-screenshot.png");
    
    // Check bounding box
    const box = await section.boundingBox();
    console.log("Section bounding box:", box);
  } else {
    console.log("Portfolio section NOT FOUND in DOM!");
    await page.screenshot({ path: 'full-screenshot.png' });
  }
  
  await browser.close();
})();

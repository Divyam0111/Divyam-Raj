import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:5173/admin', { waitUntil: 'networkidle' });
  
  // Login first!
  // It says: <Login onLogin={setToken} />
  // Assume login has simple form
  const emailInput = await page.$('input[type="email"]');
  if (emailInput) {
    await emailInput.fill('divyam.official0111@gmail.com');
    await page.fill('input[type="password"]', '0000000000');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000); // Wait for login
  }

  // Click Portfolio tab in Sidebar
  // <button className="nav-item">Portfolio</button>
  const buttons = await page.$$('.nav-item');
  for (let btn of buttons) {
    const text = await btn.textContent();
    if (text.trim() === 'Portfolio') {
      await btn.click();
      break;
    }
  }
  
  await page.waitForTimeout(1000); // Let it render
  await page.screenshot({ path: 'admin-portfolio.png' });
  console.log("Screenshot saved to admin-portfolio.png");
  
  await browser.close();
})();

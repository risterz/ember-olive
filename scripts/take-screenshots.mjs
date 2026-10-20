import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUTPUT_DIR = path.resolve('docs/screenshots');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function capture() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    defaultViewport: { width: 1440, height: 900, deviceScaleFactor: 2 },
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  console.log('Navigating to http://localhost:5173/...');
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });

  // Wait for loading screen to complete and fade out
  console.log('Waiting for intro animation...');
  await new Promise((r) => setTimeout(r, 3500));

  // 1. Hero Screenshot
  console.log('Capturing Hero...');
  await page.screenshot({
    path: path.join(OUTPUT_DIR, '01-hero.png'),
    clip: { x: 0, y: 0, width: 1440, height: 900 }
  });

  // 2. Story / Philosophy section
  console.log('Capturing Story / Philosophy...');
  await page.evaluate(() => {
    document.querySelector('#story')?.scrollIntoView({ behavior: 'instant' });
  });
  await new Promise((r) => setTimeout(r, 1200));
  const storyEl = await page.$('#story');
  if (storyEl) {
    await storyEl.screenshot({ path: path.join(OUTPUT_DIR, '02-philosophy.png') });
  }

  // 3. Signature Dishes
  console.log('Capturing Signature Dishes...');
  await page.evaluate(() => {
    const dishes = document.querySelector('#story').nextElementSibling;
    dishes?.scrollIntoView({ behavior: 'instant' });
  });
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({
    path: path.join(OUTPUT_DIR, '03-signature-dishes.png'),
    clip: { x: 0, y: 0, width: 1440, height: 900 }
  });

  // 4. Menu with Sommelier Drawer
  console.log('Capturing Menu...');
  await page.evaluate(() => {
    document.querySelector('#menu')?.scrollIntoView({ behavior: 'instant' });
  });
  await new Promise((r) => setTimeout(r, 1500));
  
  // Hover over the first menu item to reveal ingredients drawer
  const firstMenuItem = await page.$('#menu button, #menu [tabindex="0"]');
  if (firstMenuItem) {
    await firstMenuItem.hover();
    await new Promise((r) => setTimeout(r, 600));
  }
  await page.screenshot({
    path: path.join(OUTPUT_DIR, '04-menu.png'),
    clip: { x: 0, y: 0, width: 1440, height: 950 }
  });

  // 5. Chef Syifa Umairah Section
  console.log('Capturing Chef Syifa Umairah...');
  await page.evaluate(() => {
    document.querySelector('#chef')?.scrollIntoView({ behavior: 'instant' });
  });
  await new Promise((r) => setTimeout(r, 1500));
  const chefEl = await page.$('#chef');
  if (chefEl) {
    await chefEl.screenshot({ path: path.join(OUTPUT_DIR, '05-chef-syifa.png') });
  }

  // 6. Reservation & Footer
  console.log('Capturing Reservation...');
  await page.evaluate(() => {
    document.querySelector('#reservation')?.scrollIntoView({ behavior: 'instant' });
  });
  await new Promise((r) => setTimeout(r, 1200));
  const resEl = await page.$('#reservation');
  if (resEl) {
    await resEl.screenshot({ path: path.join(OUTPUT_DIR, '06-reservation.png') });
  }

  await browser.close();
  console.log('All screenshots captured successfully in docs/screenshots!');
}

capture().catch((err) => {
  console.error('Screenshot error:', err);
  process.exit(1);
});

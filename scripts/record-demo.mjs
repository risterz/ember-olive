import puppeteer from 'puppeteer-core';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const FFMPEG_PATH = 'C:\\ProgramData\\chocolatey\\bin\\ffmpeg.exe';
const OUTPUT_FILE = path.resolve('docs/ember-olive-demo.mp4');

const outputDir = path.dirname(OUTPUT_FILE);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function record() {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    defaultViewport: { width: 1440, height: 900, deviceScaleFactor: 1 },
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-gpu',
      '--window-size=1440,900'
    ]
  });

  const page = await browser.newPage();
  
  // Start ffmpeg process
  console.log('Spawning ffmpeg...');
  const ffmpeg = spawn(FFMPEG_PATH, [
    '-y',
    '-f', 'image2pipe',
    '-vcodec', 'mjpeg',
    '-r', '30',
    '-i', '-',
    '-c:v', 'libx264',
    '-pix_fmt', 'yuv420p',
    '-preset', 'fast',
    '-crf', '23',
    OUTPUT_FILE
  ]);

  ffmpeg.stderr.on('data', (data) => {
    // console.log(`ffmpeg: ${data}`);
  });

  ffmpeg.on('close', (code) => {
    console.log(`ffmpeg process closed with code ${code}`);
  });

  const client = await page.target().createCDPSession();

  let frameCount = 0;
  client.on('Page.screencastFrame', async ({ data, sessionId }) => {
    try {
      const buffer = Buffer.from(data, 'base64');
      if (ffmpeg.stdin.writable) {
        ffmpeg.stdin.write(buffer);
        frameCount++;
      }
      await client.send('Page.screencastFrameAck', { sessionId });
    } catch (e) {
      // ignore
    }
  });

  await client.send('Page.startScreencast', {
    format: 'jpeg',
    quality: 85,
    maxWidth: 1440,
    maxHeight: 900,
    everyNthFrame: 1
  });

  console.log('Navigating to website...');
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });

  // Let loading screen run
  console.log('Waiting for loading screen...');
  await new Promise((r) => setTimeout(r, 3200));

  // Linger on hero
  console.log('Showing hero...');
  await new Promise((r) => setTimeout(r, 2000));

  // Smooth scroll helper
  console.log('Beginning smooth scroll tour...');
  const totalHeight = await page.evaluate(() => document.body.scrollHeight);
  console.log(`Total page height: ${totalHeight}px`);

  // We will scroll section by section with smooth pauses
  const sections = ['#story', '#menu', '#chef', '#gallery', '#experience', '#reservation'];

  for (const selector of sections) {
    console.log(`Scrolling to ${selector}...`);
    await page.evaluate((sel) => {
      const el = document.querySelector(sel);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, selector);

    // Pause on section to let animations play and viewer appreciate content
    await new Promise((r) => setTimeout(r, 3000));

    // Special interaction if menu: hover over dish item to reveal drawer
    if (selector === '#menu') {
      console.log('Hovering over menu dish to reveal drawer...');
      const menuItem = await page.$('#menu button, #menu [tabindex="0"]');
      if (menuItem) {
        await menuItem.hover();
        await new Promise((r) => setTimeout(r, 2000));
      }
    }

    // Special interaction if chef: tilt mouse slightly
    if (selector === '#chef') {
      console.log('Interacting with chef portrait...');
      await page.mouse.move(500, 450);
      await new Promise((r) => setTimeout(r, 500));
      await page.mouse.move(550, 400);
      await new Promise((r) => setTimeout(r, 1000));
    }
  }

  // Scroll smoothly down to the footer
  console.log('Scrolling to footer...');
  await page.evaluate(() => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  });
  await new Promise((r) => setTimeout(r, 2500));

  console.log(`Finished tour! Total frames captured: ${frameCount}`);
  await client.send('Page.stopScreencast');
  await browser.close();

  ffmpeg.stdin.end();

  // Wait for ffmpeg to finish encoding
  await new Promise((resolve) => ffmpeg.on('close', resolve));
  console.log(`Video recorded successfully to ${OUTPUT_FILE}`);
}

record().catch((err) => {
  console.error('Recording error:', err);
  process.exit(1);
});

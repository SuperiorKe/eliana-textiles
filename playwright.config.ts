import { defineConfig, devices } from '@playwright/test';
import { existsSync } from 'fs';
import { execSync } from 'child_process';

// Detect whether the WebKit binary is available so Mobile Safari tests are
// skipped gracefully in environments that only ship Chromium (e.g. CI images).
function webkitAvailable(): boolean {
  try {
    const path = execSync('node -e "const {webkit}=require(\'playwright-core\');console.log(webkit.executablePath())"', {
      encoding: 'utf8',
      env: { ...process.env, PLAYWRIGHT_BROWSERS_PATH: process.env.PLAYWRIGHT_BROWSERS_PATH ?? '' },
    }).trim();
    return existsSync(path);
  } catch {
    return false;
  }
}

const projects = [
  { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  { name: 'Mobile Chrome', use: { ...devices['Pixel 5'] } },
  // Mobile Safari requires the WebKit binary; omit it when unavailable so the
  // suite stays green in Chromium-only environments.
  ...(webkitAvailable()
    ? [{ name: 'Mobile Safari', use: { ...devices['iPhone 12'] } }]
    : []),
];

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects,
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});

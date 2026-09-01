const { By, until } = $selenium;

const TIMEOUT_MS = 20000;

async function runResilientWorkflow() {
  // 1. Configure viewport dimensions
  console.log('Step 1: Setting window size...');
  await $webDriver.manage().window().setSize(1366, 768);

  // 2. Open Homepage
  console.log('Step 2: Accessing Coupang homepage...');
  await $webDriver.get('https://www.coupang.com');

  // 3. Inject stealth override to hide headless automation signature
  try {
    await $webDriver.executeScript(() => {
      Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
    });
  } catch (err) {
    console.log('Stealth script injection skipped:', err.message);
  }

  await $webDriver.sleep(2000); // Allow initial scripts and cookies to settle

  // 4. Navigate via Navigation Menu (Bypasses /np/search Akamai WAF triggers)
  console.log('Step 3: Navigating to Rocket Delivery category page...');
  const navLink = await $webDriver.wait(
    until.elementLocated(By.css('a[href*="rocketdelivery"], ul.header-menu a, a.rocket-delivery')),
    TIMEOUT_MS,
    'Navigation link not found on homepage'
  );

  await navLink.click();
  await $webDriver.sleep(2000);

  // 5. Verify product listing grid loads
  console.log('Step 4: Verifying page content rendering...');
  await $webDriver.wait(
    until.elementLocated(By.css('ul#productList, .product-list, #contents, .unit-item')),
    TIMEOUT_MS,
    'Category page content failed to render'
  );

  console.log('Synthetic user workflow completed successfully.');
}

runResilientWorkflow();

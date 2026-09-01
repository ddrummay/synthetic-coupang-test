const { By, until, Key } = $selenium;

const SEARCH_TERM = '노트북'; // Example search query
const TIMEOUT_MS = 20000;

async function runBrowserWorkflow() {
  // Step 1: Set resolution and load homepage
  console.log('Step 1: Setting window resolution and opening Coupang...');
  await $webDriver.manage().window().setSize(1366, 768);
  await $webDriver.get('https://www.coupang.com');

  // Step 2: Interact with search input and submit query
  console.log(`Step 2: Searching for "${SEARCH_TERM}"...`);
  const searchInput = await $webDriver.wait(
    until.elementLocated(By.css('input[name="q"], #headerSearchKeyword')),
    TIMEOUT_MS,
    'Search input field not found'
  );
  await searchInput.click();
  await searchInput.clear();
  await searchInput.sendKeys(SEARCH_TERM, Key.RETURN);

  // Step 3: Wait for product results and select the first item
  console.log('Step 3: Waiting for search results and selecting first item...');
  const firstProduct = await $webDriver.wait(
    until.elementLocated(By.css('ul#productList > li.search-product a, a.search-product-link')),
    TIMEOUT_MS,
    'Search results grid failed to load'
  );
  await firstProduct.click();

  // Step 4: Handle tab switch if item opens in a new window
  const windowHandles = await $webDriver.getAllWindowHandles();
  if (windowHandles.length > 1) {
    await $webDriver.switchTo().window(windowHandles[windowHandles.length - 1]);
  }

  // Step 5: Verify product detail page components
  console.log('Step 5: Verifying product detail elements...');
  await $webDriver.wait(
    until.elementLocated(By.css('.prod-buy-header__title, .prod-title, .prod-buy-btn')),
    TIMEOUT_MS,
    'Product detail page failed to render'
  );

  console.log('User browser workflow completed successfully.');
}

runBrowserWorkflow();

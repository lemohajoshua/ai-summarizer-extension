function getPageContent() {
  const selectors = ['article', 'main', '[role="main"]', '.post-content', '.entry-content', '#content'];
  let contentElement = null;
  for (const sel of selectors) {
    const el = document.querySelector(sel);
    if (el && el.innerText.trim().length > 200) {
      contentElement = el;
      break;
    }
  }
  if (!contentElement) {
    const clone = document.body.cloneNode(true);
    const unwanted = clone.querySelectorAll('nav, header, footer, aside, .sidebar, .ad, .comment');
    unwanted.forEach(el => el.remove());
    contentElement = clone;
  }
  return contentElement.innerText.trim();
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'extractContent') {
    const content = getPageContent();
    sendResponse({ content });
  }
  return true;
});
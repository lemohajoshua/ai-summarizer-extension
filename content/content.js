// Simple content extraction (fallback)
function getPageContent() {
  // Try to find main content
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
    // Fallback to body but exclude nav, footer, header
    const clone = document.body.cloneNode(true);
    const unwanted = clone.querySelectorAll('nav, header, footer, aside, .sidebar, .ad, .comment');
    unwanted.forEach(el => el.remove());
    contentElement = clone;
  }
  return contentElement.innerText.trim();
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'extractContent') {
    const content = getPageContent();
    sendResponse({ content });
  }
  return true; // keep channel open for async response
});
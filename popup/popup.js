let currentTabUrl = '';

document.addEventListener('DOMContentLoaded', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  currentTabUrl = tab.url;
  document.getElementById('pageTitle').innerText = tab.title || 'Untitled Page';

  document.getElementById('summarizeBtn').addEventListener('click', async () => {
    const summaryDiv = document.getElementById('summaryArea');
    const loadingDiv = document.getElementById('loading');
    loadingDiv.classList.remove('hidden');
    summaryDiv.innerText = '';

    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      const response = await chrome.tabs.sendMessage(tab.id, { action: 'extractContent' });
      if (!response || !response.content) throw new Error('Could not extract page content');

      const summary = await new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({
          action: 'summarize',
          content: response.content,
          url: tab.url
        }, (res) => {
          if (chrome.runtime.lastError) reject(chrome.runtime.lastError);
          else if (res.error) reject(new Error(res.error));
          else resolve(res.summary);
        });
      });

      summaryDiv.innerText = summary;
    } catch (err) {
      summaryDiv.innerText = `Error: ${err.message}`;
    } finally {
      loadingDiv.classList.add('hidden');
    }
  });

  document.getElementById('clearBtn').addEventListener('click', () => {
    document.getElementById('summaryArea').innerText = '';
  });
});
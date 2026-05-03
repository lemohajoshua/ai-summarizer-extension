// You must not hardcode API keys here. Instead, ask user to enter their key in options page, or use a proxy.
// This example uses OpenAI, but you must tell the user to set their own key via an options page.

let API_KEY = ''; // will be loaded from storage

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get(['openai_api_key'], (result) => {
    if (result.openai_api_key) API_KEY = result.openai_api_key;
  });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'summarize') {
    handleSummarize(request.content, request.url)
      .then(summary => sendResponse({ summary }))
      .catch(error => sendResponse({ error: error.message }));
    return true;
  }
});

async function handleSummarize(content, url) {
  // Optional: check cache in chrome.storage.local
  const cacheKey = `summary_${url}`;
  const cached = await chrome.storage.local.get(cacheKey);
  if (cached[cacheKey]) {
    return cached[cacheKey];
  }

  if (!API_KEY) {
    // Fallback: ask user to set key via options page
    throw new Error('OpenAI API key not set. Please set it in extension options.');
  }

  const prompt = `Summarize the following webpage content into bullet points. Include key insights and estimated reading time (based on word count). Format: 
- Bullet points
- Key insights: ...
- Estimated reading time: X min

Content: ${content.substring(0, 8000)}`; // limit tokens

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.5,
      max_tokens: 500
    })
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error?.message || 'API request failed');
  }

  const data = await response.json();
  const summary = data.choices[0].message.content;

  // Cache summary
  await chrome.storage.local.set({ [cacheKey]: summary });
  return summary;
}
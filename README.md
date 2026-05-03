# AI Page Summarizer – Chrome Extension

## Setup Instructions
1. Download or clone this repository.
2. Open Chrome and go to `chrome://extensions/`.
3. Enable **Developer mode** (top right).
4. Click **Load unpacked** and select the extension folder.
5. The extension icon appears in the toolbar.

## How to Use
1. Click the extension icon on any webpage.
2. Click **Summarize Page**.
3. Wait a few seconds – the summary appears.

## Getting an OpenAI API Key
1. Go to [OpenAI Platform](https://platform.openai.com/api-keys).
2. Create a new API key.
3. Right‑click the extension icon → **Options** → paste your key → Save.

## Architecture
- **Manifest V3** – latest Chrome extension standard.
- **Popup** – user interface.
- **Content script** – extracts page content.
- **Background service worker** – calls OpenAI API, caches results.

## Security Decisions
- No API keys in source code – users supply their own.
- Keys stored securely via `chrome.storage.sync`.
- Minimal permissions: `activeTab`, `tabs`, `storage`, `scripting`.

## Trade‑offs
- Content extraction is heuristic‑based; may fail on complex pages.
- Caches summaries per URL to save API calls.
- No external proxy server – direct calls to OpenAI.

## Demo Video
[Link to your 2‑5 minute demo video]
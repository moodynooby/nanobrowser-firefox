<h1 align="center">
    <img src="https://github.com/user-attachments/assets/ec60b0c4-87ba-48f4-981a-c55ed0e8497b" height="100" width="375" alt="banner" /><br>
</h1>

<div align="center">

[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/nanobrowser)
[![Discord](https://img.shields.io/badge/Discord-5865F2?style=for-the-badge&logo=discord&logoColor=white)](https://discord.gg/NN3ABHggMK)
[![Twitter](https://img.shields.io/badge/Twitter-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/nanobrowser_ai)

</div>

## Nanobrowser

Nanobrowser is an open-source AI web automation tool that runs in your browser. Supports multiple LLM providers (OpenAI, Anthropic, Gemini, Ollama, Groq, Cerebras, Llama, and custom OpenAI-compatible).

## Key Features

- Multi-agent system for complex web workflows
- Interactive side panel with real-time status updates
- Follow-up questions about completed tasks
- Conversation history and bookmarks
- Multiple LLM providers with per-agent model selection

## Quick Start

1. Install from [Chrome Web Store](https://chromewebstore.google.com/detail/nanobrowser/imbddededgmcgfhfpcjmijokokekbkal) or [build from source](#build-from-source)
2. Open the side panel and go to Settings
3. Add your LLM API keys and select models for Navigator and Planner agents

## Build from Source

**Prerequisites:** Node.js v22.12.0+, pnpm v9.15.1+

```bash
git clone https://github.com/nanobrowser/nanobrowser.git
cd nanobrowser
pnpm install
pnpm build
```

Load the `dist/` directory as an unpacked extension in Chrome (`chrome://extensions/`, Developer mode).

## Browser Support

- **Chrome** - Full support
- **Edge** - Full support
- **Firefox** - Full support (WebDriver BiDi protocol)

## License

Apache License 2.0 - see [LICENSE](LICENSE).

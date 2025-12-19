# MCP Server Clone (Context7 Implementation)

This project is a study implementation of an MCP (Model Context Protocol) server, built as part of the homework for the **[AI-Dev-Tools-Zoomcamp](https://github.com/DataTalksClub/ai-dev-tools-zoomcamp/tree/main)**.

The goal of this project is to build a documentation search and web content retrieval server using `FastMCP` and `minsearch`.

## Features

- **Web Content Retrieval**: Uses **Jina Reader** (`r.jina.ai`) to convert any URL into LLM-friendly Markdown.
- **Documentation Search**: Indexed FastMCP documentation files (`.md`, `.mdx`) using `minsearch` for high-performance retrieval.
- **FastMCP Framework**: Built with the modern, Pythonic FastMCP SDK.

## Project Structure

- `main.py`: The primary MCP server entry point containing the tools.
- `minsearch.py`: A lightweight, local search engine implementation.
- `main.zip`: Pre-downloaded documentation source for indexing.
- `search.py`: Command-line interface for testing the indexing and search logic.
- `test.py` / `test_search_tool.py`: Utility scripts for unit testing the tool functions.

## Getting Started

### Prerequisites

- [uv](https://docs.astral.sh/uv/) for dependency management.

### Installation

```bash
# Register dependencies and setup environment
uv sync
```

### Running the Server

You can run the server locally using `uv`:

```bash
uv run main.py
```

### Testing the Search Tool

To test the search indexing and retrieval directly from the CLI:

```bash
uv run search.py "your query"
```

## MCP Integration

To use this server with an AI assistant (like Cursor, Claude Desktop, or Antigravity), add the following to your configuration:

```json
{
  "mcpServers": {
    "clone-context7": {
      "command": "uv",
      "args": [
        "run",
        "--project",
        "/absolute/path/to/homework-3",
        "main.py"
      ]
    }
  }
}
```

## Available Tools

- `fetch_web_content(url)`: Fetches a webpage and returns it as Markdown.
- `search_documentation(query)`: Searches the local FastMCP documentation index (top 5 results).
- `add(a, b)`: Simple utility for testing tool connectivity.

---
*Regards to the MCP community for providing such a powerful standard for AI-tool interaction!*

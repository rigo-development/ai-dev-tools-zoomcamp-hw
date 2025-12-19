import requests
import zipfile
import os
import minsearch
from fastmcp import FastMCP

mcp = FastMCP("Demo 🚀")

# Initialization logic for the documentation index
def load_index():
    zip_path = os.path.join(os.path.dirname(__file__), 'main.zip')
    
    # Automatically download if missing
    if not os.path.exists(zip_path):
        print("main.zip not found. Downloading documentation...")
        url = "https://github.com/jlowin/fastmcp/archive/refs/heads/main.zip"
        try:
            response = requests.get(url, timeout=30)
            response.raise_for_status()
            with open(zip_path, 'wb') as f:
                f.write(response.content)
            print("Successfully downloaded main.zip")
        except Exception as e:
            print(f"Error downloading documentation: {e}")
            return None
        
    docs = []
    with zipfile.ZipFile(zip_path, 'r') as z:
        for info in z.infolist():
            filename = info.filename
            if info.is_dir():
                continue
            
            parts = filename.split('/', 1)
            processed_filename = parts[1] if len(parts) > 1 else filename
            
            if processed_filename.endswith('.md') or processed_filename.endswith('.mdx'):
                with z.open(filename) as f:
                    content = f.read().decode('utf-8', errors='ignore')
                    docs.append({
                        'content': content,
                        'filename': processed_filename
                    })
    
    index = minsearch.Index(
        text_fields=['content'],
        keyword_fields=['filename']
    )
    index.fit(docs)
    return index

# Global index instance
_doc_index = load_index()

@mcp.tool
def add(a: int, b: int) -> int:
    """Add two numbers"""
    return a + b

def _fetch_web_content(url: str) -> str:
    """Internal function to fetch content of a web page as markdown using Jina Reader"""
    jina_url = f"https://r.jina.ai/{url}"
    response = requests.get(jina_url)
    response.raise_for_status()
    return response.text

@mcp.tool
def fetch_web_content(url: str) -> str:
    """Fetch content of a web page as markdown using Jina Reader"""
    return _fetch_web_content(url)

def _search_documentation(query: str) -> str:
    """Internal function to search the FastMCP documentation"""
    if _doc_index is None:
        return "Error: Documentation index not available. Ensure main.zip exists."
    
    results = _doc_index.search(query, num_results=5)
    
    if not results:
        return f"No results found for query: '{query}'"
    
    output = [f"Search results for: '{query}'"]
    for i, res in enumerate(results):
        output.append(f"{i+1}. {res['filename']}")
        snippet = res['content'][:200].replace('\n', ' ')
        output.append(f"   Excerpt: {snippet}...")
        
    return "\n".join(output)

@mcp.tool
def search_documentation(query: str) -> str:
    """Search the FastMCP documentation for a specific query and return the top 5 results"""
    return _search_documentation(query)

if __name__ == "__main__":
    mcp.run()
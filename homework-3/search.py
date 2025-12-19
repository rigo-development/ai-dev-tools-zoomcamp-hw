import zipfile
import minsearch
import os
import requests

def load_and_index():
    zip_path = 'main.zip'
    
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
            sys.exit(1)

    docs = []
    with zipfile.ZipFile(zip_path, 'r') as z:
        for info in z.infolist():
            filename = info.filename
            
            # Skip directories
            if info.is_dir():
                continue
                
            # Remove first part of the path
            parts = filename.split('/', 1)
            processed_filename = parts[1] if len(parts) > 1 else filename
                
            # Only read .md and .mdx files
            if processed_filename.endswith('.md') or processed_filename.endswith('.mdx'):
                with z.open(filename) as f:
                    content = f.read().decode('utf-8', errors='ignore')
                    docs.append({
                        'content': content,
                        'filename': processed_filename
                    })
    
    # Initialize and fit minsearch index
    index = minsearch.Index(
        text_fields=['content'],
        keyword_fields=['filename']
    )
    index.fit(docs)
    return index

def search(index, query):
    return index.search(query, num_results=5)

import sys

if __name__ == "__main__":
    query = " ".join(sys.argv[1:]) if len(sys.argv) > 1 else "How to use FastMCP?"
    
    print("Indexing documents...")
    index = load_and_index()
    print(f"Indexed {len(index.docs)} documents.")
    
    # Test search
    results = search(index, query)
    
    print(f"\nSearch results for: '{query}'")
    for i, res in enumerate(results):
        print(f"{i+1}. {res['filename']}")

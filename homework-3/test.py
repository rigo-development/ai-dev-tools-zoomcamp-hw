from main import _fetch_web_content

url = "https://github.com/alexeygrigorev/minsearch"
try:
    content = _fetch_web_content(url)
    print(f"Content length: {len(content)}")
except Exception as e:
    print(f"Error: {e}")

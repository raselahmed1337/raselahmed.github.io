import requests
import json

AUTHOR_NAME = "Rasel Ahmed"
# Filter to ensure we only get papers by THIS Rasel Ahmed
KNOWN_COAUTHORS = ["Fahad", "Miah", "Hossen", "Tan", "Ali", "Gan", "Yip"]

def fetch_papers():
    # Search Semantic Scholar API
    url = f"https://api.semanticscholar.org/graph/v1/paper/search?query={AUTHOR_NAME.replace(' ', '+')}&fields=title,year,venue,authors,citationCount,externalIds&limit=100"
    headers = {'User-Agent': 'RaselAhmedPortfolio/1.0 (mailto:raselahmed1337@gmail.com)'}
    
    response = requests.get(url, headers=headers)
    if response.status_code != 200:
        print(f"Error fetching data: {response.status_code}")
        return []
    
    data = response.json()
    papers = []
    
    for paper in data.get('data', []):
        authors = [author['name'] for author in paper.get('authors', [])]
        author_names_str = " ".join(authors).lower()
        
        # Check if Rasel Ahmed is an author AND a known co-author is present
        is_rasel = any("rasel ahmed" in a.lower() for a in authors)
        has_known_coauthor = any(coauthor.lower() in author_names_str for coauthor in KNOWN_COAUTHORS)
        
        if is_rasel and has_known_coauthor:
            papers.append({
                "title": paper.get('title'),
                "year": paper.get('year'),
                "venue": paper.get('venue'),
                "authors": authors,
                "citations": paper.get('citationCount', 0),
                "doi": paper.get('externalIds', {}).get('DOI', '')
            })
            
    return papers

if __name__ == "__main__":
    papers = fetch_papers()
    # Save to publications.json
    with open('publications.json', 'w', encoding='utf-8') as f:
        json.dump(papers, f, indent=2, ensure_ascii=False)
    print(f"✅ Successfully updated {len(papers)} papers.")
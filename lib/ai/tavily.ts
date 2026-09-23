export interface TavilySearchResult {
  title: string;
  url: string;
  content: string;
  score: number;
}

export async function searchTavily(query: string, maxResults: number = 3): Promise<TavilySearchResult[]> {
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) {
    throw new Error("TAVILY_API_KEY is not configured");
  }

  const response = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}` // Some versions might use "api_key" in body
    },
    body: JSON.stringify({
      api_key: apiKey,
      query: query,
      search_depth: "basic",
      include_answer: false,
      max_results: maxResults,
    })
  });

  if (!response.ok) {
    throw new Error(`Tavily API returned ${response.status}: ${await response.text()}`);
  }

  const data = await response.json();
  return data.results || [];
}

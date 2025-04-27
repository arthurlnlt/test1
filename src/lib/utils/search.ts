export function searchPosts(query: string, items: any[]) {
  if (!query.trim()) return items;

  const searchTerm = query.toLowerCase().trim();
  
  return items.filter(item => {
    const titleMatch = item.title?.toLowerCase().includes(searchTerm);
    const contentMatch = item.content?.toLowerCase().includes(searchTerm);
    const authorMatch = item.author?.toLowerCase().includes(searchTerm);
    const topicMatch = item.topic?.description?.toLowerCase().includes(searchTerm);
    
    return titleMatch || contentMatch || authorMatch || topicMatch;
  });
}
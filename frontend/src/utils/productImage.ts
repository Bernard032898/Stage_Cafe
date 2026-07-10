const coffeeImages = [
  "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1521302080608-7f0c51d20b8e?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1523473827532-4d7d67b7f1f7?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1487029418506-8456bcad5e9a?auto=format&fit=crop&w=1200&q=80",
];

export function getProductImageUrl(name: string) {
  const title = (name || "coffee drink").trim();
  if (!title) {
    return coffeeImages[0];
  }

  const hash = Array.from(title).reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return coffeeImages[hash % coffeeImages.length];
}

export function getFallbackProductImageUrl() {
  return "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80";
}

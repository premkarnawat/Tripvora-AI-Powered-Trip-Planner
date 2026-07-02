interface PageImagesResponse {
  query?: {
    pages?: Record<string, {
      thumbnail?: {
        source: string;
      };
    }>;
  };
}

async function fetchPageImage(title: string): Promise<string | null> {
  const url =
    `https://en.wikipedia.org/w/api.php` +
    `?action=query` +
    `&titles=${encodeURIComponent(title)}` +
    `&prop=pageimages&format=json&pithumbsize=800`;

  const res = await fetch(url, {
    signal: AbortSignal.timeout(2000),
  });

  if (!res.ok) return null;

  const data: PageImagesResponse = await res.json();
  const pages = data.query?.pages;
  if (!pages) return null;

  for (const pageId of Object.keys(pages)) {
    const thumb = pages[pageId]?.thumbnail?.source;
    if (thumb) return thumb;
  }

  return null;
}

export async function getPlaceImage(
  placeName: string,
  destination: string,
): Promise<string | null> {
  try {
    const primary = await fetchPageImage(placeName);
    if (primary) return primary;

    if (placeName !== destination) {
      const fallback = await fetchPageImage(destination);
      if (fallback) return fallback;
    }

    return null;
  } catch {
    return null;
  }
}

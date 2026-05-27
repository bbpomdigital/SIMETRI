'use server';

interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  image: string;
  description: string;
  source: 'website' | 'facebook';
}

function cleanText(text: string): string {
  if (!text) return '';
  // Remove CDATA tags if present
  let cleaned = text.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1');
  // Decode basic HTML entities
  cleaned = cleaned
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#39;/g, "'");
  // Strip remaining HTML tags
  cleaned = cleaned.replace(/<\/?[^>]+(>|$)/g, '');
  return cleaned.trim();
}

function extractImage(itemXml: string): string {
  let url = '';
  // 1. Try enclosure tag
  const enclosureMatch = itemXml.match(/<enclosure[^>]+url=["']([^"']+)["']/i);
  if (enclosureMatch && enclosureMatch[1]) {
    url = enclosureMatch[1];
  } else {
    // 2. Try media:content or media:thumbnail tag
    const mediaMatch = itemXml.match(/<(?:media:content|media:thumbnail)[^>]+url=["']([^"']+)["']/i);
    if (mediaMatch && mediaMatch[1]) {
      url = mediaMatch[1];
    } else {
      // 3. Try parsing image from description
      const descMatch = itemXml.match(/<description>([\s\S]*?)<\/description>/i);
      if (descMatch && descMatch[1]) {
        const descContent = descMatch[1];
        const imgMatch = descContent.match(/<img[^>]+src=["']([^"']+)["']/i);
        if (imgMatch && imgMatch[1]) {
          url = imgMatch[1];
        }
      }
    }
  }

  if (url) {
    // Facebook CDN URLs have strictly signed query parameters, XML encoded &amp; must be decoded to &
    return url.replace(/&amp;/g, '&')
              .replace(/&lt;/g, '<')
              .replace(/&gt;/g, '>')
              .replace(/&quot;/g, '"')
              .replace(/&apos;/g, "'");
  }

  // Fallback: Return a premium default BBPOM image or empty
  return '';
}

function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  } catch (e) {
    return dateStr;
  }
}

export async function fetchRssFeed(url: string, source: 'website' | 'facebook'): Promise<NewsItem[]> {
  try {
    const fetchUrl = `${url}?_t=${Date.now()}`;
    const response = await fetch(fetchUrl, {
      cache: 'no-store',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/xml, text/xml, */*'
      }
    });

    if (!response.ok) {
      throw new Error(`Gagal mengambil RSS feed: ${response.statusText}`);
    }

    const xmlText = await response.text();
    
    // Extract item blocks using regex
    const itemMatches = xmlText.match(/<item>([\s\S]*?)<\/item>/gi) || [];
    
    const items: NewsItem[] = itemMatches.map(itemXml => {
      const titleMatch = itemXml.match(/<title>([\s\S]*?)<\/title>/i);
      const linkMatch = itemXml.match(/<link>([\s\S]*?)<\/link>/i);
      const descMatch = itemXml.match(/<description>([\s\S]*?)<\/description>/i);
      const pubDateMatch = itemXml.match(/<pubDate>([\s\S]*?)<\/pubDate>/i);

      const title = titleMatch ? cleanText(titleMatch[1]) : 'Berita Tanpa Judul';
      const link = linkMatch ? cleanText(linkMatch[1]) : '#';
      const description = descMatch ? cleanText(descMatch[1]) : '';
      const pubDate = pubDateMatch ? formatDate(pubDateMatch[1]) : '';
      const image = extractImage(itemXml);

      return {
        title,
        link,
        pubDate,
        image,
        description,
        source
      };
    });

    return items;
  } catch (error) {
    console.error(`Error parsing RSS feed (${source}):`, error);
    return [];
  }
}

export async function getNewsFeedData() {
  const facebookUrl = 'https://fetchrss.com/feed/1wMFYaAVvBBj1wMFY66S47db.rss';
  const websiteUrl = 'https://fetchrss.com/feed/1wMFYaAVvBBj1wMFt54d85Yo.rss';

  const [facebookItems, websiteItems] = await Promise.all([
    fetchRssFeed(facebookUrl, 'facebook'),
    fetchRssFeed(websiteUrl, 'website')
  ]);

  return {
    facebook: facebookItems,
    website: websiteItems
  };
}

export async function getWebsiteNews(): Promise<NewsItem[]> {
  const websiteUrl = 'https://fetchrss.com/feed/1wMFYaAVvBBj1wMFt54d85Yo.rss';
  return fetchRssFeed(websiteUrl, 'website');
}

export async function getFacebookNews(): Promise<NewsItem[]> {
  const facebookUrl = 'https://fetchrss.com/feed/1wMFYaAVvBBj1wMFY66S47db.rss';
  return fetchRssFeed(facebookUrl, 'facebook');
}

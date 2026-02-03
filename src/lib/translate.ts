// LibreTranslate API Service
// Uses https://libretranslate.de/ for dynamic translation

const LIBRETRANSLATE_URL = 'https://libretranslate.de/translate';
const CACHE_KEY = 'translation_cache';

// Load cache from localStorage
const loadCache = (): Record<string, string> => {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    return cached ? JSON.parse(cached) : {};
  } catch {
    return {};
  }
};

// Save cache to localStorage
const saveCache = (cache: Record<string, string>) => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {
    // localStorage might be full or unavailable
  }
};

// Generate cache key
const getCacheKey = (text: string, source: string, target: string): string => {
  return `${source}_${target}_${text}`;
};

// Translate text using LibreTranslate API
export const translateText = async (
  text: string,
  source: 'es' | 'en',
  target: 'es' | 'en'
): Promise<string> => {
  // If source and target are the same, return original text
  if (source === target) {
    return text;
  }

  // Check cache first
  const cache = loadCache();
  const cacheKey = getCacheKey(text, source, target);
  
  if (cache[cacheKey]) {
    return cache[cacheKey];
  }

  try {
    const response = await fetch(LIBRETRANSLATE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: text,
        source: source,
        target: target,
        format: 'text',
      }),
    });

    if (!response.ok) {
      throw new Error(`Translation failed: ${response.status}`);
    }

    const data = await response.json();
    const translatedText = data.translatedText;

    // Save to cache
    cache[cacheKey] = translatedText;
    saveCache(cache);

    return translatedText;
  } catch (error) {
    console.error('Translation error:', error);
    // Return original text on error
    return text;
  }
};

// Batch translate multiple texts
export const translateBatch = async (
  texts: string[],
  source: 'es' | 'en',
  target: 'es' | 'en'
): Promise<string[]> => {
  const results = await Promise.all(
    texts.map(text => translateText(text, source, target))
  );
  return results;
};

// Clear translation cache
export const clearTranslationCache = () => {
  localStorage.removeItem(CACHE_KEY);
};

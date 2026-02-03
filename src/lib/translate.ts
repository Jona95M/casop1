// LibreTranslate API Service
// Uses https://libretranslate.de/ for dynamic translation

// LibreTranslate API Service with Mirrors and Fallback
const MIRRORS = [
  'https://translate.argosopentech.com/translate',
  'https://libretranslate.de/translate',
  'https://libretranslate.org/translate'
];

const CACHE_KEY = 'translation_cache_v2';

// Static fallback dictionary for core UI terms when API fails
const FALLBACK_TRANSLATIONS: Record<string, string> = {
  // Dashboard & Navigation
  'Dashboard': 'Dashboard',
  'Inicio': 'Home',
  'Eventos': 'Events',
  'Ubicaciones': 'Locations',
  'Contactos': 'Contacts',
  'Configuración': 'Settings',
  'Ayuda': 'Help',
  'Cerrar Sesión': 'Logout',

  // Dashboard Content
  'Bienvenido al Sistema de Gestión de Eventos': 'Welcome to the Event Management System',
  'Gestiona conferencias, talleres y seminarios': 'Manage conferences, workshops and seminars',
  'Próximos Eventos': 'Upcoming Events',
  'Ver todos': 'View all',
  'No hay eventos próximos': 'No upcoming events',
  'Crear Evento': 'Create Event',
  'Crear Nuevo Evento': 'Create New Event',

  // Stats
  'Total Eventos': 'Total Events',
  'Total Ubicaciones': 'Total Locations',
  'Total Contactos': 'Total Contacts',

  // Search & Common
  'Buscar...': 'Search...',
  'Buscar eventos...': 'Search events...',
  'Buscar contactos...': 'Search contacts...',
  'Buscar ubicaciones...': 'Search locations...',
  'Editar': 'Edit',
  'Eliminar': 'Delete',
  'Cancelar': 'Cancel',
  'Guardar': 'Save',
  'Cargando...': 'Loading...',

  // Forms & Dialogs
  'Nuevo Evento': 'New Event',
  'Nueva Ubicación': 'New Location',
  'Nuevo Contacto': 'New Contact',
  'Editar Evento': 'Edit Event',
  'Editar Ubicación': 'Edit Location',
  'Editar Contacto': 'Edit Contact',
  'Título': 'Title',
  'Descripción': 'Description',
  'Fecha y Hora': 'Date and Time',
  'Ubicación': 'Location',
};

const loadCache = (): Record<string, string> => {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    return cached ? JSON.parse(cached) : {};
  } catch {
    return {};
  }
};

const saveCache = (cache: Record<string, string>) => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {
    // localStorage might be full
  }
};

const getCacheKey = (text: string, source: string, target: string): string => {
  return `${source}_${target}_${text}`;
};

export const translateText = async (
  text: string,
  source: 'es' | 'en',
  target: 'es' | 'en'
): Promise<string> => {
  if (source === target) return text;

  // 1. Check Cache
  const cache = loadCache();
  const cacheKey = getCacheKey(text, source, target);

  if (cache[cacheKey]) {
    return cache[cacheKey];
  }

  // 2. Try API Mirrors
  for (const url of MIRRORS) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          q: text,
          source,
          target,
          format: 'text'
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const translatedText = data.translatedText;

        // Cache success
        cache[cacheKey] = translatedText;
        saveCache(cache);

        return translatedText;
      }
    } catch (e) {
      console.warn(`Mirror failed: ${url}`, e);
      continue; // Try next mirror
    }
  }

  // 3. Fallback to Static Dictionary (if target is EN)
  if (target === 'en' && FALLBACK_TRANSLATIONS[text]) {
    console.warn(`Using fallback translation for: ${text}`);
    return FALLBACK_TRANSLATIONS[text];
  }

  // 4. Give up (return original)
  return text;
};

export const translateBatch = async (
  texts: string[],
  source: 'es' | 'en',
  target: 'es' | 'en'
): Promise<string[]> => {
  // Process sequentially to not hammer the API
  const results = [];
  for (const text of texts) {
    results.push(await translateText(text, source, target));
  }
  return results;
};

export const clearTranslationCache = () => {
  localStorage.removeItem(CACHE_KEY);
};

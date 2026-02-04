// LibreTranslate API Service
// Uses https://libretranslate.de/ for dynamic translation

// LibreTranslate API Service with Mirrors and Fallback
const MIRRORS = [
  'https://translate.argosopentech.com/translate',
  'https://libretranslate.de/translate',
  'https://libretranslate.org/translate'
];

const CACHE_KEY = 'translation_cache_v3';

// Static fallback dictionary for core UI terms when API fails
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

  // Sidebar Logo
  'CASOPRACTICO1': 'PRACTICAL CASE 1',
  'Gestión de Eventos': 'Event Management',

  // Page Subtitles (Layout.tsx)
  'Administra los lugares de tus eventos': 'Manage your event locations',
  'Directorio de contactos e invitados': 'Directory of contacts and guests',
  'Personaliza tu experiencia': 'Customize your experience',
  'Centro de soporte y documentación': 'Support and documentation center',

  // Help Center
  'Centro de Ayuda': 'Help Center',
  'Aprende a usar el sistema con nuestros recursos': 'Learn how to use the system with our resources',
  'Video Tutorial': 'Tutorial Video',
  'Tutorial del Sistema de Gestión de Eventos': 'Event Management System Tutorial',
  'Este video te guiará a través de las principales funcionalidades del sistema de gestión de eventos.': 'This video will guide you through the main functionalities of the event management system.',
  'Guía Rápida': 'Quick Start Guide',
  'Crear Ubicaciones': 'Create Locations',
  'Define los lugares donde se realizarán tus eventos.': 'Define the places where your events will be held.',
  'Agregar Contactos': 'Add Contacts',
  'Registra a los participantes e invitados de tus eventos.': 'Register participants and guests for your events.',
  'Programar Eventos': 'Schedule Events',
  'Crea conferencias, talleres y seminarios.': 'Create conferences, workshops, and seminars.',
  'Preguntas Frecuentes': 'Frequently Asked Questions',
  '¿Cómo crear un nuevo evento?': 'How to create a new event?',
  'Para crear un nuevo evento, ve a la sección "Eventos" en el menú lateral y haz clic en el botón "Nuevo Evento". Completa el formulario con el título, fecha, ubicación y otros detalles del evento.': 'To create a new event, go to the "Events" section in the side menu and click the "New Event" button. Complete the form with the title, date, location, and other event details.',
  '¿Cómo cambiar el idioma de la aplicación?': 'How to change the application language?',
  'Puedes cambiar el idioma utilizando el selector de idioma ubicado en la esquina superior derecha del encabezado. Haz clic en la bandera para alternar entre Español e Inglés.': 'You can change the language using the language selector located in the top right corner of the header. Click on the flag to toggle between Spanish and English.',
  '¿Cómo añadir una nueva ubicación?': 'How to add a new location?',
  'Ve a la sección "Ubicaciones" en el menú lateral y haz clic en "Nueva Ubicación". Ingresa el nombre, dirección y capacidad del lugar.': 'Go to the "Locations" section in the side menu and click "New Location". Enter the name, address, and capacity of the place.',
  '¿Puedo editar un evento existente?': 'Can I edit an existing event?',
  'Sí, haz clic en el icono de editar (lápiz) junto al evento que deseas modificar. Realiza los cambios necesarios y guarda.': 'Yes, click the edit icon (pencil) next to the event you want to modify. Make the necessary changes and save.',
  '¿Cómo eliminar un evento?': 'How to delete an event?',
  'Haz clic en el icono de papelera junto al evento. Aparecerá un diálogo de confirmación. Haz clic en "Eliminar" para confirmar la acción.': 'Click the trash icon next to the event. A confirmation dialog will appear. Click "Delete" to confirm the action.',
  '¿Necesitas más ayuda?': 'Need more help?',
  'Contacta al equipo de soporte de la Universidad Técnica Equinoccial': 'Contact the Universidad Técnica Equinoccial support team',
  'Contactar Soporte': 'Contact Support',
  'Enviar correo a soporte': 'Send email to support',

  // Dashboard Content
  'Bienvenido al Sistema de Gestión de Eventos': 'Welcome to the Event Management System',
  'Sistema de Gestión de Eventos': 'Event Management System',
  'Gestiona conferencias, talleres y seminarios': 'Manage conferences, workshops and seminars',
  'Universidad Técnica Equinoccial - Gestiona conferencias, talleres y seminarios.': 'Universidad Técnica Equinoccial - Manage conferences, workshops and seminars.',
  'Próximos Eventos': 'Upcoming Events',
  'Ver todos': 'View all',
  'No hay eventos próximos': 'No upcoming events',
  'Actividad Reciente': 'Recent Activity',
  'No hay actividad reciente': 'No recent activity',
  'Crear Evento': 'Create Event',
  'Crear Nuevo Evento': 'Create New Event',

  // Stats
  'Total Eventos': 'Total Events',
  'Total Ubicaciones': 'Total Locations',
  'Total Contactos': 'Total Contacts',
  'Esta semana': 'This week',
  'Estadísticas': 'Statistics',

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
  'Ver en Maps': 'View in Maps',
  'Enviar correo a': 'Send email to',
  'Llamar a': 'Call',
  'Cerrar': 'Close',

  // Lists & Empty States
  'No hay eventos': 'No events',
  'No hay ubicaciones': 'No locations',
  'No hay contactos': 'No contacts',
  'Comienza creando tu primer evento': 'Start by creating your first event',
  'Comienza agregando tu primera ubicación': 'Start by adding your first location',
  'Comienza agregando tu primer contacto': 'Start by adding your first contact',
  'Agregar Ubicación': 'Add Location',
  'Agregar Contacto': 'Add Contact',

  // Filters & Badges
  'Filtrar por clasificación': 'Filter by classification',
  'Todas las clasificaciones': 'All classifications',
  'Conferencia': 'Conference',
  'Taller': 'Workshop',
  'Seminario': 'Seminar',
  'Conferencias': 'Conferences',
  'Talleres': 'Workshops',
  'Seminarios': 'Seminars',

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
  'Dirección': 'Address',
  'Latitud': 'Latitude',
  'Longitud': 'Longitude',
  'Saludo': 'Salutation',
  'Nombre Completo': 'Full Name',
  'Número de Identificación': 'ID Number',
  'Correo Electrónico': 'Email',
  'Número de Teléfono': 'Phone Number',
  'URL de Fotografía': 'Photo URL',
  'Vista previa': 'Preview',
  'Ingresa la URL de una imagen para la foto del contacto': 'Enter an image URL for the contact photo',

  // Confirm Dialogs
  'Eliminar Evento': 'Delete Event',
  'Eliminar Ubicación': 'Delete Location',
  'Eliminar Contacto': 'Delete Contact',
  '¿Estás seguro de que deseas eliminar': 'Are you sure you want to delete',
  'Esta acción no se puede deshacer.': 'This action cannot be undone.'
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

  // 1. Check Static Fallback Dictionary (Prioritize UI consistency)
  // This ensures known UI terms are always translated correctly/instantly without API latency or errors
  if (target === 'en' && FALLBACK_TRANSLATIONS[text]) {
    return FALLBACK_TRANSLATIONS[text];
  }

  // 2. Check Cache
  const cache = loadCache();
  const cacheKey = getCacheKey(text, source, target);

  if (cache[cacheKey]) {
    return cache[cacheKey];
  }

  // 3. Try API Mirrors
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

        // Validation: If API returns same text (and it's not a short word), treat as failure
        if (translatedText === text && text.length > 3) {
          console.warn(`Mirror returned untranslated text: ${url}`);
          continue;
        }

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

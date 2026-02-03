import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { translateText } from '../lib/translate';

type Language = 'es' | 'en';

interface TranslationContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (text: string) => string;
    translateAsync: (text: string) => Promise<string>;
    isTranslating: boolean;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

const LANGUAGE_KEY = 'app_language';

// Pre-defined translations for common UI elements (fallback when API is slow)
const staticTranslations: Record<string, Record<Language, string>> = {
    // Navigation
    'Inicio': { es: 'Inicio', en: 'Home' },
    'Eventos': { es: 'Eventos', en: 'Events' },
    'Ubicaciones': { es: 'Ubicaciones', en: 'Locations' },
    'Contactos': { es: 'Contactos', en: 'Contacts' },
    'Configuración': { es: 'Configuración', en: 'Settings' },
    'Ayuda': { es: 'Ayuda', en: 'Help' },
    'Cerrar Sesión': { es: 'Cerrar Sesión', en: 'Log Out' },

    // Dashboard
    'Dashboard': { es: 'Dashboard', en: 'Dashboard' },
    'Bienvenido al Sistema de Gestión de Eventos': { es: 'Bienvenido al Sistema de Gestión de Eventos', en: 'Welcome to the Event Management System' },
    'Gestiona conferencias, talleres y seminarios': { es: 'Gestiona conferencias, talleres y seminarios', en: 'Manage conferences, workshops and seminars' },
    'Administra los lugares de tus eventos': { es: 'Administra los lugares de tus eventos', en: 'Manage your event locations' },
    'Directorio de contactos e invitados': { es: 'Directorio de contactos e invitados', en: 'Contacts and guests directory' },
    'Personaliza tu experiencia': { es: 'Personaliza tu experiencia', en: 'Customize your experience' },
    'Centro de soporte y documentación': { es: 'Centro de soporte y documentación', en: 'Support and documentation center' },
    'Próximos Eventos': { es: 'Próximos Eventos', en: 'Upcoming Events' },
    'Ver todos': { es: 'Ver todos', en: 'View all' },
    'No hay eventos próximos': { es: 'No hay eventos próximos', en: 'No upcoming events' },
    'Crear Evento': { es: 'Crear Evento', en: 'Create Event' },
    'Crear Nuevo Evento': { es: 'Crear Nuevo Evento', en: 'Create New Event' },
    'Actividad Reciente': { es: 'Actividad Reciente', en: 'Recent Activity' },
    'No hay actividad reciente': { es: 'No hay actividad reciente', en: 'No recent activity' },
    'Sistema de Gestión de Eventos': { es: 'Sistema de Gestión de Eventos', en: 'Event Management System' },
    'Universidad Técnica Equinoccial - Gestiona conferencias, talleres y seminarios.': { es: 'Universidad Técnica Equinoccial - Gestiona conferencias, talleres y seminarios.', en: 'Technical University of Ecuador - Manage conferences, workshops and seminars.' },

    // Events
    'Buscar eventos...': { es: 'Buscar eventos...', en: 'Search events...' },
    'Todas las clasificaciones': { es: 'Todas las clasificaciones', en: 'All classifications' },
    'Conferencias': { es: 'Conferencias', en: 'Conferences' },
    'Talleres': { es: 'Talleres', en: 'Workshops' },
    'Seminarios': { es: 'Seminarios', en: 'Seminars' },
    'Nuevo Evento': { es: 'Nuevo Evento', en: 'New Event' },
    'No hay eventos': { es: 'No hay eventos', en: 'No events' },
    'Comienza creando tu primer evento': { es: 'Comienza creando tu primer evento', en: 'Start by creating your first event' },
    'Conferencia': { es: 'Conferencia', en: 'Conference' },
    'Taller': { es: 'Taller', en: 'Workshop' },
    'Seminario': { es: 'Seminario', en: 'Seminar' },
    'Editar': { es: 'Editar', en: 'Edit' },
    'Eliminar': { es: 'Eliminar', en: 'Delete' },

    // Event Form
    'Editar Evento': { es: 'Editar Evento', en: 'Edit Event' },
    'Título': { es: 'Título', en: 'Title' },
    'Clasificación': { es: 'Clasificación', en: 'Classification' },
    'Ubicación': { es: 'Ubicación', en: 'Location' },
    'Sin ubicación': { es: 'Sin ubicación', en: 'No location' },
    'Fecha y Hora': { es: 'Fecha y Hora', en: 'Date and Time' },
    'Zona Horaria': { es: 'Zona Horaria', en: 'Time Zone' },
    'Invitados': { es: 'Invitados', en: 'Guests' },
    'Nombres separados por comas': { es: 'Nombres separados por comas', en: 'Names separated by commas' },
    'Descripción': { es: 'Descripción', en: 'Description' },
    'Describe los detalles del evento...': { es: 'Describe los detalles del evento...', en: 'Describe the event details...' },
    'Repetición': { es: 'Repetición', en: 'Recurrence' },
    'No se repite': { es: 'No se repite', en: 'Does not repeat' },
    'Diariamente': { es: 'Diariamente', en: 'Daily' },
    'Semanalmente': { es: 'Semanalmente', en: 'Weekly' },
    'Mensualmente': { es: 'Mensualmente', en: 'Monthly' },
    'Anualmente': { es: 'Anualmente', en: 'Yearly' },
    'Recordatorio': { es: 'Recordatorio', en: 'Reminder' },
    'Sin recordatorio': { es: 'Sin recordatorio', en: 'No reminder' },
    '5 minutos antes': { es: '5 minutos antes', en: '5 minutes before' },
    '15 minutos antes': { es: '15 minutos antes', en: '15 minutes before' },
    '30 minutos antes': { es: '30 minutos antes', en: '30 minutes before' },
    '1 hora antes': { es: '1 hora antes', en: '1 hour before' },
    '1 día antes': { es: '1 día antes', en: '1 day before' },
    '1 semana antes': { es: '1 semana antes', en: '1 week before' },
    'Cancelar': { es: 'Cancelar', en: 'Cancel' },
    'Guardar': { es: 'Guardar', en: 'Save' },
    'Guardando...': { es: 'Guardando...', en: 'Saving...' },
    'Error al guardar el evento': { es: 'Error al guardar el evento', en: 'Error saving event' },

    // Locations
    'Buscar ubicaciones...': { es: 'Buscar ubicaciones...', en: 'Search locations...' },
    'Nueva Ubicación': { es: 'Nueva Ubicación', en: 'New Location' },
    'No hay ubicaciones': { es: 'No hay ubicaciones', en: 'No locations' },
    'Comienza creando tu primera ubicación': { es: 'Comienza creando tu primera ubicación', en: 'Start by creating your first location' },
    'Crear Ubicación': { es: 'Crear Ubicación', en: 'Create Location' },
    'Editar Ubicación': { es: 'Editar Ubicación', en: 'Edit Location' },
    'Dirección': { es: 'Dirección', en: 'Address' },
    'Coordenadas': { es: 'Coordenadas', en: 'Coordinates' },
    'Latitud': { es: 'Latitud', en: 'Latitude' },
    'Longitud': { es: 'Longitud', en: 'Longitude' },
    'Error al guardar la ubicación': { es: 'Error al guardar la ubicación', en: 'Error saving location' },

    // Contacts
    'Buscar contactos...': { es: 'Buscar contactos...', en: 'Search contacts...' },
    'Nuevo Contacto': { es: 'Nuevo Contacto', en: 'New Contact' },
    'No hay contactos': { es: 'No hay contactos', en: 'No contacts' },
    'Comienza creando tu primer contacto': { es: 'Comienza creando tu primer contacto', en: 'Start by creating your first contact' },
    'Crear Contacto': { es: 'Crear Contacto', en: 'Create Contact' },
    'Editar Contacto': { es: 'Editar Contacto', en: 'Edit Contact' },
    'Salutación': { es: 'Salutación', en: 'Salutation' },
    'Nombre Completo': { es: 'Nombre Completo', en: 'Full Name' },
    'Número de Identificación': { es: 'Número de Identificación', en: 'ID Number' },
    'Correo Electrónico': { es: 'Correo Electrónico', en: 'Email' },
    'Teléfono': { es: 'Teléfono', en: 'Phone' },
    'URL de Foto': { es: 'URL de Foto', en: 'Photo URL' },
    'Error al guardar el contacto': { es: 'Error al guardar el contacto', en: 'Error saving contact' },

    // Stats
    'Total Eventos': { es: 'Total Eventos', en: 'Total Events' },
    'Total Ubicaciones': { es: 'Total Ubicaciones', en: 'Total Locations' },
    'Total Contactos': { es: 'Total Contactos', en: 'Total Contacts' },
    'Este Mes': { es: 'Este Mes', en: 'This Month' },

    // Confirm Dialog
    'Eliminar Evento': { es: 'Eliminar Evento', en: 'Delete Event' },
    'Eliminar Ubicación': { es: 'Eliminar Ubicación', en: 'Delete Location' },
    'Eliminar Contacto': { es: 'Eliminar Contacto', en: 'Delete Contact' },
    'Esta acción no se puede deshacer.': { es: 'Esta acción no se puede deshacer.', en: 'This action cannot be undone.' },

    // Header
    'Buscar...': { es: 'Buscar...', en: 'Search...' },
    'Admin': { es: 'Admin', en: 'Admin' },
    'Administrador': { es: 'Administrador', en: 'Administrator' },

    // Settings & Help
    'Próximamente...': { es: 'Próximamente...', en: 'Coming soon...' },
    'Centro de Ayuda': { es: 'Centro de Ayuda', en: 'Help Center' },
    'Aprende a usar el sistema con nuestros recursos': { es: 'Aprende a usar el sistema con nuestros recursos', en: 'Learn to use the system with our resources' },
    'Video Tutorial': { es: 'Video Tutorial', en: 'Video Tutorial' },
    'Tutorial del Sistema de Gestión de Eventos': { es: 'Tutorial del Sistema de Gestión de Eventos', en: 'Event Management System Tutorial' },
    'Este video te guiará a través de las principales funcionalidades del sistema de gestión de eventos.': { es: 'Este video te guiará a través de las principales funcionalidades del sistema de gestión de eventos.', en: 'This video will guide you through the main functionalities of the event management system.' },
    'Guía Rápida': { es: 'Guía Rápida', en: 'Quick Start Guide' },
    'Crear Ubicaciones': { es: 'Crear Ubicaciones', en: 'Create Locations' },
    'Define los lugares donde se realizarán tus eventos.': { es: 'Define los lugares donde se realizarán tus eventos.', en: 'Define the places where your events will take place.' },
    'Agregar Contactos': { es: 'Agregar Contactos', en: 'Add Contacts' },
    'Registra a los participantes e invitados de tus eventos.': { es: 'Registra a los participantes e invitados de tus eventos.', en: 'Register the participants and guests of your events.' },
    'Programar Eventos': { es: 'Programar Eventos', en: 'Schedule Events' },
    'Crea conferencias, talleres y seminarios.': { es: 'Crea conferencias, talleres y seminarios.', en: 'Create conferences, workshops and seminars.' },
    'Preguntas Frecuentes': { es: 'Preguntas Frecuentes', en: 'Frequently Asked Questions' },
    '¿Cómo crear un nuevo evento?': { es: '¿Cómo crear un nuevo evento?', en: 'How to create a new event?' },
    'Para crear un nuevo evento, ve a la sección "Eventos" en el menú lateral y haz clic en el botón "Nuevo Evento". Completa el formulario con el título, fecha, ubicación y otros detalles del evento.': { es: 'Para crear un nuevo evento, ve a la sección "Eventos" en el menú lateral y haz clic en el botón "Nuevo Evento". Completa el formulario con el título, fecha, ubicación y otros detalles del evento.', en: 'To create a new event, go to the "Events" section in the sidebar and click the "New Event" button. Fill in the form with the title, date, location and other event details.' },
    '¿Cómo cambiar el idioma de la aplicación?': { es: '¿Cómo cambiar el idioma de la aplicación?', en: 'How to change the application language?' },
    'Puedes cambiar el idioma utilizando el selector de idioma ubicado en la esquina superior derecha del encabezado. Haz clic en la bandera para alternar entre Español e Inglés.': { es: 'Puedes cambiar el idioma utilizando el selector de idioma ubicado en la esquina superior derecha del encabezado. Haz clic en la bandera para alternar entre Español e Inglés.', en: 'You can change the language using the language selector located in the upper right corner of the header. Click on the flag to toggle between Spanish and English.' },
    '¿Cómo añadir una nueva ubicación?': { es: '¿Cómo añadir una nueva ubicación?', en: 'How to add a new location?' },
    'Ve a la sección "Ubicaciones" en el menú lateral y haz clic en "Nueva Ubicación". Ingresa el nombre, dirección y capacidad del lugar.': { es: 'Ve a la sección "Ubicaciones" en el menú lateral y haz clic en "Nueva Ubicación". Ingresa el nombre, dirección y capacidad del lugar.', en: 'Go to the "Locations" section in the sidebar and click "New Location". Enter the name, address and capacity of the venue.' },
    '¿Puedo editar un evento existente?': { es: '¿Puedo editar un evento existente?', en: 'Can I edit an existing event?' },
    'Sí, haz clic en el icono de editar (lápiz) junto al evento que deseas modificar. Realiza los cambios necesarios y guarda.': { es: 'Sí, haz clic en el icono de editar (lápiz) junto al evento que deseas modificar. Realiza los cambios necesarios y guarda.', en: 'Yes, click on the edit icon (pencil) next to the event you want to modify. Make the necessary changes and save.' },
    '¿Cómo eliminar un evento?': { es: '¿Cómo eliminar un evento?', en: 'How to delete an event?' },
    'Haz clic en el icono de papelera junto al evento. Aparecerá un diálogo de confirmación. Haz clic en "Eliminar" para confirmar la acción.': { es: 'Haz clic en el icono de papelera junto al evento. Aparecerá un diálogo de confirmación. Haz clic en "Eliminar" para confirmar la acción.', en: 'Click on the trash icon next to the event. A confirmation dialog will appear. Click "Delete" to confirm the action.' },
    '¿Necesitas más ayuda?': { es: '¿Necesitas más ayuda?', en: 'Need more help?' },
    'Contacta al equipo de soporte de la Universidad Técnica Equinoccial': { es: 'Contacta al equipo de soporte de la Universidad Técnica Equinoccial', en: 'Contact the Universidad Técnica Equinoccial support team' },
    'Enviar correo a soporte': { es: 'Enviar correo a soporte', en: 'Send email to support' },
    'Contactar Soporte': { es: 'Contactar Soporte', en: 'Contact Support' },

    // Additional LocationsList/ContactsList translations
    'Comienza agregando tu primera ubicación': { es: 'Comienza agregando tu primera ubicación', en: 'Start by adding your first location' },
    'Agregar Ubicación': { es: 'Agregar Ubicación', en: 'Add Location' },
    'Ver en Maps': { es: 'Ver en Maps', en: 'View in Maps' },
    'Comienza agregando tu primer contacto': { es: 'Comienza agregando tu primer contacto', en: 'Start by adding your first contact' },
    'Agregar Contacto': { es: 'Agregar Contacto', en: 'Add Contact' },
    'Enviar correo a': { es: 'Enviar correo a', en: 'Send email to' },
    'Llamar a': { es: 'Llamar a', en: 'Call' },
    'Filtrar por clasificación': { es: 'Filtrar por clasificación', en: 'Filter by classification' },
    'Estadísticas': { es: 'Estadísticas', en: 'Statistics' },
    'Cerrar': { es: 'Cerrar', en: 'Close' },
    '¿Estás seguro de que deseas eliminar': { es: '¿Estás seguro de que deseas eliminar', en: 'Are you sure you want to delete' },

    // App name
    'CASOPRACTICO1': { es: 'CASOPRACTICO1', en: 'CASOPRACTICO1' },
    'Gestión de Eventos': { es: 'Gestión de Eventos', en: 'Event Management' },

    // Loading
    'Cargando...': { es: 'Cargando...', en: 'Loading...' },
};

interface TranslationProviderProps {
    children: ReactNode;
}

export const TranslationProvider: React.FC<TranslationProviderProps> = ({ children }) => {
    const [language, setLanguageState] = useState<Language>(() => {
        const saved = localStorage.getItem(LANGUAGE_KEY);
        return (saved as Language) || 'es';
    });
    const [isTranslating, setIsTranslating] = useState(false);
    const [dynamicTranslations, setDynamicTranslations] = useState<Record<string, string>>({});

    useEffect(() => {
        localStorage.setItem(LANGUAGE_KEY, language);
        // Update HTML lang attribute
        document.documentElement.lang = language;
    }, [language]);

    const setLanguage = useCallback((lang: Language) => {
        setLanguageState(lang);
        // Clear dynamic translations when language changes
        setDynamicTranslations({});
    }, []);

    // Synchronous translation using static translations
    const t = useCallback((text: string): string => {
        if (!text) return text;

        // Check static translations first
        const staticTranslation = staticTranslations[text];
        if (staticTranslation) {
            return staticTranslation[language];
        }

        // Check dynamic translations
        const dynamicKey = `${language}_${text}`;
        if (dynamicTranslations[dynamicKey]) {
            return dynamicTranslations[dynamicKey];
        }

        // Return original text if no translation found
        return text;
    }, [language, dynamicTranslations]);

    // Async translation using LibreTranslate API
    const translateAsync = useCallback(async (text: string): Promise<string> => {
        if (!text) return text;

        // Check static translations first
        const staticTranslation = staticTranslations[text];
        if (staticTranslation) {
            return staticTranslation[language];
        }

        // Check dynamic translations cache
        const dynamicKey = `${language}_${text}`;
        if (dynamicTranslations[dynamicKey]) {
            return dynamicTranslations[dynamicKey];
        }

        // If we're in Spanish mode, return original (base language)
        if (language === 'es') {
            return text;
        }

        // Translate from Spanish to English
        setIsTranslating(true);
        try {
            const translated = await translateText(text, 'es', language);
            setDynamicTranslations(prev => ({
                ...prev,
                [dynamicKey]: translated
            }));
            return translated;
        } catch (error) {
            console.error('Translation error:', error);
            return text;
        } finally {
            setIsTranslating(false);
        }
    }, [language, dynamicTranslations]);

    return (
        <TranslationContext.Provider value={{ language, setLanguage, t, translateAsync, isTranslating }}>
            {children}
        </TranslationContext.Provider>
    );
};

export const useTranslation = (): TranslationContextType => {
    const context = useContext(TranslationContext);
    if (!context) {
        throw new Error('useTranslation must be used within a TranslationProvider');
    }
    return context;
};

export type { Language };

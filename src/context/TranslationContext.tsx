import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { translateText } from '../lib/translate';

export type Language = 'es' | 'en';

interface TranslationContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (text: string) => string;
    translateDynamic: (text: string) => Promise<string>;
    isTranslating: boolean;
    translations: Record<string, string>;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

const TRANSLATIONS_CACHE_KEY = 'dynamic_translations_v4';
const LANGUAGE_KEY = 'app_language';

// Load cached translations from localStorage
const loadCachedTranslations = (): Record<string, string> => {
    try {
        const cached = localStorage.getItem(TRANSLATIONS_CACHE_KEY);
        return cached ? JSON.parse(cached) : {};
    } catch {
        return {};
    }
};

// Save translations to localStorage
const saveCachedTranslations = (translations: Record<string, string>) => {
    try {
        localStorage.setItem(TRANSLATIONS_CACHE_KEY, JSON.stringify(translations));
    } catch {
        // localStorage might be full
    }
};

interface TranslationProviderProps {
    children: ReactNode;
}

export function TranslationProvider({ children }: TranslationProviderProps) {
    const [language, setLanguageState] = useState<Language>(() => {
        const saved = localStorage.getItem(LANGUAGE_KEY);
        return (saved as Language) || 'es';
    });

    const [translations, setTranslations] = useState<Record<string, string>>(() => loadCachedTranslations());
    const [isTranslating, setIsTranslating] = useState(false);
    const [pendingTexts, setPendingTexts] = useState<Set<string>>(new Set());

    // Save language preference
    const setLanguage = useCallback((lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem(LANGUAGE_KEY, lang);
        // Update HTML lang attribute
        document.documentElement.lang = lang;
    }, []);

    // Update HTML lang on mount
    useEffect(() => {
        document.documentElement.lang = language;
    }, [language]);

    // Get cache key for a translation
    const getCacheKey = useCallback((text: string, lang: Language) => {
        return `${lang}_${text}`;
    }, []);

    // Synchronous translation - returns cached translation or original text
    const t = useCallback((text: string): string => {
        if (!text) return text;

        // If Spanish (base language), return original
        if (language === 'es') {
            return text;
        }

        // Check if we have a cached translation
        const cacheKey = getCacheKey(text, language);
        if (translations[cacheKey]) {
            return translations[cacheKey];
        }

        // If not in cache, trigger async translation
        if (!pendingTexts.has(text)) {
            setPendingTexts(prev => new Set(prev).add(text));
        }

        // Return original text while translation loads
        return text;
    }, [language, translations, pendingTexts, getCacheKey]);

    // Async translation using LibreTranslate API
    const translateDynamic = useCallback(async (text: string): Promise<string> => {
        if (!text) return text;
        if (language === 'es') return text;

        const cacheKey = getCacheKey(text, language);

        // Return cached if available
        if (translations[cacheKey]) {
            return translations[cacheKey];
        }

        // Translate via API
        setIsTranslating(true);
        try {
            const translated = await translateText(text, 'es', language);

            // Update cache
            setTranslations(prev => {
                const updated = { ...prev, [cacheKey]: translated };
                saveCachedTranslations(updated);
                return updated;
            });

            return translated;
        } catch (error) {
            console.error('Translation error:', error);
            return text;
        } finally {
            setIsTranslating(false);
        }
    }, [language, translations, getCacheKey]);

    // Process pending translations in background
    useEffect(() => {
        if (pendingTexts.size === 0 || language === 'es') return;

        const translatePending = async () => {
            setIsTranslating(true);
            const textsToTranslate = Array.from(pendingTexts);

            // Clear pending to avoid re-processing
            setPendingTexts(new Set());

            // Translate all pending texts
            const newTranslations: Record<string, string> = {};

            for (const text of textsToTranslate) {
                const cacheKey = getCacheKey(text, language);

                // Skip if already cached
                if (translations[cacheKey]) continue;

                try {
                    const translated = await translateText(text, 'es', language);
                    newTranslations[cacheKey] = translated;
                } catch (error) {
                    console.error('Translation error for:', text, error);
                    newTranslations[cacheKey] = text; // Fallback to original
                }
            }

            // Update state with all new translations
            if (Object.keys(newTranslations).length > 0) {
                setTranslations(prev => {
                    const updated = { ...prev, ...newTranslations };
                    saveCachedTranslations(updated);
                    return updated;
                });
            }

            setIsTranslating(false);
        };

        // Debounce to batch translations
        const timer = setTimeout(translatePending, 100);
        return () => clearTimeout(timer);
    }, [pendingTexts, language, translations, getCacheKey]);

    const value: TranslationContextType = {
        language,
        setLanguage,
        t,
        translateDynamic,
        isTranslating,
        translations
    };

    return (
        <TranslationContext.Provider value={value}>
            {children}
        </TranslationContext.Provider>
    );
}

export function useTranslation() {
    const context = useContext(TranslationContext);
    if (!context) {
        throw new Error('useTranslation must be used within a TranslationProvider');
    }
    return context;
}

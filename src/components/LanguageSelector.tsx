import { Globe } from 'lucide-react';
import { useTranslation, Language } from '../context/TranslationContext';

export default function LanguageSelector() {
    const { language, setLanguage, isTranslating } = useTranslation();

    const toggleLanguage = () => {
        const newLang: Language = language === 'es' ? 'en' : 'es';
        setLanguage(newLang);
    };

    return (
        <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            title={language === 'es' ? 'Change to English' : 'Cambiar a Español'}
            aria-label={language === 'es' ? 'Change language to English' : 'Cambiar idioma a Español'}
        >
            <Globe className={`w-5 h-5 text-text-secondary ${isTranslating ? 'animate-spin' : ''}`} />
            <span className="text-sm font-medium text-text-primary">
                {language === 'es' ? '🇪🇸 ES' : '🇺🇸 EN'}
            </span>
        </button>
    );
}

import { HelpCircle, PlayCircle, Book, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from '../context/TranslationContext';

interface FAQItem {
    question: string;
    answer: string;
}

export default function HelpCenter() {
    const { t } = useTranslation();
    const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

    const faqs: FAQItem[] = [
        {
            question: '¿Cómo crear un nuevo evento?',
            answer: 'Para crear un nuevo evento, ve a la sección "Eventos" en el menú lateral y haz clic en el botón "Nuevo Evento". Completa el formulario con el título, fecha, ubicación y otros detalles del evento.'
        },
        {
            question: '¿Cómo cambiar el idioma de la aplicación?',
            answer: 'Puedes cambiar el idioma utilizando el selector de idioma ubicado en la esquina superior derecha del encabezado. Haz clic en la bandera para alternar entre Español e Inglés.'
        },
        {
            question: '¿Cómo añadir una nueva ubicación?',
            answer: 'Ve a la sección "Ubicaciones" en el menú lateral y haz clic en "Nueva Ubicación". Ingresa el nombre, dirección y capacidad del lugar.'
        },
        {
            question: '¿Puedo editar un evento existente?',
            answer: 'Sí, haz clic en el icono de editar (lápiz) junto al evento que deseas modificar. Realiza los cambios necesarios y guarda.'
        },
        {
            question: '¿Cómo eliminar un evento?',
            answer: 'Haz clic en el icono de papelera junto al evento. Aparecerá un diálogo de confirmación. Haz clic en "Eliminar" para confirmar la acción.'
        }
    ];

    const toggleFAQ = (index: number) => {
        setExpandedFAQ(expandedFAQ === index ? null : index);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="card p-6 bg-gradient-to-r from-primary to-primary-700 text-white">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                        <HelpCircle className="w-8 h-8" aria-hidden="true" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold mb-1">{t('Centro de Ayuda')}</h1>
                        <p className="text-primary-100">{t('Aprende a usar el sistema con nuestros recursos')}</p>
                    </div>
                </div>
            </div>

            {/* Video Tutorial Section */}
            <div className="card p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                        <PlayCircle className="w-5 h-5 text-primary" aria-hidden="true" />
                    </div>
                    <h2 className="text-lg font-semibold text-text-primary">{t('Video Tutorial')}</h2>
                </div>

                <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden relative">
                    {/* Embedded Video Tutorial */}
                    <iframe
                        className="w-full h-full"
                        src="https://www.youtube-nocookie.com/embed/ira3X0BaeTA"
                        title={t('Tutorial del Sistema de Gestión de Eventos')}
                        referrerPolicy="strict-origin-when-cross-origin"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>

                <p className="text-text-muted text-sm mt-4">
                    {t('Este video te guiará a través de las principales funcionalidades del sistema de gestión de eventos.')}
                </p>
            </div>

            {/* Quick Start Guide */}
            <div className="card p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-success-100 rounded-xl flex items-center justify-center">
                        <Book className="w-5 h-5 text-success" aria-hidden="true" />
                    </div>
                    <h2 className="text-lg font-semibold text-text-primary">{t('Guía Rápida')}</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-bg-main rounded-xl">
                        <div className="w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center font-bold mb-3">1</div>
                        <h3 className="font-medium text-text-primary mb-1">{t('Crear Ubicaciones')}</h3>
                        <p className="text-sm text-text-muted">{t('Define los lugares donde se realizarán tus eventos.')}</p>
                    </div>
                    <div className="p-4 bg-bg-main rounded-xl">
                        <div className="w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center font-bold mb-3">2</div>
                        <h3 className="font-medium text-text-primary mb-1">{t('Agregar Contactos')}</h3>
                        <p className="text-sm text-text-muted">{t('Registra a los participantes e invitados de tus eventos.')}</p>
                    </div>
                    <div className="p-4 bg-bg-main rounded-xl">
                        <div className="w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center font-bold mb-3">3</div>
                        <h3 className="font-medium text-text-primary mb-1">{t('Programar Eventos')}</h3>
                        <p className="text-sm text-text-muted">{t('Crea conferencias, talleres y seminarios.')}</p>
                    </div>
                </div>
            </div>

            {/* FAQ Section */}
            <div className="card p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-warning-100 rounded-xl flex items-center justify-center">
                        <MessageCircle className="w-5 h-5 text-warning-600" aria-hidden="true" />
                    </div>
                    <h2 className="text-lg font-semibold text-text-primary">{t('Preguntas Frecuentes')}</h2>
                </div>

                <div className="space-y-3">
                    {faqs.map((faq, index) => (
                        <div key={index} className="border border-border-light rounded-xl overflow-hidden">
                            <button
                                onClick={() => toggleFAQ(index)}
                                className="w-full flex items-center justify-between p-4 text-left hover:bg-bg-main transition-colors"
                                aria-expanded={expandedFAQ === index}
                                aria-controls={`faq-answer-${index}`}
                            >
                                <span className="font-medium text-text-primary">{t(faq.question)}</span>
                                {expandedFAQ === index ? (
                                    <ChevronUp className="w-5 h-5 text-text-muted flex-shrink-0" aria-hidden="true" />
                                ) : (
                                    <ChevronDown className="w-5 h-5 text-text-muted flex-shrink-0" aria-hidden="true" />
                                )}
                            </button>
                            {expandedFAQ === index && (
                                <div id={`faq-answer-${index}`} className="px-4 pb-4 text-sm text-text-secondary">
                                    {t(faq.answer)}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Contact Support */}
            <div className="card p-6 bg-bg-main border-2 border-dashed border-border-light">
                <div className="text-center">
                    <h3 className="font-semibold text-text-primary mb-2">{t('¿Necesitas más ayuda?')}</h3>
                    <p className="text-sm text-text-muted mb-4">
                        {t('Contacta al equipo de soporte de la Universidad Técnica Equinoccial')}
                    </p>
                    <a
                        href="mailto:soporte@ute.edu.ec"
                        className="btn-primary inline-flex"
                        aria-label={t('Enviar correo a soporte')}
                    >
                        {t('Contactar Soporte')}
                    </a>
                </div>
            </div>
        </div>
    );
}

import { useState, useEffect, FormEvent } from 'react';
import { X, Calendar } from 'lucide-react';
import { supabase, Evento, Ubicacion } from '../lib/supabase';
import { useTranslation } from '../context/TranslationContext';

interface EventFormProps {
    event?: Evento | null;
    onClose: () => void;
    onSave: () => void;
}

export default function EventForm({ event, onClose, onSave }: EventFormProps) {
    const [ubicaciones, setUbicaciones] = useState<Ubicacion[]>([]);
    const [formData, setFormData] = useState({
        titulo: '',
        invitados: '',
        fecha_evento: '',
        zona_horaria: 'America/Guayaquil',
        descripcion: '',
        recurrencia: 'ninguna',
        recordatorio: 'ninguno',
        clasificacion: 'conferencia',
        ubicacion_id: '',
    });
    const [saving, setSaving] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
        loadUbicaciones();
        if (event) {
            setFormData({
                titulo: event.titulo,
                invitados: event.invitados,
                fecha_evento: event.fecha_evento.slice(0, 16),
                zona_horaria: event.zona_horaria,
                descripcion: event.descripcion,
                recurrencia: event.recurrencia,
                recordatorio: event.recordatorio,
                clasificacion: event.clasificacion,
                ubicacion_id: event.ubicacion_id || '',
            });
        }
    }, [event]);

    const loadUbicaciones = async () => {
        const { data } = await supabase.from('ubicaciones').select('*').order('titulo');
        setUbicaciones((data as Ubicacion[]) || []);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const eventData = {
                ...formData,
                ubicacion_id: formData.ubicacion_id || null,
                actualizado_en: new Date().toISOString(),
            };

            if (event) {
                const { error } = await supabase
                    .from('eventos')
                    .update(eventData)
                    .eq('id', event.id);
                if (error) throw error;
            } else {
                const { error } = await supabase.from('eventos').insert([eventData]);
                if (error) throw error;
            }

            onSave();
            onClose();
        } catch (error) {
            alert(t('Error al guardar el evento'));
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="event-form-title">
            <div className="modal-content max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="sticky top-0 bg-white flex items-center justify-between px-6 py-4 border-b border-border-light z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-primary" aria-hidden="true" />
                        </div>
                        <h2 id="event-form-title" className="text-xl font-semibold text-text-primary">
                            {event ? t('Editar Evento') : t('Nuevo Evento')}
                        </h2>
                    </div>
                    <button onClick={onClose} className="btn-icon hover:bg-gray-100" aria-label={t('Cerrar')}>
                        <X className="w-5 h-5 text-text-secondary" aria-hidden="true" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div>
                        <label className="label" htmlFor="titulo">{t('Título')} *</label>
                        <input
                            type="text"
                            id="titulo"
                            required
                            value={formData.titulo}
                            onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                            placeholder={t('Ej: Conferencia de Innovación Tecnológica')}
                            className="input"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="label" htmlFor="clasificacion">{t('Clasificación')} *</label>
                            <select
                                id="clasificacion"
                                value={formData.clasificacion}
                                onChange={(e) => setFormData({ ...formData, clasificacion: e.target.value })}
                                className="input"
                            >
                                <option value="conferencia">{t('Conferencia')}</option>
                                <option value="taller">{t('Taller')}</option>
                                <option value="seminario">{t('Seminario')}</option>
                            </select>
                        </div>

                        <div>
                            <label className="label" htmlFor="ubicacion">{t('Ubicación')}</label>
                            <select
                                id="ubicacion"
                                value={formData.ubicacion_id}
                                onChange={(e) => setFormData({ ...formData, ubicacion_id: e.target.value })}
                                className="input"
                            >
                                <option value="">{t('Sin ubicación')}</option>
                                {ubicaciones.map((ubicacion) => (
                                    <option key={ubicacion.id} value={ubicacion.id}>
                                        {ubicacion.titulo}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="label" htmlFor="fecha">{t('Fecha y Hora')} *</label>
                            <input
                                type="datetime-local"
                                id="fecha"
                                required
                                value={formData.fecha_evento}
                                onChange={(e) => setFormData({ ...formData, fecha_evento: e.target.value })}
                                className="input"
                            />
                        </div>

                        <div>
                            <label className="label" htmlFor="zona">{t('Zona Horaria')}</label>
                            <select
                                id="zona"
                                value={formData.zona_horaria}
                                onChange={(e) => setFormData({ ...formData, zona_horaria: e.target.value })}
                                className="input"
                            >
                                <option value="America/Guayaquil">Quito (ECT)</option>
                                <option value="America/Bogota">Bogotá (COT)</option>
                                <option value="America/Lima">Lima (PET)</option>
                                <option value="America/Mexico_City">Ciudad de México (CST)</option>
                                <option value="America/Argentina/Buenos_Aires">Buenos Aires (ART)</option>
                                <option value="America/New_York">Nueva York (EST)</option>
                                <option value="Europe/Madrid">Madrid (CET)</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="label" htmlFor="invitados">{t('Invitados')}</label>
                        <input
                            type="text"
                            id="invitados"
                            value={formData.invitados}
                            onChange={(e) => setFormData({ ...formData, invitados: e.target.value })}
                            placeholder={t('Nombres separados por comas')}
                            className="input"
                        />
                    </div>

                    <div>
                        <label className="label" htmlFor="descripcion">{t('Descripción')}</label>
                        <textarea
                            id="descripcion"
                            value={formData.descripcion}
                            onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                            rows={3}
                            placeholder={t('Describe los detalles del evento...')}
                            className="input resize-none"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="label" htmlFor="recurrencia">{t('Repetición')}</label>
                            <select
                                id="recurrencia"
                                value={formData.recurrencia}
                                onChange={(e) => setFormData({ ...formData, recurrencia: e.target.value })}
                                className="input"
                            >
                                <option value="ninguna">{t('No se repite')}</option>
                                <option value="diaria">{t('Diariamente')}</option>
                                <option value="semanal">{t('Semanalmente')}</option>
                                <option value="mensual">{t('Mensualmente')}</option>
                                <option value="anual">{t('Anualmente')}</option>
                            </select>
                        </div>

                        <div>
                            <label className="label" htmlFor="recordatorio">{t('Recordatorio')}</label>
                            <select
                                id="recordatorio"
                                value={formData.recordatorio}
                                onChange={(e) => setFormData({ ...formData, recordatorio: e.target.value })}
                                className="input"
                            >
                                <option value="ninguno">{t('Sin recordatorio')}</option>
                                <option value="5min">{t('5 minutos antes')}</option>
                                <option value="15min">{t('15 minutos antes')}</option>
                                <option value="30min">{t('30 minutos antes')}</option>
                                <option value="1hora">{t('1 hora antes')}</option>
                                <option value="1dia">{t('1 día antes')}</option>
                                <option value="1semana">{t('1 semana antes')}</option>
                            </select>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-border-light">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn-secondary"
                        >
                            {t('Cancelar')}
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="btn-primary"
                        >
                            {saving ? t('Guardando...') : t('Guardar')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}


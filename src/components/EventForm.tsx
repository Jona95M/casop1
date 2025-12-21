import { useState, useEffect, FormEvent } from 'react';
import { X, Calendar } from 'lucide-react';
import { supabase, Evento, Ubicacion } from '../lib/supabase';

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
            console.error('Error saving event:', error);
            alert('Error al guardar el evento');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="sticky top-0 bg-white flex items-center justify-between px-6 py-4 border-b border-border-light z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-primary" />
                        </div>
                        <h2 className="text-xl font-semibold text-text-primary">
                            {event ? 'Editar Evento' : 'Nuevo Evento'}
                        </h2>
                    </div>
                    <button onClick={onClose} className="btn-icon hover:bg-gray-100">
                        <X className="w-5 h-5 text-text-secondary" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div>
                        <label className="label">Título *</label>
                        <input
                            type="text"
                            required
                            value={formData.titulo}
                            onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                            placeholder="Ej: Conferencia de Innovación Tecnológica"
                            className="input"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="label">Clasificación *</label>
                            <select
                                value={formData.clasificacion}
                                onChange={(e) => setFormData({ ...formData, clasificacion: e.target.value })}
                                className="input"
                            >
                                <option value="conferencia">Conferencia</option>
                                <option value="taller">Taller</option>
                                <option value="seminario">Seminario</option>
                            </select>
                        </div>

                        <div>
                            <label className="label">Ubicación</label>
                            <select
                                value={formData.ubicacion_id}
                                onChange={(e) => setFormData({ ...formData, ubicacion_id: e.target.value })}
                                className="input"
                            >
                                <option value="">Sin ubicación</option>
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
                            <label className="label">Fecha y Hora *</label>
                            <input
                                type="datetime-local"
                                required
                                value={formData.fecha_evento}
                                onChange={(e) => setFormData({ ...formData, fecha_evento: e.target.value })}
                                className="input"
                            />
                        </div>

                        <div>
                            <label className="label">Zona Horaria</label>
                            <select
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
                        <label className="label">Invitados</label>
                        <input
                            type="text"
                            value={formData.invitados}
                            onChange={(e) => setFormData({ ...formData, invitados: e.target.value })}
                            placeholder="Nombres separados por comas"
                            className="input"
                        />
                    </div>

                    <div>
                        <label className="label">Descripción</label>
                        <textarea
                            value={formData.descripcion}
                            onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                            rows={3}
                            placeholder="Describe los detalles del evento..."
                            className="input resize-none"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="label">Repetición</label>
                            <select
                                value={formData.recurrencia}
                                onChange={(e) => setFormData({ ...formData, recurrencia: e.target.value })}
                                className="input"
                            >
                                <option value="ninguna">No se repite</option>
                                <option value="diaria">Diariamente</option>
                                <option value="semanal">Semanalmente</option>
                                <option value="mensual">Mensualmente</option>
                                <option value="anual">Anualmente</option>
                            </select>
                        </div>

                        <div>
                            <label className="label">Recordatorio</label>
                            <select
                                value={formData.recordatorio}
                                onChange={(e) => setFormData({ ...formData, recordatorio: e.target.value })}
                                className="input"
                            >
                                <option value="ninguno">Sin recordatorio</option>
                                <option value="5min">5 minutos antes</option>
                                <option value="15min">15 minutos antes</option>
                                <option value="30min">30 minutos antes</option>
                                <option value="1hora">1 hora antes</option>
                                <option value="1dia">1 día antes</option>
                                <option value="1semana">1 semana antes</option>
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
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="btn-primary"
                        >
                            {saving ? 'Guardando...' : 'Guardar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

import { useState, useEffect, FormEvent } from 'react';
import { X, Calendar } from 'lucide-react';
import { supabase, Event, Location } from '../lib/supabase';

interface EventFormProps {
    event?: Event | null;
    onClose: () => void;
    onSave: () => void;
}

export default function EventForm({ event, onClose, onSave }: EventFormProps) {
    const [locations, setLocations] = useState<Location[]>([]);
    const [formData, setFormData] = useState({
        title: '',
        guests: '',
        event_date: '',
        timezone: 'America/Lima',
        description: '',
        recurrence: 'none',
        reminder: 'none',
        classification: 'conference',
        location_id: '',
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadLocations();
        if (event) {
            setFormData({
                title: event.title,
                guests: event.guests,
                event_date: event.event_date.slice(0, 16),
                timezone: event.timezone,
                description: event.description,
                recurrence: event.recurrence,
                reminder: event.reminder,
                classification: event.classification,
                location_id: event.location_id || '',
            });
        }
    }, [event]);

    const loadLocations = async () => {
        const { data } = await supabase.from('locations').select('*').order('title');
        setLocations((data as Location[]) || []);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const eventData = {
                ...formData,
                location_id: formData.location_id || null,
                updated_at: new Date().toISOString(),
            };

            if (event) {
                const { error } = await supabase
                    .from('events')
                    .update(eventData)
                    .eq('id', event.id);
                if (error) throw error;
            } else {
                const { error } = await supabase.from('events').insert([eventData]);
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
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="Ej: Conferencia de Innovación Tecnológica"
                            className="input"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="label">Clasificación *</label>
                            <select
                                value={formData.classification}
                                onChange={(e) => setFormData({ ...formData, classification: e.target.value })}
                                className="input"
                            >
                                <option value="conference">Conferencia</option>
                                <option value="workshop">Taller</option>
                                <option value="seminar">Seminario</option>
                            </select>
                        </div>

                        <div>
                            <label className="label">Ubicación</label>
                            <select
                                value={formData.location_id}
                                onChange={(e) => setFormData({ ...formData, location_id: e.target.value })}
                                className="input"
                            >
                                <option value="">Sin ubicación</option>
                                {locations.map((location) => (
                                    <option key={location.id} value={location.id}>
                                        {location.title}
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
                                value={formData.event_date}
                                onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                                className="input"
                            />
                        </div>

                        <div>
                            <label className="label">Zona Horaria</label>
                            <select
                                value={formData.timezone}
                                onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                                className="input"
                            >
                                <option value="America/Lima">Lima (PET)</option>
                                <option value="America/Bogota">Bogotá (COT)</option>
                                <option value="America/Mexico_City">Ciudad de México (CST)</option>
                                <option value="America/Argentina/Buenos_Aires">Buenos Aires (ART)</option>
                                <option value="America/New_York">Nueva York (EST)</option>
                                <option value="America/Los_Angeles">Los Ángeles (PST)</option>
                                <option value="Europe/Madrid">Madrid (CET)</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="label">Invitados</label>
                        <input
                            type="text"
                            value={formData.guests}
                            onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                            placeholder="Nombres separados por comas"
                            className="input"
                        />
                    </div>

                    <div>
                        <label className="label">Descripción</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={3}
                            placeholder="Describe los detalles del evento..."
                            className="input resize-none"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="label">Repetición</label>
                            <select
                                value={formData.recurrence}
                                onChange={(e) => setFormData({ ...formData, recurrence: e.target.value })}
                                className="input"
                            >
                                <option value="none">No se repite</option>
                                <option value="daily">Diariamente</option>
                                <option value="weekly">Semanalmente</option>
                                <option value="monthly">Mensualmente</option>
                                <option value="yearly">Anualmente</option>
                            </select>
                        </div>

                        <div>
                            <label className="label">Recordatorio</label>
                            <select
                                value={formData.reminder}
                                onChange={(e) => setFormData({ ...formData, reminder: e.target.value })}
                                className="input"
                            >
                                <option value="none">Sin recordatorio</option>
                                <option value="5min">5 minutos antes</option>
                                <option value="15min">15 minutos antes</option>
                                <option value="30min">30 minutos antes</option>
                                <option value="1hour">1 hora antes</option>
                                <option value="1day">1 día antes</option>
                                <option value="1week">1 semana antes</option>
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

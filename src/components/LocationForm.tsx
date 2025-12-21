import { useState, useEffect, FormEvent } from 'react';
import { X, MapPin } from 'lucide-react';
import { supabase, Ubicacion } from '../lib/supabase';

interface LocationFormProps {
    location?: Ubicacion | null;
    onClose: () => void;
    onSave: () => void;
}

declare global {
    interface Window {
        google: typeof google;
    }
}

export default function LocationForm({ location, onClose, onSave }: LocationFormProps) {
    const [formData, setFormData] = useState({
        titulo: '',
        direccion: '',
        latitud: '',
        longitud: '',
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (location) {
            setFormData({
                titulo: location.titulo,
                direccion: location.direccion,
                latitud: location.latitud?.toString() || '',
                longitud: location.longitud?.toString() || '',
            });
        }
    }, [location]);

    // Initialize Google Map
    useEffect(() => {
        const initMap = () => {
            const mapElement = document.getElementById('location-map');
            if (!mapElement || !window.google) return;

            // Coordenadas de la UTE Quito por defecto
            const lat = formData.latitud ? parseFloat(formData.latitud) : -0.2105;
            const lng = formData.longitud ? parseFloat(formData.longitud) : -78.4876;

            const map = new window.google.maps.Map(mapElement, {
                center: { lat, lng },
                zoom: 15,
                styles: [
                    { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] }
                ],
            });

            const marker = new window.google.maps.Marker({
                position: { lat, lng },
                map,
                draggable: true,
            });

            // Update coordinates when marker is dragged
            marker.addListener('dragend', () => {
                const pos = marker.getPosition();
                if (pos) {
                    setFormData(prev => ({
                        ...prev,
                        latitud: pos.lat().toFixed(6),
                        longitud: pos.lng().toFixed(6),
                    }));
                }
            });

            // Update marker and coordinates when map is clicked
            map.addListener('click', (e: google.maps.MapMouseEvent) => {
                if (e.latLng) {
                    marker.setPosition(e.latLng);
                    setFormData(prev => ({
                        ...prev,
                        latitud: e.latLng!.lat().toFixed(6),
                        longitud: e.latLng!.lng().toFixed(6),
                    }));
                }
            });
        };

        // Check if Google Maps is loaded
        if (window.google) {
            initMap();
        } else {
            // Wait for Google Maps to load
            const checkGoogle = setInterval(() => {
                if (window.google) {
                    clearInterval(checkGoogle);
                    initMap();
                }
            }, 100);

            return () => clearInterval(checkGoogle);
        }
    }, [location]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const ubicacionData = {
                titulo: formData.titulo,
                direccion: formData.direccion,
                latitud: formData.latitud ? parseFloat(formData.latitud) : null,
                longitud: formData.longitud ? parseFloat(formData.longitud) : null,
                actualizado_en: new Date().toISOString(),
            };

            if (location) {
                const { error } = await supabase
                    .from('ubicaciones')
                    .update(ubicacionData)
                    .eq('id', location.id);
                if (error) throw error;
            } else {
                const { error } = await supabase.from('ubicaciones').insert([ubicacionData]);
                if (error) throw error;
            }

            onSave();
            onClose();
        } catch (error) {
            console.error('Error saving location:', error);
            alert('Error al guardar la ubicación');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content max-w-2xl" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-border-light">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-success-100 rounded-xl flex items-center justify-center">
                            <MapPin className="w-5 h-5 text-success" />
                        </div>
                        <h2 className="text-xl font-semibold text-text-primary">
                            {location ? 'Editar Ubicación' : 'Nueva Ubicación'}
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
                            placeholder="Ej: Auditorio Principal UTE"
                            className="input"
                        />
                    </div>

                    <div>
                        <label className="label">Dirección *</label>
                        <textarea
                            required
                            value={formData.direccion}
                            onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                            rows={2}
                            placeholder="Ej: Av. Mariscal Sucre y Mariana de Jesús, Quito"
                            className="input resize-none"
                        />
                    </div>

                    {/* Map */}
                    <div>
                        <label className="label">Ubicación en el Mapa</label>
                        <p className="text-xs text-text-muted mb-2">Haz clic en el mapa o arrastra el marcador para seleccionar la ubicación</p>
                        <div
                            id="location-map"
                            className="w-full h-48 rounded-xl bg-bg-main border border-border-light overflow-hidden"
                            style={{ minHeight: '200px' }}
                        >
                            <div className="w-full h-full flex items-center justify-center text-text-muted text-sm">
                                Cargando mapa...
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="label">Latitud</label>
                            <input
                                type="number"
                                step="any"
                                value={formData.latitud}
                                onChange={(e) => setFormData({ ...formData, latitud: e.target.value })}
                                placeholder="-0.2105"
                                className="input font-mono text-sm"
                            />
                        </div>

                        <div>
                            <label className="label">Longitud</label>
                            <input
                                type="number"
                                step="any"
                                value={formData.longitud}
                                onChange={(e) => setFormData({ ...formData, longitud: e.target.value })}
                                placeholder="-78.4876"
                                className="input font-mono text-sm"
                            />
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

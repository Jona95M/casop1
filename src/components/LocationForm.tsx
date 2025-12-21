import { useState, useEffect, FormEvent } from 'react';
import { X, MapPin } from 'lucide-react';
import { supabase, Location } from '../lib/supabase';

interface LocationFormProps {
    location?: Location | null;
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
        title: '',
        address: '',
        latitude: '',
        longitude: '',
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (location) {
            setFormData({
                title: location.title,
                address: location.address,
                latitude: location.latitude?.toString() || '',
                longitude: location.longitude?.toString() || '',
            });
        }
    }, [location]);

    // Initialize Google Map
    useEffect(() => {
        const initMap = () => {
            const mapElement = document.getElementById('location-map');
            if (!mapElement || !window.google) return;

            const lat = formData.latitude ? parseFloat(formData.latitude) : -0.2105;
            const lng = formData.longitude ? parseFloat(formData.longitude) : -78.4876;

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
                        latitude: pos.lat().toFixed(6),
                        longitude: pos.lng().toFixed(6),
                    }));
                }
            });

            // Update marker and coordinates when map is clicked
            map.addListener('click', (e: google.maps.MapMouseEvent) => {
                if (e.latLng) {
                    marker.setPosition(e.latLng);
                    setFormData(prev => ({
                        ...prev,
                        latitude: e.latLng!.lat().toFixed(6),
                        longitude: e.latLng!.lng().toFixed(6),
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
            const locationData = {
                title: formData.title,
                address: formData.address,
                latitude: formData.latitude ? parseFloat(formData.latitude) : null,
                longitude: formData.longitude ? parseFloat(formData.longitude) : null,
                updated_at: new Date().toISOString(),
            };

            if (location) {
                const { error } = await supabase
                    .from('locations')
                    .update(locationData)
                    .eq('id', location.id);
                if (error) throw error;
            } else {
                const { error } = await supabase.from('locations').insert([locationData]);
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
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="Ej: Auditorio Principal"
                            className="input"
                        />
                    </div>

                    <div>
                        <label className="label">Dirección *</label>
                        <textarea
                            required
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            rows={2}
                            placeholder="Ej: Av. Universidad 123, Lima"
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
                                value={formData.latitude}
                                onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                                placeholder="-12.0464"
                                className="input font-mono text-sm"
                            />
                        </div>

                        <div>
                            <label className="label">Longitud</label>
                            <input
                                type="number"
                                step="any"
                                value={formData.longitude}
                                onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                                placeholder="-77.0428"
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

import { useEffect, useState } from 'react';
import { MapPin, Plus, Edit2, Trash2, Search, Navigation } from 'lucide-react';
import { supabase, Location } from '../lib/supabase';

interface LocationsListProps {
  onCreateLocation: () => void;
  onEditLocation: (location: Location) => void;
}

export default function LocationsList({
  onCreateLocation,
  onEditLocation,
}: LocationsListProps) {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadLocations();
  }, []);

  const loadLocations = async () => {
    try {
      const { data, error } = await supabase
        .from('locations')
        .select('*')
        .order('title');

      if (error) throw error;
      setLocations((data as Location[]) || []);
    } catch (error) {
      console.error('Error loading locations:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteLocation = async (id: string) => {
    if (!confirm('¿Está seguro de eliminar esta ubicación?')) return;

    try {
      const { error } = await supabase.from('locations').delete().eq('id', id);
      if (error) throw error;
      setLocations(locations.filter((l) => l.id !== id));
    } catch (error) {
      console.error('Error deleting location:', error);
      alert('Error al eliminar la ubicación');
    }
  };

  const openInMaps = (lat: number, lng: number) => {
    window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
  };

  const filteredLocations = locations.filter(location =>
    location.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse-soft text-text-muted">Cargando ubicaciones...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Buscar ubicaciones..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-search w-full"
          />
        </div>

        <button onClick={onCreateLocation} className="btn-primary whitespace-nowrap">
          <Plus className="w-4 h-4" />
          Nueva Ubicación
        </button>
      </div>

      {/* Locations Grid */}
      {filteredLocations.length === 0 ? (
        <div className="card p-12 text-center">
          <MapPin className="w-16 h-16 mx-auto text-text-muted mb-4" />
          <h3 className="text-lg font-semibold text-text-primary mb-2">
            {searchTerm ? 'No se encontraron ubicaciones' : 'No hay ubicaciones registradas'}
          </h3>
          <p className="text-text-muted mb-6">
            {searchTerm
              ? 'Intenta con otros términos de búsqueda'
              : 'Comienza agregando tu primera ubicación'}
          </p>
          {!searchTerm && (
            <button onClick={onCreateLocation} className="btn-primary">
              <Plus className="w-4 h-4" />
              Crear Ubicación
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredLocations.map((location) => (
            <div
              key={location.id}
              className="card p-5 card-hover group"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-success to-success-600 rounded-xl flex items-center justify-center shadow-lg shadow-success/20">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-text-primary truncate group-hover:text-primary transition-colors">
                      {location.title}
                    </h3>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => onEditLocation(location)}
                    className="btn-icon text-primary hover:bg-primary-50"
                    title="Editar"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteLocation(location.id)}
                    className="btn-icon text-danger hover:bg-danger-50"
                    title="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Address */}
              <div className="space-y-3">
                <div className="flex items-start gap-2 text-sm text-text-secondary">
                  <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5 text-text-muted" />
                  <p className="line-clamp-2">{location.address}</p>
                </div>

                {/* Coordinates & Actions */}
                {location.latitude && location.longitude && (
                  <div className="flex items-center justify-between pt-3 border-t border-border-light">
                    <span className="text-xs text-text-muted font-mono">
                      {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                    </span>
                    <button
                      onClick={() => openInMaps(location.latitude!, location.longitude!)}
                      className="flex items-center gap-1 text-xs text-primary hover:text-primary-600 font-medium transition-colors"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      Ver en mapa
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import { useState, useEffect } from 'react';
import { MapPin, Plus, Edit2, Trash2, Search, ExternalLink, Navigation } from 'lucide-react';
import { supabase, Ubicacion } from '../lib/supabase';
import ConfirmDialog from './ConfirmDialog';
import { useTranslation } from '../context/TranslationContext';

interface LocationsListProps {
  onEdit: (location: Ubicacion) => void;
  onNew: () => void;
  refreshTrigger?: number;
}

export default function LocationsList({ onEdit, onNew, refreshTrigger }: LocationsListProps) {
  const [locations, setLocations] = useState<Ubicacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; locationId: string | null; locationTitle: string }>({
    isOpen: false,
    locationId: null,
    locationTitle: '',
  });
  const { t } = useTranslation();

  useEffect(() => {
    loadLocations();
  }, [refreshTrigger]);

  const loadLocations = async () => {
    try {
      const { data, error } = await supabase
        .from('ubicaciones')
        .select('*')
        .order('titulo');

      if (error) throw error;
      setLocations((data as Ubicacion[]) || []);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id: string, title: string) => {
    setDeleteConfirm({ isOpen: true, locationId: id, locationTitle: title });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm.locationId) return;

    try {
      const { error } = await supabase.from('ubicaciones').delete().eq('id', deleteConfirm.locationId);
      if (error) throw error;
      loadLocations();
    } catch (error) {
    } finally {
      setDeleteConfirm({ isOpen: false, locationId: null, locationTitle: '' });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm({ isOpen: false, locationId: null, locationTitle: '' });
  };

  const openInMaps = (lat: number | null, lng: number | null, title: string) => {
    if (lat && lng) {
      window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`, '_blank');
    } else {
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(title)}`, '_blank');
    }
  };

  const filteredLocations = locations.filter(location =>
    location.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.direccion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64" role="status" aria-label={t('Cargando...')}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" aria-hidden="true" />
          <input
            type="text"
            placeholder={t('Buscar ubicaciones...')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-search w-full"
            aria-label={t('Buscar ubicaciones...')}
          />
        </div>
        <button onClick={onNew} className="btn-primary">
          <Plus className="w-4 h-4" aria-hidden="true" />
          <span>{t('Nueva Ubicación')}</span>
        </button>
      </div>

      {/* Locations Grid */}
      {filteredLocations.length === 0 ? (
        <div className="card p-12 text-center">
          <MapPin className="w-12 h-12 text-text-muted mx-auto mb-4" aria-hidden="true" />
          <h3 className="text-lg font-medium text-text-primary mb-2">{t('No hay ubicaciones')}</h3>
          <p className="text-text-muted mb-4">{t('Comienza agregando tu primera ubicación')}</p>
          <button onClick={onNew} className="btn-primary mx-auto">
            <Plus className="w-4 h-4" aria-hidden="true" />
            <span>{t('Agregar Ubicación')}</span>
          </button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredLocations.map((location) => (
            <div key={location.id} className="card p-5 hover:shadow-card-hover transition-all duration-200">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-success-100 rounded-xl flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-success" aria-hidden="true" />
                  </div>
                  <h3 className="font-semibold text-text-primary">{location.titulo}</h3>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onEdit(location)}
                    className="btn-icon hover:bg-primary-50 hover:text-primary"
                    title={t('Editar')}
                    aria-label={`${t('Editar')} ${location.titulo}`}
                  >
                    <Edit2 className="w-4 h-4" aria-hidden="true" />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(location.id, location.titulo)}
                    className="btn-icon hover:bg-red-50 hover:text-red-500"
                    title={t('Eliminar')}
                    aria-label={`${t('Eliminar')} ${location.titulo}`}
                  >
                    <Trash2 className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              </div>

              <p className="text-sm text-text-secondary mb-3 line-clamp-2">{location.direccion}</p>

              {(location.latitud && location.longitud) && (
                <div className="flex items-center gap-2 text-xs text-text-muted mb-3">
                  <Navigation className="w-3 h-3" aria-hidden="true" />
                  <span className="font-mono">{location.latitud?.toFixed(4)}, {location.longitud?.toFixed(4)}</span>
                </div>
              )}

              <button
                onClick={() => openInMaps(location.latitud, location.longitud, location.titulo)}
                className="btn-secondary w-full text-sm"
              >
                <ExternalLink className="w-4 h-4" aria-hidden="true" />
                <span>{t('Ver en Maps')}</span>
              </button>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title={t('Eliminar Ubicación')}
        message={`${t('¿Estás seguro de que deseas eliminar')} "${deleteConfirm.locationTitle}"? ${t('Esta acción no se puede deshacer.')}`}
        confirmText={t('Eliminar')}
        cancelText={t('Cancelar')}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </div>
  );
}


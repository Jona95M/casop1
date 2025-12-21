import { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, Users, Filter, Plus, Edit2, Trash2, Tag } from 'lucide-react';
import { supabase, Evento, Ubicacion } from '../lib/supabase';

interface EventsListProps {
  onEdit: (event: Evento) => void;
  onNew: () => void;
  refreshTrigger?: number;
}

export default function EventsList({ onEdit, onNew, refreshTrigger }: EventsListProps) {
  const [events, setEvents] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClassification, setFilterClassification] = useState('all');

  useEffect(() => {
    loadEvents();
  }, [refreshTrigger]);

  const loadEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('eventos')
        .select('*, ubicacion:ubicaciones(*)')
        .order('fecha_evento', { ascending: true });

      if (error) throw error;
      setEvents((data as Evento[]) || []);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este evento?')) return;

    try {
      const { error } = await supabase.from('eventos').delete().eq('id', id);
      if (error) throw error;
      loadEvents();
    } catch (error) {
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-EC', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getClassificationBadge = (classification: string) => {
    const styles: Record<string, string> = {
      conferencia: 'badge-primary',
      taller: 'badge-success',
      seminario: 'badge-warning',
    };
    const labels: Record<string, string> = {
      conferencia: 'Conferencia',
      taller: 'Taller',
      seminario: 'Seminario',
    };
    return (
      <span className={`badge ${styles[classification] || 'badge-primary'}`}>
        {labels[classification] || classification}
      </span>
    );
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.descripcion?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterClassification === 'all' || event.clasificacion === filterClassification;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Buscar eventos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-search w-full"
            />
          </div>
          <div className="relative">
            <select
              value={filterClassification}
              onChange={(e) => setFilterClassification(e.target.value)}
              className="input pr-10 appearance-none cursor-pointer"
            >
              <option value="all">Todas las clasificaciones</option>
              <option value="conferencia">Conferencias</option>
              <option value="taller">Talleres</option>
              <option value="seminario">Seminarios</option>
            </select>
            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
          </div>
        </div>
        <button onClick={onNew} className="btn-primary">
          <Plus className="w-4 h-4" />
          <span>Nuevo Evento</span>
        </button>
      </div>

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <div className="card p-12 text-center">
          <Calendar className="w-12 h-12 text-text-muted mx-auto mb-4" />
          <h3 className="text-lg font-medium text-text-primary mb-2">No hay eventos</h3>
          <p className="text-text-muted mb-4">Comienza creando tu primer evento</p>
          <button onClick={onNew} className="btn-primary mx-auto">
            <Plus className="w-4 h-4" />
            <span>Crear Evento</span>
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredEvents.map((event) => (
            <div key={event.id} className="card p-5 hover:shadow-card-hover transition-all duration-200">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    {getClassificationBadge(event.clasificacion)}
                    <h3 className="font-semibold text-text-primary truncate">{event.titulo}</h3>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary mb-3">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-primary" />
                      <span>{formatDate(event.fecha_evento)}</span>
                    </div>
                    {event.ubicacion && (
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-success" />
                        <span>{event.ubicacion.titulo}</span>
                      </div>
                    )}
                    {event.invitados && (
                      <div className="flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-warning" />
                        <span className="truncate max-w-[200px]">{event.invitados}</span>
                      </div>
                    )}
                  </div>

                  {event.descripcion && (
                    <p className="text-sm text-text-muted line-clamp-2">{event.descripcion}</p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onEdit(event)}
                    className="btn-icon hover:bg-primary-50 hover:text-primary"
                    title="Editar"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(event.id)}
                    className="btn-icon hover:bg-red-50 hover:text-red-500"
                    title="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

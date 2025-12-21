import { useEffect, useState } from 'react';
import { Calendar, MapPin, Clock, Plus, Edit2, Trash2, Search, Filter } from 'lucide-react';
import { supabase, Event } from '../lib/supabase';

interface EventsListProps {
  onCreateEvent: () => void;
  onEditEvent: (event: Event) => void;
}

export default function EventsList({ onCreateEvent, onEditEvent }: EventsListProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClassification, setFilterClassification] = useState<string>('all');

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          location:locations(*)
        `)
        .order('event_date', { ascending: true });

      if (error) throw error;
      setEvents((data as Event[]) || []);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteEvent = async (id: string) => {
    if (!confirm('¿Está seguro de eliminar este evento?')) return;

    try {
      const { error } = await supabase.from('events').delete().eq('id', id);
      if (error) throw error;
      setEvents(events.filter(e => e.id !== id));
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Error al eliminar el evento');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getClassificationBadge = (classification: string) => {
    switch (classification) {
      case 'conference':
        return 'badge-primary';
      case 'workshop':
        return 'badge-success';
      case 'seminar':
        return 'badge-warning';
      default:
        return 'bg-gray-100 text-text-secondary';
    }
  };

  const getClassificationLabel = (classification: string) => {
    switch (classification) {
      case 'conference':
        return 'Conferencia';
      case 'workshop':
        return 'Taller';
      case 'seminar':
        return 'Seminario';
      default:
        return classification;
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterClassification === 'all' || event.classification === filterClassification;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse-soft text-text-muted">Cargando eventos...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex flex-1 gap-3 w-full sm:w-auto">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              placeholder="Buscar eventos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-search w-full"
            />
          </div>

          {/* Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <select
              value={filterClassification}
              onChange={(e) => setFilterClassification(e.target.value)}
              className="input pl-10 pr-8 appearance-none cursor-pointer min-w-[140px]"
            >
              <option value="all">Todos</option>
              <option value="conference">Conferencias</option>
              <option value="workshop">Talleres</option>
              <option value="seminar">Seminarios</option>
            </select>
          </div>
        </div>

        <button onClick={onCreateEvent} className="btn-primary whitespace-nowrap">
          <Plus className="w-4 h-4" />
          Nuevo Evento
        </button>
      </div>

      {/* Events List */}
      {filteredEvents.length === 0 ? (
        <div className="card p-12 text-center">
          <Calendar className="w-16 h-16 mx-auto text-text-muted mb-4" />
          <h3 className="text-lg font-semibold text-text-primary mb-2">
            {searchTerm || filterClassification !== 'all'
              ? 'No se encontraron eventos'
              : 'No hay eventos registrados'}
          </h3>
          <p className="text-text-muted mb-6">
            {searchTerm || filterClassification !== 'all'
              ? 'Intenta con otros términos de búsqueda'
              : 'Comienza creando tu primer evento'}
          </p>
          {!searchTerm && filterClassification === 'all' && (
            <button onClick={onCreateEvent} className="btn-primary">
              <Plus className="w-4 h-4" />
              Crear Evento
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className="card p-5 card-hover group"
            >
              <div className="flex gap-4">
                {/* Date Card */}
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-600 rounded-xl flex flex-col items-center justify-center text-white flex-shrink-0 shadow-lg shadow-primary/20">
                  <span className="text-xs font-medium uppercase">
                    {new Date(event.event_date).toLocaleDateString('es-ES', { month: 'short' })}
                  </span>
                  <span className="text-2xl font-bold">
                    {new Date(event.event_date).getDate()}
                  </span>
                </div>

                {/* Event Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-text-primary truncate group-hover:text-primary transition-colors">
                          {event.title}
                        </h3>
                        <span className={`badge ${getClassificationBadge(event.classification)}`}>
                          {getClassificationLabel(event.classification)}
                        </span>
                      </div>
                      <p className="text-text-secondary text-sm line-clamp-2 mb-3">
                        {event.description}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onEditEvent(event)}
                        className="btn-icon text-primary hover:bg-primary-50"
                        title="Editar"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteEvent(event.id)}
                        className="btn-icon text-danger hover:bg-danger-50"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Meta Info */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-text-muted">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      {formatTime(event.event_date)}
                    </span>
                    {event.location && (
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4" />
                        {event.location.title}
                      </span>
                    )}
                    {event.guests && (
                      <span className="flex items-center gap-1.5">
                        <span className="font-medium text-text-secondary">Invitados:</span>
                        {event.guests}
                      </span>
                    )}
                    {event.reminder !== 'none' && (
                      <span className="badge bg-primary-50 text-primary-700">
                        Recordatorio: {event.reminder}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

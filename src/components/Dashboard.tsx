import { useEffect, useState } from 'react';
import { Calendar, MapPin, Clock, ArrowRight, Plus, Sparkles } from 'lucide-react';
import { supabase, Evento, Ubicacion, Contacto } from '../lib/supabase';
import StatsCards from './StatsCards';

interface DashboardProps {
    onNavigate: (tab: 'events' | 'locations' | 'contacts') => void;
    onCreateEvent: () => void;
}

export default function Dashboard({ onNavigate, onCreateEvent }: DashboardProps) {
    const [events, setEvents] = useState<Evento[]>([]);
    const [locations, setLocations] = useState<Ubicacion[]>([]);
    const [contacts, setContacts] = useState<Contacto[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [eventsRes, locationsRes, contactsRes] = await Promise.all([
                supabase.from('eventos').select('*, ubicacion:ubicaciones(*)').order('fecha_evento', { ascending: true }),
                supabase.from('ubicaciones').select('*'),
                supabase.from('contactos').select('*'),
            ]);

            setEvents((eventsRes.data as Evento[]) || []);
            setLocations((locationsRes.data as Ubicacion[]) || []);
            setContacts((contactsRes.data as Contacto[]) || []);
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-EC', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('es-EC', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    // Get upcoming events (next 5)
    const upcomingEvents = events
        .filter(e => new Date(e.fecha_evento) > new Date())
        .slice(0, 5);

    // Get recent activities (last 5 events created)
    const recentActivities = [...events]
        .sort((a, b) => new Date(b.creado_en).getTime() - new Date(a.creado_en).getTime())
        .slice(0, 4);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-pulse-soft text-text-muted">Cargando...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Stats Cards */}
            <StatsCards events={events} locations={locations} contacts={contacts} />

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Upcoming Events - Takes 2 columns */}
                <div className="lg:col-span-2 card p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-text-primary">Próximos Eventos</h2>
                        <button
                            onClick={() => onNavigate('events')}
                            className="flex items-center gap-1 text-sm text-primary hover:text-primary-600 font-medium transition-colors"
                        >
                            Ver todos <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>

                    {upcomingEvents.length === 0 ? (
                        <div className="text-center py-12">
                            <Calendar className="w-12 h-12 mx-auto text-text-muted mb-3" />
                            <p className="text-text-secondary mb-4">No hay eventos próximos</p>
                            <button onClick={onCreateEvent} className="btn-primary">
                                <Plus className="w-4 h-4" />
                                Crear Evento
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {upcomingEvents.map((event) => (
                                <div key={event.id} className="flex items-center gap-4 p-4 rounded-xl bg-bg-main hover:bg-primary-50/50 transition-colors cursor-pointer group">
                                    {/* Date Badge */}
                                    <div className="w-14 h-14 bg-primary rounded-xl flex flex-col items-center justify-center text-white flex-shrink-0">
                                        <span className="text-xs font-medium uppercase">
                                            {new Date(event.fecha_evento).toLocaleDateString('es-EC', { month: 'short' })}
                                        </span>
                                        <span className="text-xl font-bold">
                                            {new Date(event.fecha_evento).getDate()}
                                        </span>
                                    </div>

                                    {/* Event Info */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-text-primary truncate group-hover:text-primary transition-colors">
                                            {event.titulo}
                                        </h3>
                                        <div className="flex items-center gap-4 mt-1 text-sm text-text-muted">
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3.5 h-3.5" />
                                                {formatTime(event.fecha_evento)}
                                            </span>
                                            {event.ubicacion && (
                                                <span className="flex items-center gap-1 truncate">
                                                    <MapPin className="w-3.5 h-3.5" />
                                                    {event.ubicacion.titulo}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Classification Badge */}
                                    <span className={`badge ${event.clasificacion === 'conferencia' ? 'badge-primary' :
                                        event.clasificacion === 'taller' ? 'badge-success' :
                                            'badge-warning'
                                        }`}>
                                        {event.clasificacion === 'conferencia' ? 'Conferencia' :
                                            event.clasificacion === 'taller' ? 'Taller' : 'Seminario'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Promo Card & Recent Activities */}
                <div className="space-y-6">
                    {/* Promo Card */}
                    <div className="card overflow-hidden">
                        <div className="bg-gradient-to-br from-primary to-primary-700 p-6 text-white">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="badge bg-white/20 text-white border-0">
                                    <Sparkles className="w-3 h-3 mr-1" />
                                    UTE
                                </span>
                            </div>
                            <h3 className="text-xl font-bold mb-2">
                                Sistema de Gestión de Eventos
                            </h3>
                            <p className="text-primary-100 text-sm mb-4">
                                Universidad Técnica Equinoccial - Gestiona conferencias, talleres y seminarios.
                            </p>
                            <button
                                onClick={onCreateEvent}
                                className="w-full bg-white text-primary font-semibold py-2.5 rounded-xl hover:bg-primary-50 transition-colors"
                            >
                                Crear Nuevo Evento
                            </button>
                        </div>
                    </div>

                    {/* Recent Activities */}
                    <div className="card p-6">
                        <h2 className="text-lg font-semibold text-text-primary mb-4">Actividad Reciente</h2>
                        <div className="space-y-4">
                            {recentActivities.length === 0 ? (
                                <p className="text-text-muted text-sm text-center py-4">No hay actividad reciente</p>
                            ) : (
                                recentActivities.map((activity) => (
                                    <div key={activity.id} className="flex items-start gap-3">
                                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-text-primary font-medium truncate">
                                                {activity.titulo}
                                            </p>
                                            <p className="text-xs text-text-muted">
                                                {formatDate(activity.creado_en)}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

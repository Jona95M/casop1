import { Calendar, MapPin, Users, TrendingUp } from 'lucide-react';
import { Event, Location, Contact } from '../lib/supabase';

interface StatsCardsProps {
    events: Event[];
    locations: Location[];
    contacts: Contact[];
}

export default function StatsCards({ events, locations, contacts }: StatsCardsProps) {
    // Calculate upcoming events (events in the future)
    const upcomingEvents = events.filter(e => new Date(e.event_date) > new Date()).length;

    const stats = [
        {
            label: 'Total Eventos',
            value: events.length,
            change: '+12%',
            icon: Calendar,
            iconBg: 'bg-primary-100',
            iconColor: 'text-primary',
            changeColor: 'text-success',
        },
        {
            label: 'Ubicaciones',
            value: locations.length,
            change: '+5%',
            icon: MapPin,
            iconBg: 'bg-success-100',
            iconColor: 'text-success',
            changeColor: 'text-success',
        },
        {
            label: 'Contactos',
            value: contacts.length,
            change: '+8%',
            icon: Users,
            iconBg: 'bg-warning-100',
            iconColor: 'text-warning-600',
            changeColor: 'text-success',
        },
        {
            label: 'Próximos Eventos',
            value: upcomingEvents,
            change: 'Esta semana',
            icon: TrendingUp,
            iconBg: 'bg-danger-100',
            iconColor: 'text-danger',
            changeColor: 'text-text-muted',
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {stats.map((stat, index) => {
                const Icon = stat.icon;

                return (
                    <div key={index} className="stats-card">
                        <div className={`stats-icon ${stat.iconBg}`}>
                            <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm text-text-muted font-medium">{stat.label}</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-bold text-text-primary">
                                    {stat.value.toLocaleString()}
                                </span>
                                <span className={`text-xs font-medium ${stat.changeColor}`}>
                                    {stat.change}
                                </span>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

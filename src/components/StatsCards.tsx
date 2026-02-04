import { Calendar, MapPin, Users, TrendingUp } from 'lucide-react';
import { Evento, Ubicacion, Contacto } from '../lib/supabase';
import { useTranslation } from '../context/TranslationContext';

interface StatsCardsProps {
    events: Evento[];
    locations: Ubicacion[];
    contacts: Contacto[];
}

export default function StatsCards({ events, locations, contacts }: StatsCardsProps) {
    const { t } = useTranslation();
    const upcomingEvents = events.filter(e => new Date(e.fecha_evento) > new Date()).length;

    const stats = [
        {
            label: t('Total Eventos'),
            value: events.length,
            change: '+12%',
            icon: Calendar,
            iconBg: 'bg-primary-50',
            iconColor: 'text-primary-700',
            changeColor: 'text-success',
        },
        {
            label: t('Total Ubicaciones'),
            value: locations.length,
            change: '+5%',
            icon: MapPin,
            iconBg: 'bg-success-50',
            iconColor: 'text-success-700',
            changeColor: 'text-success',
        },
        {
            label: t('Total Contactos'),
            value: contacts.length,
            change: '+8%',
            icon: Users,
            iconBg: 'bg-warning-50',
            iconColor: 'text-warning-700',
            changeColor: 'text-success',
        },
        {
            label: t('Próximos Eventos'),
            value: upcomingEvents,
            change: t('Esta semana'),
            icon: TrendingUp,
            iconBg: 'bg-purple-50',
            iconColor: 'text-purple-800', // Darker for better contrast
            changeColor: 'text-purple-800', // Darker for better contrast
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5" role="region" aria-label={t('Estadísticas')}>
            {stats.map((stat, index) => {
                const Icon = stat.icon;

                return (
                    <div key={index} className="stats-card">
                        <div className={`stats-icon ${stat.iconBg}`}>
                            <Icon className={`w-6 h-6 ${stat.iconColor}`} aria-hidden="true" />
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


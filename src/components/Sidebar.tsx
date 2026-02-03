import {
    Calendar,
    MapPin,
    Users,
    LayoutDashboard,
    Settings,
    HelpCircle,
    LogOut,
    ChevronLeft
} from 'lucide-react';
import { useTranslation } from '../context/TranslationContext';

type Tab = 'dashboard' | 'events' | 'locations' | 'contacts' | 'settings' | 'help';

interface SidebarProps {
    activeTab: Tab;
    onTabChange: (tab: Tab) => void;
    isCollapsed: boolean;
    onToggleCollapse: () => void;
}

const menuItemsConfig = [
    { id: 'dashboard' as Tab, labelKey: 'Inicio', icon: LayoutDashboard },
    { id: 'events' as Tab, labelKey: 'Eventos', icon: Calendar },
    { id: 'locations' as Tab, labelKey: 'Ubicaciones', icon: MapPin },
    { id: 'contacts' as Tab, labelKey: 'Contactos', icon: Users },
];

const bottomMenuItemsConfig = [
    { id: 'settings' as Tab, labelKey: 'Configuración', icon: Settings },
    { id: 'help' as Tab, labelKey: 'Ayuda', icon: HelpCircle },
];

export default function Sidebar({ activeTab, onTabChange, isCollapsed, onToggleCollapse }: SidebarProps) {
    const { t } = useTranslation();

    return (
        <aside
            className={`fixed left-0 top-0 h-screen bg-bg-sidebar border-r border-border-light shadow-sidebar flex flex-col transition-all duration-300 z-40 ${isCollapsed ? 'w-20' : 'w-64'
                }`}
            role="navigation"
            aria-label={t('Navegación principal')}
        >
            {/* Logo Section */}
            <div className="h-16 flex items-center justify-between px-4 border-b border-border-light">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary/25">
                        <Calendar className="w-5 h-5 text-white" aria-hidden="true" />
                    </div>
                    {!isCollapsed && (
                        <div className="animate-fade-in">
                            <h1 className="font-bold text-text-primary text-lg">{t('CASOPRACTICO1')}</h1>
                            <p className="text-xs text-text-muted">{t('Gestión de Eventos')}</p>
                        </div>
                    )}
                </div>
                <button
                    onClick={onToggleCollapse}
                    className={`btn-icon hover:bg-gray-100 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}
                    aria-label={isCollapsed ? t('Expandir menú') : t('Colapsar menú')}
                >
                    <ChevronLeft className="w-5 h-5 text-text-secondary" aria-hidden="true" />
                </button>
            </div>

            {/* Main Navigation */}
            <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto" aria-label={t('Menú principal')}>
                {menuItemsConfig.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    const label = t(item.labelKey);

                    return (
                        <button
                            key={item.id}
                            onClick={() => onTabChange(item.id)}
                            className={`w-full ${isActive ? 'nav-item-active' : 'nav-item'} ${isCollapsed ? 'justify-center px-3' : ''}`}
                            title={isCollapsed ? label : undefined}
                            aria-current={isActive ? 'page' : undefined}
                        >
                            <Icon className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
                            {!isCollapsed && <span className="animate-fade-in">{label}</span>}
                        </button>
                    );
                })}
            </nav>

            {/* Bottom Navigation */}
            <div className="px-3 py-4 border-t border-border-light space-y-1.5">
                {bottomMenuItemsConfig.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    const label = t(item.labelKey);

                    return (
                        <button
                            key={item.id}
                            onClick={() => onTabChange(item.id)}
                            className={`w-full ${isActive ? 'nav-item-active' : 'nav-item'} ${isCollapsed ? 'justify-center px-3' : ''}`}
                            title={isCollapsed ? label : undefined}
                            aria-current={isActive ? 'page' : undefined}
                        >
                            <Icon className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
                            {!isCollapsed && <span className="animate-fade-in">{label}</span>}
                        </button>
                    );
                })}

                {/* Logout Button */}
                <button
                    className={`w-full nav-item text-danger-500 hover:bg-danger-50 hover:text-danger-600 ${isCollapsed ? 'justify-center px-3' : ''}`}
                    title={isCollapsed ? t('Cerrar Sesión') : undefined}
                    aria-label={t('Cerrar Sesión')}
                >
                    <LogOut className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
                    {!isCollapsed && <span className="animate-fade-in">{t('Cerrar Sesión')}</span>}
                </button>
            </div>
        </aside>
    );
}

export type { Tab };


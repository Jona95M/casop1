import { Search, Bell, User } from 'lucide-react';

interface HeaderProps {
    title: string;
    subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
    return (
        <header className="h-16 bg-bg-sidebar border-b border-border-light flex items-center justify-between px-6">
            {/* Page Title */}
            <div>
                <h1 className="text-xl font-semibold text-text-primary">{title}</h1>
                {subtitle && (
                    <p className="text-sm text-text-muted">{subtitle}</p>
                )}
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-4">
                {/* Search Bar */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input
                        type="text"
                        placeholder="Buscar..."
                        className="input-search w-64"
                    />
                </div>

                {/* Notifications */}
                <button className="btn-icon hover:bg-gray-100 relative">
                    <Bell className="w-5 h-5 text-text-secondary" />
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-primary rounded-full border-2 border-white"></span>
                </button>

                {/* User Profile */}
                <div className="flex items-center gap-3 pl-4 border-l border-border-light">
                    <div className="w-9 h-9 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                    </div>
                    <div className="hidden md:block">
                        <p className="text-sm font-medium text-text-primary">Admin</p>
                        <p className="text-xs text-text-muted">Administrador</p>
                    </div>
                </div>
            </div>
        </header>
    );
}

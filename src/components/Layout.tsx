import { ReactNode, useState } from 'react';
import Sidebar, { Tab } from './Sidebar';
import Header from './Header';

interface LayoutProps {
  children: ReactNode;
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const pageTitles: Record<Tab, { title: string; subtitle: string }> = {
  dashboard: { title: 'Dashboard', subtitle: 'Bienvenido al Sistema de Gestión de Eventos' },
  events: { title: 'Eventos', subtitle: 'Gestiona conferencias, talleres y seminarios' },
  locations: { title: 'Ubicaciones', subtitle: 'Administra los lugares de tus eventos' },
  contacts: { title: 'Contactos', subtitle: 'Directorio de contactos e invitados' },
  settings: { title: 'Configuración', subtitle: 'Personaliza tu experiencia' },
  help: { title: 'Ayuda', subtitle: 'Centro de soporte y documentación' },
};

export default function Layout({ children, activeTab, onTabChange }: LayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const currentPage = pageTitles[activeTab];

  return (
    <div className="min-h-screen bg-bg-main">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={onTabChange}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content Area */}
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
        {/* Header */}
        <Header title={currentPage.title} subtitle={currentPage.subtitle} />

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export type { Tab };

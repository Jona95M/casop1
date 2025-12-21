import { useState } from 'react';
import Layout, { Tab } from './components/Layout';
import Dashboard from './components/Dashboard';
import EventsList from './components/EventsList';
import EventForm from './components/EventForm';
import LocationsList from './components/LocationsList';
import LocationForm from './components/LocationForm';
import ContactsList from './components/ContactsList';
import ContactForm from './components/ContactForm';
import { Evento, Ubicacion, Contacto } from './lib/supabase';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [showEventForm, setShowEventForm] = useState(false);
  const [showLocationForm, setShowLocationForm] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Evento | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Ubicacion | null>(null);
  const [selectedContact, setSelectedContact] = useState<Contacto | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleCreateEvent = () => {
    setSelectedEvent(null);
    setShowEventForm(true);
  };

  const handleEditEvent = (event: Evento) => {
    setSelectedEvent(event);
    setShowEventForm(true);
  };

  const handleCloseEventForm = () => {
    setShowEventForm(false);
    setSelectedEvent(null);
  };

  const handleSaveEvent = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const handleCreateLocation = () => {
    setSelectedLocation(null);
    setShowLocationForm(true);
  };

  const handleEditLocation = (location: Ubicacion) => {
    setSelectedLocation(location);
    setShowLocationForm(true);
  };

  const handleCloseLocationForm = () => {
    setShowLocationForm(false);
    setSelectedLocation(null);
  };

  const handleSaveLocation = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const handleCreateContact = () => {
    setSelectedContact(null);
    setShowContactForm(true);
  };

  const handleEditContact = (contact: Contacto) => {
    setSelectedContact(contact);
    setShowContactForm(true);
  };

  const handleCloseContactForm = () => {
    setShowContactForm(false);
    setSelectedContact(null);
  };

  const handleSaveContact = () => {
    setRefreshKey((prev) => prev + 1);
  };


  const handleNavigate = (tab: 'events' | 'locations' | 'contacts') => {
    setActiveTab(tab);
  };

  return (
    <Layout
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {activeTab === 'dashboard' && (
        <Dashboard onNavigate={handleNavigate} onCreateEvent={handleCreateEvent} />
      )}

      {activeTab === 'events' && (
        <EventsList
          onEdit={handleEditEvent}
          onNew={handleCreateEvent}
          refreshTrigger={refreshKey}
        />
      )}

      {activeTab === 'locations' && (
        <LocationsList
          onEdit={handleEditLocation}
          onNew={handleCreateLocation}
          refreshTrigger={refreshKey}
        />
      )}

      {activeTab === 'contacts' && (
        <ContactsList
          onEdit={handleEditContact}
          onNew={handleCreateContact}
          refreshTrigger={refreshKey}
        />
      )}

      {activeTab === 'settings' && (
        <div className="card p-8 text-center">
          <h2 className="text-xl font-semibold text-text-primary mb-2">Configuración</h2>
          <p className="text-text-muted">Próximamente...</p>
        </div>
      )}

      {activeTab === 'help' && (
        <div className="card p-8 text-center">
          <h2 className="text-xl font-semibold text-text-primary mb-2">Centro de Ayuda</h2>
          <p className="text-text-muted">Próximamente...</p>
        </div>
      )}

      {/* Modals */}
      {showEventForm && (
        <EventForm
          event={selectedEvent}
          onClose={handleCloseEventForm}
          onSave={handleSaveEvent}
        />
      )}

      {showLocationForm && (
        <LocationForm
          location={selectedLocation}
          onClose={handleCloseLocationForm}
          onSave={handleSaveLocation}
        />
      )}

      {showContactForm && (
        <ContactForm
          contact={selectedContact}
          onClose={handleCloseContactForm}
          onSave={handleSaveContact}
        />
      )}
    </Layout>
  );
}

export default App;

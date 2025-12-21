import { useEffect, useState } from 'react';
import { Users, Plus, Edit2, Trash2, Mail, Phone, User, Search } from 'lucide-react';
import { supabase, Contact } from '../lib/supabase';

interface ContactsListProps {
  onCreateContact: () => void;
  onEditContact: (contact: Contact) => void;
}

export default function ContactsList({
  onCreateContact,
  onEditContact,
}: ContactsListProps) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('full_name');

      if (error) throw error;
      setContacts((data as Contact[]) || []);
    } catch (error) {
      console.error('Error loading contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteContact = async (id: string) => {
    if (!confirm('¿Está seguro de eliminar este contacto?')) return;

    try {
      const { error } = await supabase.from('contacts').delete().eq('id', id);
      if (error) throw error;
      setContacts(contacts.filter((c) => c.id !== id));
    } catch (error) {
      console.error('Error deleting contact:', error);
      alert('Error al eliminar el contacto');
    }
  };

  const filteredContacts = contacts.filter(contact =>
    contact.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (contact.phone && contact.phone.includes(searchTerm))
  );

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const getRandomColor = (name: string) => {
    const colors = [
      'from-primary to-primary-600',
      'from-success to-success-600',
      'from-warning to-warning-600',
      'from-danger to-danger-600',
      'from-purple-500 to-purple-700',
      'from-pink-500 to-pink-700',
      'from-indigo-500 to-indigo-700',
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse-soft text-text-muted">Cargando contactos...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Buscar contactos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-search w-full"
          />
        </div>

        <button onClick={onCreateContact} className="btn-primary whitespace-nowrap">
          <Plus className="w-4 h-4" />
          Nuevo Contacto
        </button>
      </div>

      {/* Contacts Grid */}
      {filteredContacts.length === 0 ? (
        <div className="card p-12 text-center">
          <Users className="w-16 h-16 mx-auto text-text-muted mb-4" />
          <h3 className="text-lg font-semibold text-text-primary mb-2">
            {searchTerm ? 'No se encontraron contactos' : 'No hay contactos registrados'}
          </h3>
          <p className="text-text-muted mb-6">
            {searchTerm
              ? 'Intenta con otros términos de búsqueda'
              : 'Comienza agregando tu primer contacto'}
          </p>
          {!searchTerm && (
            <button onClick={onCreateContact} className="btn-primary">
              <Plus className="w-4 h-4" />
              Crear Contacto
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredContacts.map((contact) => (
            <div
              key={contact.id}
              className="card p-5 card-hover group"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {contact.photo_url ? (
                    <img
                      src={contact.photo_url}
                      alt={contact.full_name}
                      className="w-12 h-12 rounded-xl object-cover shadow-lg"
                    />
                  ) : (
                    <div className={`w-12 h-12 bg-gradient-to-br ${getRandomColor(contact.full_name)} rounded-xl flex items-center justify-center shadow-lg`}>
                      <span className="text-white font-semibold text-sm">
                        {getInitials(contact.full_name)}
                      </span>
                    </div>
                  )}
                  <div className="min-w-0">
                    <h3 className="font-semibold text-text-primary truncate group-hover:text-primary transition-colors">
                      {contact.salutation} {contact.full_name}
                    </h3>
                    {contact.identification_number && (
                      <p className="text-xs text-text-muted">
                        ID: {contact.identification_number}
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => onEditContact(contact)}
                    className="btn-icon text-primary hover:bg-primary-50"
                    title="Editar"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteContact(contact.id)}
                    className="btn-icon text-danger hover:bg-danger-50"
                    title="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-2">
                <a
                  href={`mailto:${contact.email}`}
                  className="flex items-center gap-2 text-sm text-text-secondary hover:text-primary transition-colors group/link"
                >
                  <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center group-hover/link:bg-primary-100 transition-colors">
                    <Mail className="w-4 h-4 text-primary" />
                  </div>
                  <span className="truncate">{contact.email}</span>
                </a>

                {contact.phone && (
                  <a
                    href={`tel:${contact.phone}`}
                    className="flex items-center gap-2 text-sm text-text-secondary hover:text-primary transition-colors group/link"
                  >
                    <div className="w-8 h-8 bg-success-50 rounded-lg flex items-center justify-center group-hover/link:bg-success-100 transition-colors">
                      <Phone className="w-4 h-4 text-success" />
                    </div>
                    <span>{contact.phone}</span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

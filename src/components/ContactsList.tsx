import { useState, useEffect } from 'react';
import { User, Plus, Edit2, Trash2, Search, Mail, Phone } from 'lucide-react';
import { supabase, Contacto } from '../lib/supabase';

interface ContactsListProps {
  onEdit: (contact: Contacto) => void;
  onNew: () => void;
  refreshTrigger?: number;
}

export default function ContactsList({ onEdit, onNew, refreshTrigger }: ContactsListProps) {
  const [contacts, setContacts] = useState<Contacto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadContacts();
  }, [refreshTrigger]);

  const loadContacts = async () => {
    try {
      const { data, error } = await supabase
        .from('contactos')
        .select('*')
        .order('nombre_completo');

      if (error) throw error;
      setContacts((data as Contacto[]) || []);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este contacto?')) return;

    try {
      const { error } = await supabase.from('contactos').delete().eq('id', id);
      if (error) throw error;
      loadContacts();
    } catch (error) {
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const getAvatarGradient = (name: string) => {
    const gradients = [
      'from-blue-400 to-blue-600',
      'from-purple-400 to-purple-600',
      'from-pink-400 to-pink-600',
      'from-emerald-400 to-emerald-600',
      'from-orange-400 to-orange-600',
      'from-cyan-400 to-cyan-600',
    ];
    const index = name.charCodeAt(0) % gradients.length;
    return gradients[index];
  };

  const filteredContacts = contacts.filter(contact =>
    contact.nombre_completo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.correo_electronico.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Buscar contactos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-search w-full"
          />
        </div>
        <button onClick={onNew} className="btn-primary">
          <Plus className="w-4 h-4" />
          <span>Nuevo Contacto</span>
        </button>
      </div>

      {/* Contacts Grid */}
      {filteredContacts.length === 0 ? (
        <div className="card p-12 text-center">
          <User className="w-12 h-12 text-text-muted mx-auto mb-4" />
          <h3 className="text-lg font-medium text-text-primary mb-2">No hay contactos</h3>
          <p className="text-text-muted mb-4">Comienza agregando tu primer contacto</p>
          <button onClick={onNew} className="btn-primary mx-auto">
            <Plus className="w-4 h-4" />
            <span>Agregar Contacto</span>
          </button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredContacts.map((contact) => (
            <div key={contact.id} className="card p-5 hover:shadow-card-hover transition-all duration-200">
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className={`w-12 h-12 bg-gradient-to-br ${getAvatarGradient(contact.nombre_completo)} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  {contact.url_foto ? (
                    <img
                      src={contact.url_foto}
                      alt={contact.nombre_completo}
                      className="w-12 h-12 rounded-xl object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <span className="text-white font-semibold text-sm">
                      {getInitials(contact.nombre_completo)}
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-text-primary truncate">
                        {contact.salutacion} {contact.nombre_completo}
                      </h3>
                      {contact.numero_identificacion && (
                        <p className="text-xs text-text-muted">ID: {contact.numero_identificacion}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onEdit(contact)}
                        className="btn-icon hover:bg-primary-50 hover:text-primary"
                        title="Editar"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(contact.id)}
                        className="btn-icon hover:bg-red-50 hover:text-red-500"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-3 space-y-1.5">
                    <a
                      href={`mailto:${contact.correo_electronico}`}
                      className="flex items-center gap-2 text-sm text-text-secondary hover:text-primary transition-colors"
                    >
                      <Mail className="w-4 h-4 text-primary" />
                      <span className="truncate">{contact.correo_electronico}</span>
                    </a>
                    {contact.telefono && (
                      <a
                        href={`tel:${contact.telefono}`}
                        className="flex items-center gap-2 text-sm text-text-secondary hover:text-primary transition-colors"
                      >
                        <Phone className="w-4 h-4 text-success" />
                        <span>{contact.telefono}</span>
                      </a>
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

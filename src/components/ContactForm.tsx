import { useState, useEffect, FormEvent } from 'react';
import { X, User, Upload } from 'lucide-react';
import { supabase, Contact } from '../lib/supabase';

interface ContactFormProps {
  contact?: Contact | null;
  onClose: () => void;
  onSave: () => void;
}

export default function ContactForm({ contact, onClose, onSave }: ContactFormProps) {
  const [formData, setFormData] = useState({
    salutation: '',
    full_name: '',
    identification_number: '',
    email: '',
    phone: '',
    photo_url: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (contact) {
      setFormData({
        salutation: contact.salutation,
        full_name: contact.full_name,
        identification_number: contact.identification_number || '',
        email: contact.email,
        phone: contact.phone,
        photo_url: contact.photo_url,
      });
    }
  }, [contact]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const contactData = {
        ...formData,
        identification_number: formData.identification_number || null,
        updated_at: new Date().toISOString(),
      };

      if (contact) {
        const { error } = await supabase
          .from('contacts')
          .update(contactData)
          .eq('id', contact.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('contacts').insert([contactData]);
        if (error) throw error;
      }

      onSave();
      onClose();
    } catch (error) {
      console.error('Error saving contact:', error);
      alert('Error al guardar el contacto');
    } finally {
      setSaving(false);
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

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="sticky top-0 bg-white flex items-center justify-between px-6 py-4 border-b border-border-light z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-warning-100 rounded-xl flex items-center justify-center">
              <User className="w-5 h-5 text-warning-600" />
            </div>
            <h2 className="text-xl font-semibold text-text-primary">
              {contact ? 'Editar Contacto' : 'Nuevo Contacto'}
            </h2>
          </div>
          <button onClick={onClose} className="btn-icon hover:bg-gray-100">
            <X className="w-5 h-5 text-text-secondary" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Photo Preview */}
          <div className="flex justify-center">
            <div className="relative">
              {formData.photo_url ? (
                <img
                  src={formData.photo_url}
                  alt="Vista previa"
                  className="w-24 h-24 rounded-2xl object-cover shadow-lg border-2 border-border-light"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-24 h-24 bg-gradient-to-br from-primary to-primary-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-2xl">
                    {formData.full_name ? getInitials(formData.full_name) : <User className="w-10 h-10" />}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="label">Saludo</label>
              <select
                value={formData.salutation}
                onChange={(e) => setFormData({ ...formData, salutation: e.target.value })}
                className="input"
              >
                <option value="">-</option>
                <option value="Sr.">Sr.</option>
                <option value="Sra.">Sra.</option>
                <option value="Srta.">Srta.</option>
                <option value="Dr.">Dr.</option>
                <option value="Dra.">Dra.</option>
                <option value="Ing.">Ing.</option>
                <option value="Lic.">Lic.</option>
                <option value="Prof.">Prof.</option>
              </select>
            </div>

            <div className="col-span-3">
              <label className="label">Nombre Completo *</label>
              <input
                type="text"
                required
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                placeholder="Ej: Juan Pérez García"
                className="input"
              />
            </div>
          </div>

          <div>
            <label className="label">Número de Identificación</label>
            <input
              type="text"
              value={formData.identification_number}
              onChange={(e) => setFormData({ ...formData, identification_number: e.target.value })}
              placeholder="Ej: 12345678"
              className="input"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Correo Electrónico *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="correo@ejemplo.com"
                className="input"
              />
            </div>

            <div>
              <label className="label">Número de Teléfono</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+51 999 999 999"
                className="input"
              />
            </div>
          </div>

          <div>
            <label className="label">URL de Fotografía</label>
            <div className="flex gap-2">
              <input
                type="url"
                value={formData.photo_url}
                onChange={(e) => setFormData({ ...formData, photo_url: e.target.value })}
                placeholder="https://ejemplo.com/foto.jpg"
                className="input flex-1"
              />
            </div>
            <p className="text-xs text-text-muted mt-1">
              Ingresa la URL de una imagen para la foto del contacto
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-border-light">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btn-primary"
            >
              {saving ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

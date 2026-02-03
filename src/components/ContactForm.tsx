import { useState, useEffect, FormEvent } from 'react';
import { X, User } from 'lucide-react';
import { supabase, Contacto } from '../lib/supabase';
import { useTranslation } from '../context/TranslationContext';

interface ContactFormProps {
  contact?: Contacto | null;
  onClose: () => void;
  onSave: () => void;
}

export default function ContactForm({ contact, onClose, onSave }: ContactFormProps) {
  const [formData, setFormData] = useState({
    salutacion: '',
    nombre_completo: '',
    numero_identificacion: '',
    correo_electronico: '',
    telefono: '',
    url_foto: '',
  });
  const [saving, setSaving] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (contact) {
      setFormData({
        salutacion: contact.salutacion,
        nombre_completo: contact.nombre_completo,
        numero_identificacion: contact.numero_identificacion || '',
        correo_electronico: contact.correo_electronico,
        telefono: contact.telefono,
        url_foto: contact.url_foto,
      });
    }
  }, [contact]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const contactoData = {
        ...formData,
        numero_identificacion: formData.numero_identificacion || null,
        actualizado_en: new Date().toISOString(),
      };

      if (contact) {
        const { error } = await supabase
          .from('contactos')
          .update(contactoData)
          .eq('id', contact.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('contactos').insert([contactoData]);
        if (error) throw error;
      }

      onSave();
      onClose();
    } catch (error) {
      alert(t('Error al guardar el contacto'));
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
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="modal-content max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="sticky top-0 bg-white flex items-center justify-between px-6 py-4 border-b border-border-light z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-warning-100 rounded-xl flex items-center justify-center">
              <User className="w-5 h-5 text-warning-600" aria-hidden="true" />
            </div>
            <h2 id="modal-title" className="text-xl font-semibold text-text-primary">
              {contact ? t('Editar Contacto') : t('Nuevo Contacto')}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="btn-icon hover:bg-gray-100"
            aria-label={t('Cerrar')}
          >
            <X className="w-5 h-5 text-text-secondary" aria-hidden="true" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Photo Preview */}
          <div className="flex justify-center">
            <div className="relative">
              {formData.url_foto ? (
                <img
                  src={formData.url_foto}
                  alt={t('Vista previa')}
                  className="w-24 h-24 rounded-2xl object-cover shadow-lg border-2 border-border-light"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-24 h-24 bg-gradient-to-br from-primary to-primary-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-2xl" aria-hidden="true">
                    {formData.nombre_completo ? getInitials(formData.nombre_completo) : <User className="w-10 h-10" />}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div>
              <label htmlFor="saludo" className="label">{t('Saludo')}</label>
              <select
                id="saludo"
                value={formData.salutacion}
                onChange={(e) => setFormData({ ...formData, salutacion: e.target.value })}
                className="input"
              >
                <option value="">-</option>
                <option value="Sr.">{t('Sr.')}</option>
                <option value="Sra.">{t('Sra.')}</option>
                <option value="Srta.">{t('Srta.')}</option>
                <option value="Dr.">{t('Dr.')}</option>
                <option value="Dra.">{t('Dra.')}</option>
                <option value="Ing.">{t('Ing.')}</option>
                <option value="Lic.">{t('Lic.')}</option>
                <option value="Msc.">{t('Msc.')}</option>
                <option value="Prof.">{t('Prof.')}</option>
              </select>
            </div>

            <div className="col-span-3">
              <label htmlFor="nombre_completo" className="label">{t('Nombre Completo')} *</label>
              <input
                id="nombre_completo"
                type="text"
                required
                value={formData.nombre_completo}
                onChange={(e) => setFormData({ ...formData, nombre_completo: e.target.value })}
                placeholder={t('Ej: Juan Pérez García')}
                className="input"
                aria-required="true"
              />
            </div>
          </div>

          <div>
            <label htmlFor="numero_identificacion" className="label">{t('Número de Identificación')}</label>
            <input
              id="numero_identificacion"
              type="text"
              value={formData.numero_identificacion}
              onChange={(e) => setFormData({ ...formData, numero_identificacion: e.target.value })}
              placeholder={t('Ej: 1712345678')}
              className="input"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="correo_electronico" className="label">{t('Correo Electrónico')} *</label>
              <input
                id="correo_electronico"
                type="email"
                required
                value={formData.correo_electronico}
                onChange={(e) => setFormData({ ...formData, correo_electronico: e.target.value })}
                placeholder={t('correo@ejemplo.com')}
                className="input"
                aria-required="true"
              />
            </div>

            <div>
              <label htmlFor="telefono" className="label">{t('Número de Teléfono')}</label>
              <input
                id="telefono"
                type="tel"
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                placeholder={t('+593 99 999 9999')}
                className="input"
              />
            </div>
          </div>

          <div>
            <label htmlFor="url_foto" className="label">{t('URL de Fotografía')}</label>
            <div className="flex gap-2">
              <input
                id="url_foto"
                type="url"
                value={formData.url_foto}
                onChange={(e) => setFormData({ ...formData, url_foto: e.target.value })}
                placeholder={t('https://ejemplo.com/foto.jpg')}
                className="input flex-1"
              />
            </div>
            <p className="text-xs text-text-muted mt-1">
              {t('Ingresa la URL de una imagen para la foto del contacto')}
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-border-light">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              {t('Cancelar')}
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btn-primary"
            >
              {saving ? t('Guardando...') : t('Guardar')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

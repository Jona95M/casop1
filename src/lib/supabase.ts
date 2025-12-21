import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Interfaces con nombres en español según el esquema de base de datos
export interface Ubicacion {
    id: string;
    titulo: string;
    direccion: string;
    latitud: number | null;
    longitud: number | null;
    creado_en: string;
    actualizado_en: string;
}

export interface Contacto {
    id: string;
    salutacion: string;
    nombre_completo: string;
    numero_identificacion: string | null;
    correo_electronico: string;
    telefono: string;
    url_foto: string;
    creado_en: string;
    actualizado_en: string;
}

export interface Evento {
    id: string;
    titulo: string;
    invitados: string;
    fecha_evento: string;
    zona_horaria: string;
    descripcion: string;
    recurrencia: string;
    recordatorio: string;
    clasificacion: string;
    ubicacion_id: string | null;
    creado_en: string;
    actualizado_en: string;
    ubicacion?: Ubicacion;
}

// Aliases para compatibilidad con el código existente
export type Location = Ubicacion;
export type Contact = Contacto;
export type Event = Evento;

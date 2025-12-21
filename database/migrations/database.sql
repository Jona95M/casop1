/*
  # Sistema de Gestión de Eventos - Esquema

  1. Nuevas Tablas
    - `ubicaciones`
      - `id` (uuid, clave primaria)
      - `titulo` (texto, no nulo) - Nombre de la ubicación
      - `direccion` (texto, no nulo) - Dirección física
      - `latitud` (numérica) - Coordenada geográfica
      - `longitud` (numérica) - Coordenada geográfica
      - `creado_en` (timestamptz)
      - `actualizado_en` (timestamptz)

    - `contactos`
      - `id` (uuid, clave primaria)
      - `salutacion` (texto) - Saludo (Sr., Sra., Dr., etc.)
      - `nombre_completo` (texto, no nulo) - Nombre completo
      - `numero_identificacion` (texto, único) - Número de identificación
      - `correo_electronico` (texto, único, no nulo) - Correo electrónico
      - `telefono` (texto) - Número de teléfono
      - `url_foto` (texto) - URL de la foto
      - `creado_en` (timestamptz)
      - `actualizado_en` (timestamptz)

    - `eventos`
      - `id` (uuid, clave primaria)
      - `titulo` (texto, no nulo) - Título del evento
      - `invitados` (texto) - Lista de invitados
      - `fecha_evento` (timestamptz, no nulo) - Fecha y hora
      - `zona_horaria` (texto) - Zona horaria
      - `descripcion` (texto) - Descripción del evento
      - `recurrencia` (texto) - Patrón de repetición
      - `recordatorio` (texto) - Configuración de recordatorio
      - `clasificacion` (texto) - Tipo de evento (conferencia, taller, seminario)
      - `ubicacion_id` (uuid, clave foránea) - Referencia a ubicación
      - `creado_en` (timestamptz)
      - `actualizado_en` (timestamptz)

    - `eventos_contactos`
      - Tabla de unión para relación muchos-a-muchos entre eventos y contactos

  2. Seguridad
    - Habilitar RLS en todas las tablas
    - Agregar políticas de acceso público (para fines educativos)
    - Cascada en borrado y actualización
*/

-- Crear tabla ubicaciones
CREATE TABLE IF NOT EXISTS ubicaciones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo text NOT NULL,
  direccion text NOT NULL,
  latitud numeric,
  longitud numeric,
  creado_en timestamptz DEFAULT now(),
  actualizado_en timestamptz DEFAULT now()
);

-- Crear tabla contactos
CREATE TABLE IF NOT EXISTS contactos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  salutacion text DEFAULT '',
  nombre_completo text NOT NULL,
  numero_identificacion text UNIQUE,
  correo_electronico text UNIQUE NOT NULL,
  telefono text DEFAULT '',
  url_foto text DEFAULT '',
  creado_en timestamptz DEFAULT now(),
  actualizado_en timestamptz DEFAULT now()
);

-- Crear tabla eventos
CREATE TABLE IF NOT EXISTS eventos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo text NOT NULL,
  invitados text DEFAULT '',
  fecha_evento timestamptz NOT NULL,
  zona_horaria text DEFAULT 'America/New_York',
  descripcion text DEFAULT '',
  recurrencia text DEFAULT 'ninguna',
  recordatorio text DEFAULT 'ninguno',
  clasificacion text DEFAULT 'conferencia',
  ubicacion_id uuid REFERENCES ubicaciones(id) ON DELETE SET NULL ON UPDATE CASCADE,
  creado_en timestamptz DEFAULT now(),
  actualizado_en timestamptz DEFAULT now()
);

-- Crear tabla de unión eventos_contactos
CREATE TABLE IF NOT EXISTS eventos_contactos (
  evento_id uuid REFERENCES eventos(id) ON DELETE CASCADE ON UPDATE CASCADE,
  contacto_id uuid REFERENCES contactos(id) ON DELETE CASCADE ON UPDATE CASCADE,
  PRIMARY KEY (evento_id, contacto_id),
  creado_en timestamptz DEFAULT now()
);

-- Habilitar RLS (Seguridad a Nivel de Fila)
ALTER TABLE ubicaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE contactos ENABLE ROW LEVEL SECURITY;
ALTER TABLE eventos ENABLE ROW LEVEL SECURITY;
ALTER TABLE eventos_contactos ENABLE ROW LEVEL SECURITY;

-- Crear políticas de acceso público para ubicaciones
CREATE POLICY "Permitir lectura pública en ubicaciones"
  ON ubicaciones FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Permitir inserción pública en ubicaciones"
  ON ubicaciones FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Permitir actualización pública en ubicaciones"
  ON ubicaciones FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Permitir eliminación pública en ubicaciones"
  ON ubicaciones FOR DELETE
  TO public
  USING (true);

-- Crear políticas de acceso público para contactos
CREATE POLICY "Permitir lectura pública en contactos"
  ON contactos FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Permitir inserción pública en contactos"
  ON contactos FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Permitir actualización pública en contactos"
  ON contactos FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Permitir eliminación pública en contactos"
  ON contactos FOR DELETE
  TO public
  USING (true);

-- Crear políticas de acceso público para eventos
CREATE POLICY "Permitir lectura pública en eventos"
  ON eventos FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Permitir inserción pública en eventos"
  ON eventos FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Permitir actualización pública en eventos"
  ON eventos FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Permitir eliminación pública en eventos"
  ON eventos FOR DELETE
  TO public
  USING (true);

-- Crear políticas de acceso público para eventos_contactos
CREATE POLICY "Permitir lectura pública en eventos_contactos"
  ON eventos_contactos FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Permitir inserción pública en eventos_contactos"
  ON eventos_contactos FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Permitir eliminación pública en eventos_contactos"
  ON eventos_contactos FOR DELETE
  TO public
  USING (true);
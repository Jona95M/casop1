// Mock data layer - Datos de ejemplo para Universidad Técnica Equinoccial (UTE)

export interface Location {
    id: string;
    title: string;
    address: string;
    latitude: number | null;
    longitude: number | null;
    created_at: string;
    updated_at: string;
}

export interface Contact {
    id: string;
    salutation: string;
    full_name: string;
    identification_number: string | null;
    email: string;
    phone: string;
    photo_url: string;
    created_at: string;
    updated_at: string;
}

export interface Event {
    id: string;
    title: string;
    guests: string;
    event_date: string;
    timezone: string;
    description: string;
    recurrence: string;
    reminder: string;
    classification: string;
    location_id: string | null;
    created_at: string;
    updated_at: string;
    location?: Location;
}

// Generate UUID
const generateId = () => crypto.randomUUID();

// Mock data storage - Ubicaciones en la UTE Quito
let locations: Location[] = [
    {
        id: generateId(),
        title: 'Auditorio Principal UTE',
        address: 'Av. Mariscal Sucre y Mariana de Jesús, Campus Occidental, Quito',
        latitude: -0.2105,
        longitude: -78.4876,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    },
    {
        id: generateId(),
        title: 'Sala de Conferencias - Facultad de Ingeniería',
        address: 'Bloque C, Piso 3, Campus UTE',
        latitude: -0.2110,
        longitude: -78.4880,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    },
    {
        id: generateId(),
        title: 'Laboratorio de Computación',
        address: 'Bloque B, Piso 2, Campus UTE',
        latitude: -0.2100,
        longitude: -78.4870,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    },
    {
        id: generateId(),
        title: 'Centro de Innovación Tecnológica',
        address: 'Edificio de Posgrados, Campus UTE',
        latitude: -0.2095,
        longitude: -78.4865,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    },
];

let contacts: Contact[] = [
    {
        id: generateId(),
        salutation: 'Dr.',
        full_name: 'Juan Carlos Ramírez',
        identification_number: '1712345678',
        email: 'jramirez@ute.edu.ec',
        phone: '+593 99 123 4567',
        photo_url: '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    },
    {
        id: generateId(),
        salutation: 'Dra.',
        full_name: 'María Fernanda López',
        identification_number: '1798765432',
        email: 'mflopez@ute.edu.ec',
        phone: '+593 99 987 6543',
        photo_url: '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    },
    {
        id: generateId(),
        salutation: 'Ing.',
        full_name: 'Andrés Sebastián Mora',
        identification_number: '1756789012',
        email: 'asmora@ute.edu.ec',
        phone: '+593 99 567 8901',
        photo_url: '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    },
    {
        id: generateId(),
        salutation: 'Msc.',
        full_name: 'Carolina Espinoza Vega',
        identification_number: '1734567890',
        email: 'cespinoza@ute.edu.ec',
        phone: '+593 99 345 6789',
        photo_url: '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    },
];

let events: Event[] = [
    {
        id: generateId(),
        title: 'Conferencia: Inteligencia Artificial en la Educación',
        guests: 'Dr. Juan Carlos Ramírez, Dra. María Fernanda López',
        event_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        timezone: 'America/Guayaquil',
        description: 'Conferencia magistral sobre la aplicación de IA y machine learning en procesos educativos universitarios.',
        recurrence: 'none',
        reminder: '1day',
        classification: 'conference',
        location_id: locations[0].id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        location: locations[0],
    },
    {
        id: generateId(),
        title: 'Taller: Desarrollo de Aplicaciones Web con React',
        guests: 'Ing. Andrés Sebastián Mora',
        event_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        timezone: 'America/Guayaquil',
        description: 'Taller práctico sobre desarrollo frontend moderno con React, TypeScript y Tailwind CSS.',
        recurrence: 'none',
        reminder: '30min',
        classification: 'workshop',
        location_id: locations[2].id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        location: locations[2],
    },
    {
        id: generateId(),
        title: 'Seminario: Investigación en Ciencias de la Computación',
        guests: 'Msc. Carolina Espinoza, Docentes de la Facultad',
        event_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        timezone: 'America/Guayaquil',
        description: 'Seminario mensual de presentación de avances en proyectos de investigación de la Facultad de Ingeniería.',
        recurrence: 'monthly',
        reminder: '1week',
        classification: 'seminar',
        location_id: locations[1].id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        location: locations[1],
    },
    {
        id: generateId(),
        title: 'Conferencia: Ciberseguridad y Protección de Datos',
        guests: 'Expertos invitados',
        event_date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
        timezone: 'America/Guayaquil',
        description: 'Conferencia sobre las mejores prácticas en seguridad informática y cumplimiento de normativas de protección de datos.',
        recurrence: 'none',
        reminder: '1day',
        classification: 'conference',
        location_id: locations[3].id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        location: locations[3],
    },
];

// Simulate async delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock Supabase-like API
export const supabase = {
    from: (table: string) => ({
        select: (_query?: string) => ({
            order: async (column: string, options?: { ascending?: boolean }) => {
                await delay(100);

                if (table === 'events') {
                    const data = events.map(e => ({
                        ...e,
                        location: locations.find(l => l.id === e.location_id) || null
                    }));
                    if (options?.ascending) {
                        data.sort((a, b) => new Date(a[column as keyof Event] as string).getTime() - new Date(b[column as keyof Event] as string).getTime());
                    } else {
                        data.sort((a, b) => new Date(b[column as keyof Event] as string).getTime() - new Date(a[column as keyof Event] as string).getTime());
                    }
                    return { data, error: null };
                }
                if (table === 'locations') {
                    const data = [...locations].sort((a, b) => a.title.localeCompare(b.title));
                    return { data, error: null };
                }
                if (table === 'contacts') {
                    const data = [...contacts].sort((a, b) => a.full_name.localeCompare(b.full_name));
                    return { data, error: null };
                }

                return { data: [], error: null };
            },
            eq: () => ({
                order: async () => {
                    await delay(100);
                    return { data: [], error: null };
                }
            })
        }),
        insert: async (data: any[]) => {
            await delay(100);
            const newItem = { ...data[0], id: generateId(), created_at: new Date().toISOString() };

            if (table === 'events') {
                events.push(newItem);
            } else if (table === 'locations') {
                locations.push(newItem);
            } else if (table === 'contacts') {
                contacts.push(newItem);
            }

            return { data: newItem, error: null };
        },
        update: (data: any) => ({
            eq: async (column: string, value: string) => {
                await delay(100);

                if (table === 'events') {
                    const index = events.findIndex(e => e[column as keyof Event] === value);
                    if (index !== -1) {
                        events[index] = { ...events[index], ...data };
                    }
                } else if (table === 'locations') {
                    const index = locations.findIndex(l => l[column as keyof Location] === value);
                    if (index !== -1) {
                        locations[index] = { ...locations[index], ...data };
                    }
                } else if (table === 'contacts') {
                    const index = contacts.findIndex(c => c[column as keyof Contact] === value);
                    if (index !== -1) {
                        contacts[index] = { ...contacts[index], ...data };
                    }
                }

                return { error: null };
            }
        }),
        delete: () => ({
            eq: async (column: string, value: string) => {
                await delay(100);

                if (table === 'events') {
                    events = events.filter(e => e[column as keyof Event] !== value);
                } else if (table === 'locations') {
                    locations = locations.filter(l => l[column as keyof Location] !== value);
                } else if (table === 'contacts') {
                    contacts = contacts.filter(c => c[column as keyof Contact] !== value);
                }

                return { error: null };
            }
        }),
    }),
};

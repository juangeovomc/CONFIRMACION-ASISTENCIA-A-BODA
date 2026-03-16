// Reemplaza este arreglo con los nombres reales de tu archivo "lista de invitados".
// Sugerencia rápida:
// 1. Abre el Excel.
// 2. Copia la columna de nombres.
// 3. Pégala en un editor de texto y conviértela a este formato de arreglo.
//    Ejemplo: ['Nombre 1', 'Nombre 2', 'Nombre 3']

const INVITATIONS = [
  {
    id: 'marce-cesar-soto',
    label: 'César Soto (4)',
    members: ['César Soto', 'Yuri Cardenas', 'Alejandro Soto', 'Mariana Soto'],
  },
  {
    id: 'marce-martha-soto-3',
    label: 'Martha Soto (3)',
    members: ['Martha Soto', 'Carlos Julio Duque', 'July Duque'],
  },
  { id: 'marce-yelly-soto', label: 'Yelly Soto (1)', members: ['Yelly Soto'] },
  {
    id: 'marce-rosmira-soto',
    label: 'Rosmira Soto (1)',
    members: ['Rosmira Soto'],
  },
  {
    id: 'marce-jose-lubin-soto',
    label: 'Jose lubin Soto (1)',
    members: ['Jose lubin Soto'],
  },
  {
    id: 'marce-carmen-soto',
    label: 'Carmen Soto (1)',
    members: ['Carmen Soto'],
  },
  { id: 'marce-orfa-soto', label: 'Orfa Soto (1)', members: ['Orfa Soto'] },
  {
    id: 'marce-casa-marce',
    label: 'Casa Marce (4)',
    members: ['Víctor Soto', 'Ofelia Arias', 'Cristina Soto', 'Marce Soto'],
  },
  {
    id: 'marce-aurelina-soto',
    label: 'Aurelina Soto (3)',
    members: ['Aurelina Soto', 'Luis stiven Ramírez', 'Angie Ramírez'],
  },
  {
    id: 'marce-olga-arias',
    label: 'Olga Arias (2)',
    members: ['Olga Arias', 'Ana María Montoya'],
  },
  {
    id: 'marce-martha-arias',
    label: 'Martha Arias (4)',
    members: ['Martha Arias', 'Yeison Zuluaga', 'Yuli Zuluaga', 'Fabio Zuluaga'],
  },
  {
    id: 'marce-lino-arias',
    label: 'Lino Arias (1)',
    members: ['Lino Arias'],
  },
  {
    id: 'marce-libia-arias',
    label: 'Libia Arias (2)',
    members: ['Libia Arias', 'Iván Marin'],
  },
  {
    id: 'marce-adolfo-arias',
    label: 'Adolfo Arias (4)',
    members: ['Adolfo Arias', 'Nora Escobar', 'Luis David Arias', 'Stiven Arias'],
  },
  {
    id: 'marce-arturo-arias',
    label: 'Arturo Arias (2)',
    members: ['Arturo Arias', 'Jaime Arias'],
  },
  {
    id: 'marce-joselyn-jimenez',
    label: 'Joselyn Jiménez (1)',
    members: ['Joselyn Jiménez'],
  },
  {
    id: 'sebas-casa',
    label: 'Casa (5)',
    members: [
      'Yanet Taborda',
      'Leonardo Herrera',
      'Santiago Herrera',
      'Angie Herrera',
      'Sebas Herrera',
    ],
  },
  {
    id: 'sebas-adriana-taborda',
    label: 'Adriana Taborda (2)',
    members: ['Adriana Taborda', 'Darío Cardona'],
  },
  {
    id: 'sebas-patricia-taborda',
    label: 'patricia Taborda (2)',
    members: ['patricia Taborda', 'María Antonia Ramirez'],
  },
  {
    id: 'sebas-jaime-ramirez',
    label: 'Jaime Ramirez (1)',
    members: ['Jaime Ramirez'],
  },
  {
    id: 'sebas-sandra-taborda',
    label: 'Sandra Taborda (3)',
    members: ['Sandra Taborda', 'Laura Taborda', 'Jacobo pienknagura'],
  },
  {
    id: 'sebas-luz-dary-taborda',
    label: 'luz Dary Taborda (2)',
    members: ['luz Dary Taborda', 'Andrea Taborda'],
  },
  {
    id: 'sebas-ivonne-taborda',
    label: 'Ivonne Taborda (3)',
    members: ['Ivonne Taborda', 'David Castaño', 'Ferney Taborda'],
  },
  {
    id: 'sebas-clementina-patino',
    label: 'Clementina Patiño (3)',
    members: ['Clementina Patiño', 'Luis Martinez', 'Catalina Martinez'],
  },
  {
    id: 'sebas-carolina-pabon',
    label: 'Carolina pabon (3)',
    members: ['Carolina pabon', 'Monica Toro', 'Santiago Ciro'],
  },
  {
    id: 'sebas-valeria-taborda',
    label: 'Valeria Taborda (1)',
    members: ['Valeria Taborda'],
  },
  {
    id: 'sebas-adriana-herrera',
    label: 'Adriana Herrera (4)',
    members: ['Adriana Herrera', 'Bayron Puerta', 'Tomas Puerta', 'Susana Puerta'],
  },
  {
    id: 'sebas-meri-herrera',
    label: 'Meri Herrera (3)',
    members: ['Meri Herrera', 'Camilo Torres', 'Bryan Herrera'],
  },
  {
    id: 'sebas-yolanda-herrera',
    label: 'Yolanda Herrera (3)',
    members: ['Yolanda Herrera', 'Isabella Castaño', 'Julián Castaño'],
  },
  {
    id: 'sebas-doralba-herrera',
    label: 'Doralba Herrera(3)',
    members: ['Doralba Herrera', 'Sergio Gonzales', 'Catalina Gonzales'],
  },
  {
    id: 'sebas-abuelos',
    label: 'Abuelos (2)',
    members: ['Jorge Herrera', 'Fabiola Rendon'],
  },
  {
    id: 'sebas-santiago-latorre',
    label: 'Santiago Latorre (2)',
    members: ['Santiago Latorre', 'Mariana Villa'],
  },
  {
    id: 'sebas-gefry-ortiz',
    label: 'Gefry Ortiz(1)',
    members: ['Gefry Ortiz'],
  },
  {
    id: 'sebas-emmanuel-jaramillo',
    label: 'Emmanuel Jaramillo(1)',
    members: ['Emmanuel Jaramillo'],
  },
  {
    id: 'sebas-juan-esteban-ortiz',
    label: 'Juan Esteban Ortiz(2)',
    members: ['Juan Esteban Ortiz', 'pilar Manrique'],
  },
  {
    id: 'sebas-alejandro-lea',
    label: 'Alejandro Lea(2)',
    members: ['Alejandro Lea', 'itahisa Reyes'],
  },
  {
    id: 'sebas-angie-ortega',
    label: 'Angie Ortega (2)',
    members: ['Angie Ortega', 'Juan Fernando Villa'],
  },
];

function normalizeText(value) {
  return (value || '')
    .toString()
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '');
}

function baseLabel(label) {
  return (label || '')
    .toString()
    .replace(/\s*\(\s*\d+\s*\)\s*$/u, '')
    .trim();
}

const INVITADOS = (() => {
  const seen = new Set();
  const result = [];

  for (const inv of INVITATIONS) {
    const entries = [];
    if (inv && typeof inv.label === 'string') {
      entries.push(inv.label);
    }

    const labelBase = normalizeText(baseLabel(inv && inv.label));
    if (inv && Array.isArray(inv.members)) {
      for (const member of inv.members) {
        if (normalizeText(member) === labelBase) continue;
        entries.push(member);
      }
    }

    for (const entry of entries) {
      const key = normalizeText(entry);
      if (!key || seen.has(key)) continue;
      seen.add(key);
      result.push(entry);
    }
  }

  return result;
})();


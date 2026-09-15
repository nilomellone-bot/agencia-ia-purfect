import { calculateFinance } from './finance';

// Entirely fictional fixture. Never sourced from the owner's business accounts.
export const dailyData = [
  [1, 680000, 85000, 7], [2, 850000, 88000, 8], [3, 720000, 84000, 7],
  [4, 1100000, 92000, 10], [5, 960000, 94000, 9], [6, 1240000, 91000, 12],
  [7, 1080000, 93000, 10], [8, 1320000, 96000, 13], [9, 1170000, 92000, 11],
  [10, 1540000, 98000, 14], [11, 1290000, 99000, 12], [12, 1480000, 96000, 14],
  [13, 1680000, 101000, 15], [14, 1520000, 101000, 14],
].map(([day, sales, spend, orders]) => ({ day: `${day} sep`, sales, spend, orders }));

export function getDemoMetrics(days: number) {
  const rows = dailyData.slice(-days);
  const revenue = rows.reduce((s, r) => s + r.sales, 0);
  const adSpend = rows.reduce((s, r) => s + r.spend, 0);
  return calculateFinance({ revenue, adSpend,
    variableCosts: Math.round(revenue * 0.62),
    fixedCosts: Math.round(6300000 * days / 30),
    orders: rows.reduce((s, r) => s + r.orders, 0),
    attributedRevenue: Math.round(revenue * 0.52),
  });
}
export const channels = [
  { name: 'Meta Ads', value: 52, color: '#5864db' },
  { name: 'Orgánico', value: 26, color: '#67bcae' },
  { name: 'Directo', value: 15, color: '#a1abed' },
  { name: 'Email', value: 7, color: '#d6dbee' },
];
export const agentInfo = [
  { id: 'meta-ads', name: 'Meta Ads', role: 'Inversión y rendimiento', initials: 'MA', tone: 'blue', finding: 'Comparar creativos de producto en uso antes de escalar.', source: 'Campañas demo', status: 'Listo para simular' },
  { id: 'finanzas', name: 'Finanzas', role: 'Rentabilidad y límites', initials: 'FI', tone: 'green', finding: 'Conservar el margen y validar costos antes de invertir más.', source: 'Motor financiero TypeScript', status: 'Cálculos disponibles' },
  { id: 'analytics', name: 'Analytics', role: 'Calidad y atribución', initials: 'AN', tone: 'purple', finding: 'Resolver la diferencia de atribución antes de decidir presupuesto.', source: 'Conciliación demo', status: 'Bloqueo de ejemplo' },
  { id: 'cro', name: 'CRO', role: 'Experiencia y conversión', initials: 'CR', tone: 'orange', finding: 'Probar el recorrido hacia la compra en la landing del circuito.', source: 'Hipótesis demo', status: 'Listo para simular' },
];
export const campaigns = [
  { name: 'Prospecting · Producto en uso', audience: 'Audiencia amplia', spend: 830000, revenue: 5800000, purchases: 54, ctr: 2.8, cpm: 4200, frequency: 1.7 },
  { name: 'Catálogo · Muebles de pared', audience: 'Descubrimiento de productos', spend: 340000, revenue: 2200000, purchases: 20, ctr: 1.9, cpm: 3900, frequency: 2.3 },
  { name: 'Retargeting · Visitantes', audience: 'Últimos 14 días', spend: 140000, revenue: 647600, purchases: 8, ctr: 1.5, cpm: 4600, frequency: 4.2 },
];

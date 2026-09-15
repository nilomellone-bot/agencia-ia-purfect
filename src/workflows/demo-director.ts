import type { DecisionCase, DemoStore, Recommendation } from '../schemas/decision';
import { getDemoMetrics } from '../services/demo-data';

export const seedRecommendations: Recommendation[] = [
  { id: 'rec-circuito', title: 'Medir la landing del Circuito Felino', description: 'Comparar la landing con la ficha de producto, manteniendo la misma audiencia y el mismo creativo.', agent: 'CRO + Analytics', priority: 'Alta', status: 'VALIDATED', evidence: ['Hipótesis demo: explicar el recorrido podría reducir dudas.', 'Métrica principal: compras por visita; controlar margen por pedido.'], blockers: [], metric: 'Conversión y margen por pedido', nextStep: 'Diseñar la prueba y su tamaño de muestra con datos reales.' },
  { id: 'rec-attribution', title: 'Conciliar compras antes de escalar', description: 'El ejemplo contiene diferencias entre pedidos y conversiones atribuidas. Analytics pide validar la medición.', agent: 'Analytics', priority: 'Alta', status: 'CONFLICTED', evidence: ['Datos sintéticos de Meta y tienda, sin conciliación real.', 'El ROAS atribuido no demuestra ventas incrementales.'], blockers: ['Analytics: atribución sin verificar', 'Finanzas: rentabilidad incremental sin validar'], metric: 'Compras conciliadas', nextStep: 'Conectar fuentes de solo lectura y revisar ventanas, IDs y devoluciones.' },
  { id: 'rec-creative', title: 'Preparar una prueba de creativos en uso', description: 'Comparar demostración de resistencia con un michi usando el producto. Mantener una sola variable por prueba.', agent: 'Meta Ads', priority: 'Media', status: 'PROPOSED', evidence: ['Propuesta de ejemplo, sin análisis de anuncios reales.'], blockers: [], metric: 'CPA y margen de contribución', nextStep: 'Validar la hipótesis y preparar las piezas para revisión humana.' },
];
export const initialStore: DemoStore = { version: 1, recommendations: seedRecommendations, audit: [], cases: [{
  id: 'CASO-DEMO-001', objective: 'Aumentar ventas sin resignar margen', createdAt: '2026-09-14T12:00:00Z', period: '1–14 septiembre 2026 · DEMO',
  baseline: (() => { const m=getDemoMetrics(14); return {revenue:m.revenue,orders:m.orders,contributionRate:m.contributionRate,roas:m.roas}; })(),
  agents: ['Meta Ads','Finanzas','Analytics','CRO'], sources: ['Fixture comercial demo v1','Motor financiero TypeScript'],
  findings: ['Priorizar medición y experiencia de compra.', 'No aumentar pauta hasta validar atribución y rentabilidad.'],
  contradictions: ['Meta propone explorar escalado; Analytics y Finanzas mantienen el bloqueo.'],
  recommendationIds: seedRecommendations.map(r=>r.id), implementation: 'Sin implementar. La V0 no ejecuta acciones.', results: 'Sin resultados posteriores. Requiere datos reales.', demo: true,
}] };

// Explicit fixture workflow. No LLM call or third-party action takes place.
// In V1 a server-side Manager will consult agent.asTool() using this blackboard.
export function runDemoDirector(objective: string): { decisionCase: DecisionCase; recommendations: Recommendation[] } {
  const id = `DEMO-${crypto.randomUUID()}`;
  const finance = /margen|costo|finanza|rentab|equilibrio/i.test(objective);
  const meta = /meta|pauta|anuncio|publicidad|roas|presupuesto/i.test(objective);
  const selected = finance ? [1,0] : meta ? [1,2] : [0,1,2];
  const recommendations = selected.map((index)=>({...seedRecommendations[index], id: `${id}-${index}`}));
  const m=getDemoMetrics(14);
  return { recommendations, decisionCase: {
    id, objective, createdAt: new Date().toISOString(), period: '1–14 septiembre 2026 · DEMO',
    baseline: {revenue:m.revenue,orders:m.orders,contributionRate:m.contributionRate,roas:m.roas},
    agents: ['Meta Ads','Finanzas','Analytics','CRO'], sources: ['Fixture comercial demo v1','Motor financiero TypeScript'],
    findings: [finance ? 'El escenario usa un margen de contribución previo a pauta del 38%.' : 'Priorizar una prueba de conversión y validar medición.', 'Las conclusiones son ejemplos prediseñados, no un diagnóstico real.'],
    contradictions: ['La propuesta de aumentar presupuesto queda bloqueada por atribución y rentabilidad sin validar.'],
    recommendationIds: recommendations.map(r=>r.id), implementation: 'Sin implementar. Requiere revisión humana y futura integración.',
    results: 'Todavía no hay medición posterior.', demo: true,
  }};
}

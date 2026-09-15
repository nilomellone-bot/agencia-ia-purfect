import type { DecisionStatus, Recommendation } from '../schemas/decision';
const transitions: Record<DecisionStatus, DecisionStatus[]> = {
  PROPOSED: ['VALIDATED','CONFLICTED','REJECTED'], VALIDATED: ['APPROVED','CONFLICTED','REJECTED'],
  CONFLICTED: ['REJECTED'], APPROVED: ['IMPLEMENTED'], REJECTED: [],
  IMPLEMENTED: ['MEASURING'], MEASURING: ['SUCCESSFUL','NEUTRAL','FAILED'],
  SUCCESSFUL: [], NEUTRAL: [], FAILED: [],
};
export function transitionDecision(rec: Recommendation, to: DecisionStatus, explicitApproval: boolean): Recommendation {
  if (!transitions[rec.status].includes(to)) throw new Error('Transición de estado no permitida.');
  if (to !== 'REJECTED' && rec.blockers.length) throw new Error('Primero deben resolverse los bloqueos de Analytics o Finanzas.');
  if (to === 'APPROVED' && !explicitApproval) throw new Error('Se necesita una aprobación humana explícita.');
  // V0 deliberately has no action executor, even for an approved recommendation.
  if (['IMPLEMENTED','MEASURING','SUCCESSFUL','NEUTRAL','FAILED'].includes(to)) throw new Error('La implementación y la medición real no están habilitadas en la V0.');
  return { ...rec, status: to };
}
export const statusLabels: Record<DecisionStatus, string> = {
  PROPOSED: 'Propuesta', VALIDATED: 'Validada', CONFLICTED: 'Bloqueada', APPROVED: 'Aprobada',
  REJECTED: 'Rechazada', IMPLEMENTED: 'Implementada', MEASURING: 'En medición',
  SUCCESSFUL: 'Exitosa', NEUTRAL: 'Neutral', FAILED: 'Sin mejora',
};

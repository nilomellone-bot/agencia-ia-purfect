import { z } from 'zod';
export const statusSchema = z.enum(['PROPOSED','VALIDATED','CONFLICTED','APPROVED','REJECTED','IMPLEMENTED','MEASURING','SUCCESSFUL','NEUTRAL','FAILED']);
export type DecisionStatus = z.infer<typeof statusSchema>;
export const recommendationSchema = z.object({
  id: z.string(), title: z.string(), description: z.string(), agent: z.string(),
  priority: z.enum(['Alta','Media']), status: statusSchema,
  evidence: z.array(z.string()), blockers: z.array(z.string()),
  metric: z.string(), nextStep: z.string(),
});
export type Recommendation = z.infer<typeof recommendationSchema>;
export const caseSchema = z.object({
  id: z.string(), objective: z.string(), createdAt: z.string(), period: z.string(),
  baseline: z.object({ revenue: z.number(), orders: z.number(), contributionRate: z.number().nullable(), roas: z.number().nullable() }),
  agents: z.array(z.string()), sources: z.array(z.string()), findings: z.array(z.string()),
  contradictions: z.array(z.string()), recommendationIds: z.array(z.string()),
  implementation: z.string(), results: z.string(), demo: z.literal(true),
});
export type DecisionCase = z.infer<typeof caseSchema>;
export const auditSchema = z.object({ id: z.string(), recommendationId: z.string(), at: z.string(), from: statusSchema, to: statusSchema, actor: z.literal('Usuario demo') });
export const storeSchema = z.object({ version: z.literal(1), recommendations: z.array(recommendationSchema), cases: z.array(caseSchema), audit: z.array(auditSchema) });
export type DemoStore = z.infer<typeof storeSchema>;

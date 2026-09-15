import { z } from 'zod';

// Monetary inputs are ARS, net of VAT, refunds and discounts, within one period.
// Advertising is kept separate from other variable costs to avoid double counting.
export const financialInputSchema = z.object({
  revenue: z.number().finite().nonnegative(),
  variableCosts: z.number().finite().nonnegative(),
  fixedCosts: z.number().finite().nonnegative(),
  adSpend: z.number().finite().nonnegative(),
  orders: z.number().int().nonnegative(),
  attributedRevenue: z.number().finite().nonnegative(),
});
export type FinancialInput = z.infer<typeof financialInputSchema>;
const money = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100;
export function calculateFinance(raw: FinancialInput) {
  const v = financialInputSchema.parse(raw);
  const contribution = money(v.revenue - v.variableCosts);
  const contributionRate = v.revenue > 0 ? contribution / v.revenue : null;
  const averageOrder = v.orders > 0 ? v.revenue / v.orders : null;
  return {
    ...v, contribution, contributionRate, averageOrder,
    operatingProfit: money(contribution - v.fixedCosts - v.adSpend),
    breakEvenRevenue: contributionRate !== null && contributionRate > 0
      ? money((v.fixedCosts + v.adSpend) / contributionRate) : null,
    roas: v.adSpend > 0 ? v.attributedRevenue / v.adSpend : null,
    mer: v.adSpend > 0 ? v.revenue / v.adSpend : null,
    // Contribution-based ceilings exclude fixed costs and target profit.
    contributionCacCeiling: averageOrder !== null && contributionRate !== null && contributionRate > 0
      ? money(averageOrder * contributionRate) : null,
    contributionRoasFloor: contributionRate !== null && contributionRate > 0 ? 1 / contributionRate : null,
  };
}
export const formatMoney = (n: number | null, digits = 0) => n === null ? 'Sin base' :
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: digits }).format(n);
export const formatNumber = (n: number, digits = 0) => new Intl.NumberFormat('es-AR', { maximumFractionDigits: digits }).format(n);
export const formatPercent = (n: number | null) => n === null ? 'Sin base' : `${formatNumber(n * 100, 1)}%`;

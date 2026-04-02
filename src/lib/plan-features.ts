/**
 * Plan Features Configuration
 * Defines what features are included with each plan
 */

export const PLAN_FEATURES = {
  basic: {
    name: 'Essential',
    price: 199,
    includesAiToolkit: false,
  },
  pro: {
    name: 'Professional',
    price: 399,
    includesAiToolkit: true,
  },
  enterprise: {
    name: 'Enterprise',
    price: 599,
    includesAiToolkit: true,
  },
};

/**
 * Get plan info by plan key
 */
export function getPlanInfo(plan: 'basic' | 'pro' | 'enterprise') {
  return PLAN_FEATURES[plan];
}

/**
 * Get plan name by key
 */
export function getPlanName(plan: 'basic' | 'pro' | 'enterprise'): string {
  return PLAN_FEATURES[plan].name;
}

/**
 * Get plan price by key
 */
export function getPlanPrice(plan: 'basic' | 'pro' | 'enterprise'): number {
  return PLAN_FEATURES[plan].price;
}

/**
 * Check if plan includes AI Toolkit
 */
export function planIncludesAiToolkit(plan: 'basic' | 'pro' | 'enterprise'): boolean {
  return PLAN_FEATURES[plan].includesAiToolkit;
}

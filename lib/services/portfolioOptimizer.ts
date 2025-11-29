/**
 * Portfolio Optimizer API Integration
 * Optimizes CRE lease portfolio allocation and risk analysis
 * 
 * FREE API: https://portfoliooptimizer.io/
 * No API key required, unlimited requests
 * 
 * Note: Designed for securities but can be adapted for CRE lease cash flows
 */

interface PortfolioAsset {
  symbol: string // Lease ID or property identifier
  expectedReturn?: number // Annual rent yield or ROI
  volatility?: number // Risk metric (e.g., tenant credit risk, vacancy risk)
  weight?: number // Current portfolio allocation percentage
}

interface OptimizationRequest {
  assets: PortfolioAsset[]
  constraints?: {
    minWeight?: number
    maxWeight?: number
    targetReturn?: number
    targetVolatility?: number
  }
  optimizationType?: 'min_variance' | 'max_sharpe' | 'equal_weight' | 'risk_parity'
}

interface OptimizationResult {
  optimizedWeights: Record<string, number>
  expectedReturn: number
  volatility: number
  sharpeRatio?: number
  efficientFrontier?: Array<{ return: number; volatility: number }>
}

const PORTFOLIO_OPTIMIZER_API_URL = 'https://api.portfoliooptimizer.io/v1'

/**
 * Optimize portfolio allocation using mean-variance optimization
 */
export async function optimizePortfolio(
  request: OptimizationRequest,
): Promise<OptimizationResult | null> {
  try {
    const url = `${PORTFOLIO_OPTIMIZER_API_URL}/portfolio/optimization/minimum-variance`

    // Convert lease assets to API format
    const assets = request.assets.map((asset) => ({
      symbol: asset.symbol,
      expectedReturn: asset.expectedReturn || 0.05, // Default 5% return
      volatility: asset.volatility || 0.15, // Default 15% volatility
    }))

    const payload: any = {
      assets: assets.map((a) => ({
        symbol: a.symbol,
        expectedReturn: a.expectedReturn,
        volatility: a.volatility,
      })),
    }

    // Add constraints if provided
    if (request.constraints) {
      if (request.constraints.minWeight !== undefined) {
        payload.constraints = {
          ...payload.constraints,
          minimumAssetsWeights: request.constraints.minWeight,
        }
      }
      if (request.constraints.maxWeight !== undefined) {
        payload.constraints = {
          ...payload.constraints,
          maximumAssetsWeights: request.constraints.maxWeight,
        }
      }
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      next: { revalidate: 3600 }, // Cache for 1 hour
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Portfolio Optimizer API error', response.status, errorText)
      return null
    }

    const data = await response.json()

    // Convert API response to our format
    const optimizedWeights: Record<string, number> = {}
    if (data.assetsWeights && Array.isArray(data.assetsWeights)) {
      assets.forEach((asset, index) => {
        optimizedWeights[asset.symbol] = data.assetsWeights[index] || 0
      })
    }

    return {
      optimizedWeights,
      expectedReturn: data.portfolioExpectedReturn || 0,
      volatility: data.portfolioVolatility || 0,
      sharpeRatio: data.portfolioSharpeRatio || undefined,
    }
  } catch (error) {
    console.error('Failed to optimize portfolio', error)
    return null
  }
}

/**
 * Calculate efficient frontier for portfolio
 */
export async function calculateEfficientFrontier(
  assets: PortfolioAsset[],
  numberOfPoints: number = 20,
): Promise<Array<{ return: number; volatility: number; weights: Record<string, number> }> | null> {
  try {
    const url = `${PORTFOLIO_OPTIMIZER_API_URL}/portfolio/analysis/efficient-frontier`

    const payload = {
      assets: assets.map((asset) => ({
        symbol: asset.symbol,
        expectedReturn: asset.expectedReturn || 0.05,
        volatility: asset.volatility || 0.15,
      })),
      numberOfPoints,
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      next: { revalidate: 3600 },
    })

    if (!response.ok) {
      return null
    }

    const data = await response.json()

    if (!data.efficientFrontier || !Array.isArray(data.efficientFrontier)) {
      return null
    }

    return data.efficientFrontier.map((point: any, index: number) => ({
      return: point.expectedReturn || 0,
      volatility: point.volatility || 0,
      weights: point.assetsWeights
        ? assets.reduce((acc, asset, i) => {
            acc[asset.symbol] = point.assetsWeights[i] || 0
            return acc
          }, {} as Record<string, number>)
        : {},
    }))
  } catch (error) {
    console.error('Failed to calculate efficient frontier', error)
    return null
  }
}

/**
 * Calculate portfolio risk metrics
 */
export async function calculatePortfolioRisk(
  assets: PortfolioAsset[],
  weights: Record<string, number>,
): Promise<{
  totalReturn: number
  totalVolatility: number
  sharpeRatio: number
  diversificationRatio: number
} | null> {
  try {
    const url = `${PORTFOLIO_OPTIMIZER_API_URL}/portfolio/analysis/risk`

    const payload = {
      assets: assets.map((asset) => ({
        symbol: asset.symbol,
        expectedReturn: asset.expectedReturn || 0.05,
        volatility: asset.volatility || 0.15,
      })),
      assetsWeights: assets.map((asset) => weights[asset.symbol] || 0),
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      next: { revalidate: 3600 },
    })

    if (!response.ok) {
      return null
    }

    const data = await response.json()

    return {
      totalReturn: data.portfolioExpectedReturn || 0,
      totalVolatility: data.portfolioVolatility || 0,
      sharpeRatio: data.portfolioSharpeRatio || 0,
      diversificationRatio: data.portfolioDiversificationRatio || 0,
    }
  } catch (error) {
    console.error('Failed to calculate portfolio risk', error)
    return null
  }
}

/**
 * Convert lease portfolio to optimization assets
 * Helper function to transform Stayll lease data into portfolio optimization format
 */
export function leasesToPortfolioAssets(
  leases: Array<{
    id: string
    annualRent?: number
    propertyValue?: number
    tenantCreditRisk?: number // 0-1 scale
    vacancyRisk?: number // 0-1 scale
    currentWeight?: number
  }>,
): PortfolioAsset[] {
  return leases.map((lease) => {
    // Calculate expected return (annual rent yield)
    const expectedReturn =
      lease.annualRent && lease.propertyValue
        ? lease.annualRent / lease.propertyValue
        : 0.05 // Default 5%

    // Calculate volatility (combined risk from tenant credit and vacancy)
    const creditRisk = lease.tenantCreditRisk || 0.1
    const vacancyRisk = lease.vacancyRisk || 0.1
    const volatility = Math.sqrt(creditRisk ** 2 + vacancyRisk ** 2) || 0.15

    return {
      symbol: lease.id,
      expectedReturn,
      volatility,
      weight: lease.currentWeight,
    }
  })
}

/**
 * Optimize CRE lease portfolio allocation
 */
export async function optimizeLeasePortfolio(
  leases: Array<{
    id: string
    annualRent?: number
    propertyValue?: number
    tenantCreditRisk?: number
    vacancyRisk?: number
    currentWeight?: number
  }>,
  constraints?: {
    minWeight?: number
    maxWeight?: number
    targetReturn?: number
  },
): Promise<OptimizationResult | null> {
  const assets = leasesToPortfolioAssets(leases)
  return optimizePortfolio({
    assets,
    constraints,
    optimizationType: 'min_variance',
  })
}



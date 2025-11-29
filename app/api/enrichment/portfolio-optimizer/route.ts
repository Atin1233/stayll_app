import { NextRequest, NextResponse } from 'next/server'
import {
  optimizePortfolio,
  calculateEfficientFrontier,
  calculatePortfolioRisk,
  optimizeLeasePortfolio,
} from '@/lib/services/portfolioOptimizer'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, leases, assets, weights, constraints, numberOfPoints } = body

    // Optimize lease portfolio (convenience endpoint)
    if (action === 'optimize-leases' && leases) {
      const result = await optimizeLeasePortfolio(leases, constraints)
      if (!result) {
        return NextResponse.json(
          { error: 'Failed to optimize lease portfolio' },
          { status: 500 },
        )
      }
      return NextResponse.json(result)
    }

    // Calculate efficient frontier
    if (action === 'efficient-frontier' && assets) {
      const frontier = await calculateEfficientFrontier(assets, numberOfPoints || 20)
      if (!frontier) {
        return NextResponse.json(
          { error: 'Failed to calculate efficient frontier' },
          { status: 500 },
        )
      }
      return NextResponse.json({ efficientFrontier: frontier })
    }

    // Calculate portfolio risk metrics
    if (action === 'risk' && assets && weights) {
      const risk = await calculatePortfolioRisk(assets, weights)
      if (!risk) {
        return NextResponse.json(
          { error: 'Failed to calculate portfolio risk' },
          { status: 500 },
        )
      }
      return NextResponse.json(risk)
    }

    // Standard portfolio optimization
    if (assets) {
      const result = await optimizePortfolio({
        assets,
        constraints,
      })

      if (!result) {
        return NextResponse.json(
          { error: 'Failed to optimize portfolio' },
          { status: 500 },
        )
      }

      return NextResponse.json(result)
    }

    return NextResponse.json(
      {
        error: 'Missing required fields',
        availableActions: ['optimize', 'optimize-leases', 'efficient-frontier', 'risk'],
      },
      { status: 400 },
    )
  } catch (error) {
    console.error('Portfolio Optimizer API error', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process portfolio optimization' },
      { status: 500 },
    )
  }
}



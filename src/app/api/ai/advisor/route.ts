/**
 * CFO Advisor API Route
 * POST /api/ai/advisor
 * Streams financial guidance from Claude AI for construction contractors.
 *
 * Data flow:
 * 1. Authenticates the user via Supabase session
 * 2. Fetches the latest dashboard snapshot (QBO data) for their org
 * 3. Fetches integration data (projects, deals, retainage) for their org
 * 4. Optionally accepts client-side dashboard context for real-time tab data
 * 5. Builds a structured context block and injects it into the system prompt
 * 6. Streams Claude's response back to the client
 */

import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@/lib/supabase/server';
import { buildAdvisorContextBlock, type AdvisorContext } from '@/lib/advisor-context';
import type { DashboardData } from '@/types';

export const dynamic = 'force-dynamic';

const BASE_SYSTEM_PROMPT = `You are an expert CFO advisor specializing in construction and contractor businesses. You have direct access to this user's live financial data from QuickBooks Online and their connected field management tools. When answering questions, ALWAYS reference the user's actual numbers — dollar amounts, percentages, invoice numbers, job names, and GL account references.

**Core Expertise:**
- Job costing and cost tracking methodologies (NAHB Standard Chart of Accounts)
- WIP (Work in Progress) schedules and ASC 606 percentage-of-completion accounting
- Retainage management — GL 1290 (receivable) and GL 2120 (payable)
- Cash flow forecasting and management for contractors
- Over/under billing analysis — GL 1265 (underbilling/asset) and GL 2480 (overbilling/liability)
- Tax planning strategies for construction businesses
- AR/AP optimization and payment terms negotiation
- Financial ratio analysis — CFMA benchmarks (GC gross margin 20-28%, specialty 25-35%, net 5-10%)
- Bonding capacity calculation (10-20x working capital for aggregate program)
- Insurance requirements and cost management
- Lien rights and legal protections

**Your Approach:**
- ALWAYS reference the user's actual data when available. Quote specific numbers, job names, and invoice details.
- If the user asks about a metric that's in their data, provide the exact figure — don't give ranges.
- Flag risks proactively: overdue invoices, overbilling exposure, cash crunches, margin erosion.
- Provide specific, actionable next steps — not vague advice.
- When recommending GL entries, use NAHB standard 4-digit account codes.
- If data is missing to answer a question fully, say what's missing and what they'd need.
- Compare their numbers to CFMA industry benchmarks where relevant.
- Be direct and concise. Contractors don't want essays — they want answers.`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, clientContext } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('ANTHROPIC_API_KEY is not set');
      return NextResponse.json(
        { error: 'API configuration error' },
        { status: 500 }
      );
    }

    // ── Fetch live data from Supabase for the authenticated user ──
    let advisorContext: AdvisorContext = {
      dashboard: null,
      integrations: null,
    };

    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('organization_id')
          .eq('id', user.id)
          .single() as any;

        if (profile?.organization_id) {
          const orgId = profile.organization_id;

          // Fetch dashboard snapshot + integration data in parallel
          const [snapshotResult, projectsResult, dealsResult, connectionsResult] = await Promise.all([
            supabase
              .from('dashboard_snapshots')
              .select('data')
              .eq('organization_id', orgId)
              .order('pulled_at', { ascending: false })
              .limit(1)
              .single() as any,
            (supabase as any)
              .from('normalized_projects')
              .select('name, status, contract_amount, actual_cost, estimated_cost, billings_to_date, percent_complete, retainage_receivable, retainage_payable, over_under_billing, source, customer_name, start_date, projected_end_date')
              .eq('organization_id', orgId)
              .order('name'),
            (supabase as any)
              .from('normalized_deals')
              .select('name, amount, stage, probability, weighted_amount, expected_close_date, contact_name')
              .eq('organization_id', orgId)
              .order('amount', { ascending: false }),
            (supabase as any)
              .from('integration_connections')
              .select('provider')
              .eq('organization_id', orgId)
              .eq('status', 'connected'),
          ]);

          // Dashboard snapshot
          if (snapshotResult.data?.data) {
            advisorContext.dashboard = snapshotResult.data.data as DashboardData;
          }

          // Integration data
          const projects = projectsResult.data || [];
          const deals = dealsResult.data || [];
          const connections = connectionsResult.data || [];

          const totalContractValue = projects.reduce((s: number, p: any) => s + (p.contract_amount || 0), 0);
          const totalActualCost = projects.reduce((s: number, p: any) => s + (p.actual_cost || 0), 0);
          const totalAR = projects.reduce((s: number, p: any) => s + Math.max(0, (p.billings_to_date || 0) - (p.actual_cost || 0)), 0);
          const totalRetainageReceivable = projects.reduce((s: number, p: any) => s + (p.retainage_receivable || 0), 0);
          const totalRetainagePayable = projects.reduce((s: number, p: any) => s + (p.retainage_payable || 0), 0);
          const totalPipeline = deals.reduce((s: number, d: any) => s + (d.amount || 0), 0);
          const totalWeightedPipeline = deals.reduce((s: number, d: any) => s + (d.weighted_amount || 0), 0);

          const dealsByStage: Record<string, { count: number; amount: number }> = {};
          for (const d of deals) {
            const stage = d.stage || 'Unknown';
            if (!dealsByStage[stage]) dealsByStage[stage] = { count: 0, amount: 0 };
            dealsByStage[stage].count++;
            dealsByStage[stage].amount += d.amount || 0;
          }

          advisorContext.integrations = {
            projects,
            deals,
            connectedSources: connections.map((c: any) => c.provider),
            metrics: {
              totalContractValue,
              totalActualCost,
              totalAR,
              totalRetainageReceivable,
              totalRetainagePayable,
              totalPipeline,
              totalWeightedPipeline,
              projectCount: projects.length,
              contactCount: 0,
              dealCount: deals.length,
              activeProjectCount: projects.filter((p: any) => p.status === 'active').length,
            },
            dealsByStage,
          };
        }
      }
    } catch (dataError) {
      // Non-fatal — advisor still works without live data, just gives generic advice
      console.warn('Could not fetch live data for advisor context:', dataError);
    }

    // If client sent additional context (e.g., currently viewed tab data), merge it
    if (clientContext?.dashboard && !advisorContext.dashboard) {
      advisorContext.dashboard = clientContext.dashboard;
    }

    // Build the full system prompt with live data context
    const contextBlock = buildAdvisorContextBlock(advisorContext);
    const fullSystemPrompt = BASE_SYSTEM_PROMPT + contextBlock;

    const client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    // Create a ReadableStream for streaming response
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const response = await client.messages.stream({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 4096,
            system: fullSystemPrompt,
            messages: messages.map((msg: any) => ({
              role: msg.role,
              content: msg.content,
            })),
          });

          for await (const chunk of response) {
            if (
              chunk.type === 'content_block_delta' &&
              chunk.delta.type === 'text_delta'
            ) {
              controller.enqueue(
                new TextEncoder().encode(chunk.delta.text)
              );
            }
          }

          controller.close();
        } catch (error) {
          console.error('Stream error:', error);
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('CFO Advisor API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

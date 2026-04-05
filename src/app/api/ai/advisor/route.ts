/**
 * CFO Advisor API Route
 * POST /api/ai/advisor
 * Streams financial guidance from Claude AI for construction contractors
 */

import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

const SYSTEM_PROMPT = `You are an expert CFO advisor specializing in construction and contractor businesses. You provide professional, actionable financial guidance on topics including:

**Core Expertise:**
- Job costing and cost tracking methodologies
- WIP (Work in Progress) schedules and accounting
- Retainage management and cash flow optimization
- Cash flow forecasting and management for contractors
- Tax planning strategies for construction businesses
- AR/AP optimization and payment terms negotiation
- Financial ratio analysis and KPI interpretation
- Bonding capacity calculation and improvement
- Insurance requirements and cost management
- Lien rights and legal protections
- Percentage of completion (POC) accounting

**Your Approach:**
- Provide specific, practical advice tailored to construction contractors
- Use industry benchmarks and best practices
- Ask clarifying questions when needed
- Explain complex financial concepts in clear, understandable terms
- Consider the unique cash flow challenges of construction business
- Focus on actionable recommendations that improve profitability and cash position
- Reference industry standards (e.g., healthy gross margins, DSO benchmarks)

Always be professional, helpful, and provide context-aware advice based on the contractor's situation.`;

export async function POST(request: NextRequest) {
  try {
    // Verify user authentication
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { messages } = body;

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

    const client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    // Create a ReadableStream for streaming response
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const response = await client.messages.stream({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 2048,
            system: SYSTEM_PROMPT,
            messages: messages.map((msg: any) => ({
              role: msg.role,
              content: msg.content,
            })),
          });

          // Stream the text content
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

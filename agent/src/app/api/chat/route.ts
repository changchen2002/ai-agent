// app/api/chat/route.ts

import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export const runtime = 'edge';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: openai('gpt-4o'), {
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey: process.env.OPENROUTER_API_KEY!,
      headers: {
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL!,
        'X-Title': 'AI Recruiting Agent',
      },
    }),
    messages,
  });

  return result.toDataStreamResponse();
}
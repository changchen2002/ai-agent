// use Vercel AI SDK
'use server';

import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { createStreamableValue } from 'ai/rsc';

export async function generateMessage(persona: string, target: string) {
  const stream = createStreamableValue('');

  (async () => {
    const { textStream } = await streamText({
      model: openai('gpt-3.5-turbo', {
        apiKey: process.env.OPENROUTER_API_KEY,
        baseURL: 'https://openrouter.ai/api/v1',
      }),
      messages: [
        {
          role: 'system',
          content: 'You are a professional recruiter. Generate a personalized message based on the given persona and target.'
        },
        {
          role: 'user',
          content: `Persona: ${persona}\nTarget: ${target}\n\nGenerate a message:`
        }
      ],
    });

    for await (const delta of textStream) {
      stream.update(delta);
    }

    stream.done();
  })();

  return { output: stream.value };
}
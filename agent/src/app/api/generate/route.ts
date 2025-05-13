import { Configuration, OpenAIApi } from 'openai-edge';

export const runtime = 'edge';

const configuration = new Configuration({
  apiKey: process.env.OPENROUTER_API_KEY, // Use OpenRouter API key
  basePath: "https://openrouter.ai/api/v1", // OpenRouter's base URL
});

const openai = new OpenAIApi(configuration);

export default async function handler(req: Request) {
  const { persona, target } = await req.json();

  if (!persona || !target) {
    return new Response("Missing persona or target", { status: 400 });
  }

  try {
    const completion = await openai.createCompletion({
      model: "openai/gpt-4", // Specify the model via OpenRouter
      prompt: `Persona: ${persona}\nTarget: ${target}\n\nGenerate a message:`,
      max_tokens: 100,
      stream: true,
    });

    if (!completion.body) {
      throw new Error("Completion body is null");
    }

    // Stream the response back to the client
    const stream = new ReadableStream({
      async start(controller) {
        if (!completion.body) {
          throw new Error("Completion body is null");
        }
        const reader = completion.body.getReader();
        const decoder = new TextDecoder();

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            controller.enqueue(chunk);
          }
        } catch (error) {
          controller.error(error);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: { "Content-Type": "text/plain" },
    });
  } catch (error) {
    return new Response("Error generating message", { status: 500 });
  }
}
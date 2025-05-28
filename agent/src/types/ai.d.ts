declare module 'ai' {
  export class StreamingTextResponse extends Response {
    constructor(stream: ReadableStream);
  }
}

declare module 'ai/stream' {
  export function OpenAIStream(response: Response): ReadableStream;
}

declare module 'ai/react' {
  export function useChat(options?: {
    api?: string;
    id?: string;
    initialMessages?: any[];
    headers?: Record<string, string>;
    body?: Record<string, any>;
    onResponse?: (response: Response) => void;
    onFinish?: (message: any) => void;
    onError?: (error: Error) => void;
  }): {
    messages: any[];
    input: string;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>, options?: { data?: Record<string, any> }) => void;
    isLoading: boolean;
    error: Error | null;
  };
}
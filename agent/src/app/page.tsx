"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 text-center bg-background">
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
        AI-Powered Outreach Assistant
      </h1>

      <p className="text-muted-foreground text-lg max-w-xl mb-6">
        Instantly generate personalized LinkedIn DMs for recruiting or marketing. Let AI speak in your voice, and scale your outreach without spam.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/input">
          <Button size="lg">Get Started</Button>
        </Link>
        <a
          href="https://github.com/yourusername/yourproject"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="outline" size="lg">View on GitHub</Button>
        </a>
      </div>

      <p className="text-xs text-muted-foreground mt-8">
        Built with Next.js, GPT-4, and shadcn/ui.
      </p>
    </main>
  )
}
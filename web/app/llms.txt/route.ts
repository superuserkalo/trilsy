import { llmsTxt } from "@/lib/llms";

// Built once at build time from lib/llms.ts.
export const dynamic = "force-static";

export function GET() {
  return new Response(llmsTxt(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

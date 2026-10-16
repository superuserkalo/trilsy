import { llmsFullTxt } from "@/lib/llms";

// Built once at build time from lib/llms.ts.
export const dynamic = "force-static";

export function GET() {
  return new Response(llmsFullTxt(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

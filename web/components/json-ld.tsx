// One Schema.org object as <script type="application/ld+json">. A server
// component: the JSON is in the HTML, with `<` escaped so no string in it can
// close the script tag. Reusable by any page (FAQ, use-case pages).
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

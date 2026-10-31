/**
 * Structured data for search engines, rendered as a JSON-LD script tag.
 * `<` is escaped so text from our data can never close the script early.
 */
export default function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  )
}

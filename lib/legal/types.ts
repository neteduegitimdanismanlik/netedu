export type Lang = 'tr' | 'en'

export interface LegalSection {
  title: string
  /** Paragraphs. A paragraph starting with "• " renders as a list item. */
  body: string[]
}

export interface LegalDocument {
  title: string
  intro?: string
  sections: LegalSection[]
}

/**
 * Fill these in before going live. They appear in both documents and both
 * languages. Anything still in [brackets] is visible on the page — on purpose,
 * so an unfilled field is noticed rather than published silently.
 */
export const LEGAL = {
  controller: '[Veri sorumlusunun adı soyadı / şirket unvanı]',
  address: '[Açık adres]',
  email: 'neteduegitimdanismanlik@gmail.com',
  effectiveDate: '[gg.aa.yyyy]',
  deleteDays: 30,
}

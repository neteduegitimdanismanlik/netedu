/**
 * The three UCAS personal statement questions, word for word from UCAS
 * (2026 entry onward). Kept in a plain module so both the server page and the
 * client counter can import the real array — a value exported from a
 * 'use client' file reaches server components only as a reference.
 */
export const QUESTIONS = [
  'Why do you want to study this course or subject?',
  'How have your qualifications and studies helped you to prepare for this course or subject?',
  'What else have you done to prepare outside of education, and why are these experiences useful?',
]

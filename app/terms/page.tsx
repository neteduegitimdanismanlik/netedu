import type { Metadata } from 'next'
import LegalPage from '../components/LegalPage'
import { termsOfUse } from '@/lib/legal/terms'

export const metadata: Metadata = { title: 'Kullanım Koşulları / Terms of Use | NetEdu' }

export default function TermsPage() {
  return <LegalPage docs={termsOfUse} kind="terms" />
}

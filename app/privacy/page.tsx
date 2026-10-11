import type { Metadata } from 'next'
import LegalPage from '../components/LegalPage'
import { privacyNotice } from '@/lib/legal/privacy'

export const metadata: Metadata = { title: 'Aydınlatma Metni / Privacy Notice | NetEdu' }

export default function PrivacyPage() {
  return <LegalPage docs={privacyNotice} kind="privacy" />
}

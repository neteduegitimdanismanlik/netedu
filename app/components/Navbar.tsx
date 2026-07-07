import Link from 'next/link'

interface NavbarProps {
  showBack?: boolean
  backHref?: string
  backLabel?: string
}

export default function Navbar({ showBack, backHref = '/dashboard', backLabel = 'Dashboard' }: NavbarProps) {
  return (
    <nav className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
      <Link href="/dashboard" className="flex items-center gap-2">
        <div className="w-8 h-8 bg-indigo-900 rounded-lg flex items-center justify-center">
          <span className="text-white text-sm font-bold">N</span>
        </div>
        <span className="font-semibold text-indigo-900 text-base">NetEdu</span>
      </Link>
      {showBack && (
        <Link href={backHref} className="text-xs text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 flex items-center gap-1">
          ← {backLabel}
        </Link>
      )}
    </nav>
  )
}
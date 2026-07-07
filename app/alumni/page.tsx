import Navbar from '../components/Navbar'

export default function Alumni() {
  const alumni = [
    { initials: 'AY', color: 'bg-green-500', name: 'A.Y.', university: 'Imperial College London', department: 'Computer Science', year: '2024', gpa: '88', sat: '1420', ielts: '7.5', activities: ['Robotics Club', 'Research Project', 'Volunteer Work'], advice: 'Start your essay early. I finished mine in August and it made everything so much easier.', city: 'Antalya' },
    { initials: 'MK', color: 'bg-blue-500', name: 'M.K.', university: 'UCL', department: 'Economics', year: '2023', gpa: '91', sat: '', ielts: '7.5', activities: ['Student Council', 'Debate Team', 'NGO Volunteer'], advice: 'Do not underestimate extracurriculars. UCL accepted me largely because of my leadership experience.', city: 'Antalya' },
    { initials: 'ES', color: 'bg-purple-500', name: 'E.S.', university: 'TU Delft', department: 'Mechanical Engineering', year: '2023', gpa: '86', sat: '1390', ielts: '7.0', activities: ['Math Olympiad', 'Engineering Club', 'Hackathon'], advice: 'Finish SAT by Grade 11. Leave Grade 12 for essays and applications.', city: 'Antalya' }
  ]

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar showBack backHref="/dashboard" backLabel="Dashboard" />
      <div className="max-w-5xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Alumni Corner</h1>
        <p className="text-sm text-gray-500 mb-8">Learn from students who got accepted to top universities.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {alumni.map((a, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 ${a.color} rounded-full flex items-center justify-center text-white font-semibold`}>{a.initials}</div>
                <div>
                  <div className="font-semibold text-gray-800">{a.name}</div>
                  <div className="text-xs text-green-600 font-medium">{a.university}</div>
                  <div className="text-xs text-gray-400">{a.department} · {a.year}</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {a.gpa && <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">GPA: {a.gpa}</span>}
                {a.sat && <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full">SAT: {a.sat}</span>}
                {a.ielts && <span className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded-full">IELTS: {a.ielts}</span>}
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-600 leading-relaxed italic">"{a.advice}"</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
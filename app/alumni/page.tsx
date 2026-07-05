export default function Alumni() {
  const alumni = [
    {
      initials: "AY",
      color: "bg-green-500",
      name: "A.Y.",
      university: "Imperial College London",
      department: "Computer Science",
      year: "2024",
      gpa: "88",
      sat: "1420",
      ielts: "7.5",
      activities: ["Robotics Club", "Research Project", "Volunteer Work"],
      advice: "Start your essay early. I finished mine in August and it made everything so much easier.",
      city: "Antalya"
    },
    {
      initials: "MK",
      color: "bg-blue-500",
      name: "M.K.",
      university: "UCL",
      department: "Economics",
      year: "2023",
      gpa: "91",
      sat: "",
      ielts: "7.5",
      activities: ["Student Council", "Debate Team", "NGO Volunteer"],
      advice: "Don't underestimate extracurriculars. UCL accepted me largely because of my leadership experience.",
      city: "Antalya"
    },
    {
      initials: "EŞ",
      color: "bg-purple-500",
      name: "E.Ş.",
      university: "TU Delft",
      department: "Mechanical Engineering",
      year: "2023",
      gpa: "86",
      sat: "1390",
      ielts: "7.0",
      activities: ["Math Olympiad", "Engineering Club", "Hackathon"],
      advice: "Finish SAT by Grade 11. Leave Grade 12 for essays and applications.",
      city: "Antalya"
    }
  ]

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">N</span>
          </div>
          <span className="font-semibold text-gray-800">Net<span className="text-green-500">Edu</span></span>
        </div>
        <a href="/dashboard" className="text-xs text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50">Dashboard</a>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Alumni Corner 🎓</h1>
          <p className="text-sm text-gray-500">Learn from students who got accepted to top universities. Real profiles, real advice.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {alumni.map((a, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 hover:border-green-200 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 ${a.color} rounded-full flex items-center justify-center text-white font-semibold`}>
                  {a.initials}
                </div>
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
                <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">📍 {a.city}</span>
              </div>

              <div className="mb-4">
                <div className="text-xs font-medium text-gray-500 mb-2">Activities</div>
                <div className="flex flex-wrap gap-1">
                  {a.activities.map((act, j) => (
                    <span key={j} className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full border border-green-100">{act}</span>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-3">
                <div className="text-xs font-medium text-gray-500 mb-1">💬 Advice</div>
                <p className="text-xs text-gray-600 leading-relaxed italic">"{a.advice}"</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
          <h3 className="font-semibold text-green-800 mb-2">Are you an alumni? 🎓</h3>
          <p className="text-sm text-green-600 mb-4">Share your experience and help future students reach their goals.</p>
          <a href="https://forms.google.com" className="bg-green-500 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-green-600 inline-block">Share your story →</a>
        </div>
      </div>
    </main>
  )
}
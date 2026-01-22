export default function CityHighlights() {
  const highlights = [
    { title: "Feira do Produtor", location: "Centro, Sábados 6h-12h", icon: "🛒" },
    { title: "Ponto de Coleta", location: "Reciclagem no Parque", icon: "♻️" },
    { title: "WiFi Público", location: "Praça Central", icon: "📶" },
  ];
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">📍 Destaques da Cidade</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {highlights.map((item) => (
          <div key={item.title} className="bg-white p-4 rounded-xl border border-gray-200 hover:border-green-300 transition-colors">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{item.icon}</span>
              <div>
                <h4 className="font-medium text-gray-800">{item.title}</h4>
                <p className="text-sm text-gray-600">{item.location}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
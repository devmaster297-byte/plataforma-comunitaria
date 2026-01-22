export default function EmergencyAlert() {
  const hasAlert = true; // Mudar conforme lógica
  
  if (!hasAlert) return null;
  
  return (
    <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="animate-pulse">⚠️</div>
          <span className="font-semibold">ALERTA: Interrupção programada de água no Centro - 15/11</span>
        </div>
        <button className="text-sm underline hover:no-underline">
          Detalhes
        </button>
      </div>
    </div>
  )
}
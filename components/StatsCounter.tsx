interface StatsCounterProps {
  icon: React.ReactNode;
  label: string;
  count: number;
  color: string;
}

export default function StatsCounter({ icon, label, count, color }: StatsCounterProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${color.replace('text', 'bg')} bg-opacity-20`}>
          {icon}
        </div>
        <span className="text-white">{label}</span>
      </div>
      <span className="text-2xl font-bold text-white">{count.toLocaleString()}</span>
    </div>
  )
}
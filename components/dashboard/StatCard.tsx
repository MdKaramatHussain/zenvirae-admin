import { Card, CardContent } from '@/components/ui/card'


export default function StatCard({ icon, label, value, trend, color }: StatCardProps) {
  return (
    <Card className={`bg-gradient-to-br ${color} hover:shadow-lg transition-shadow duration-200`}>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-foreground/70">{label}</p>
            <p className="text-2xl md:text-3xl font-bold text-foreground mt-2">{value}</p>
            <p className="text-sm font-semibold mt-3 flex items-center gap-1 text-green-600">
              <span>📈</span> {trend}
            </p>
          </div>
          <div className="text-4xl">{icon}</div>
        </div>
      </CardContent>
    </Card>
  )
}

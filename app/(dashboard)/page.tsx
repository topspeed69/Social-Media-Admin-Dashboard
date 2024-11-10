import { StatsCards } from '@/components/dashboard/overview/stats-cards'
import { OverviewCharts } from '@/components/dashboard/overview/overview-charts'

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <StatsCards />
      <OverviewCharts />
    </div>
  )
}

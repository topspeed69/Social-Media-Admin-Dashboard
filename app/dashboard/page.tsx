import { StatsCards } from '@/components/dashboard/overview/stats-cards'
import { OverviewCharts } from '@/components/dashboard/overview/overview-charts'
import { DbStatusSection } from '@/components/dashboard/db/db-status-section'

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <StatsCards />
      <OverviewCharts />
      <DbStatusSection />
    </div>
  )
}
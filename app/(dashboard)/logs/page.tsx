'use client'

import { useState } from 'react'
import { Clock, History } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { LoginLogs } from '@/components/dashboard/logs/login-logs'
import { ActivityLogs } from '@/components/dashboard/logs/activity-logs'

export default function LogsPage() {
  const [activeView, setActiveView] = useState<'login' | 'activity'>('login')

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">System Logs</h2>
        <div className="flex gap-2">
          <Button
            variant={activeView === 'login' ? 'default' : 'outline'}
            onClick={() => setActiveView('login')}
          >
            <Clock className="h-4 w-4 mr-2" />
            Login History
          </Button>
          <Button
            variant={activeView === 'activity' ? 'default' : 'outline'}
            onClick={() => setActiveView('activity')}
          >
            <History className="h-4 w-4 mr-2" />
            Activity History
          </Button>
        </div>
      </div>

      {activeView === 'login' ? <LoginLogs /> : <ActivityLogs />}
    </div>
  )
}

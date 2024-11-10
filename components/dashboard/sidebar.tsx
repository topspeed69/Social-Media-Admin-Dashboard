'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Activity, 
  Users, 
  TrendingUp, 
  Shield, 
  ScrollText, 
  LogOut 
} from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface SidebarLinkProps {
  icon: React.ElementType
  label: string
  href: string
  active: boolean
}

const SidebarLink = ({ icon: Icon, label, href, active }: SidebarLinkProps) => {
  const router = useRouter()
  
  return (
    <Button 
      variant="ghost" 
      className={`w-full justify-start transition-all duration-200 hover:bg-black hover:text-white
        ${active ? 'bg-black text-white' : ''}`}
      onClick={() => router.push(href)}
    >
      <Icon className="mr-2 h-4 w-4" />
      {label}
    </Button>
  )
}

export function Sidebar() {
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  const router = useRouter()
  const pathname = location.pathname

  const handleLogout = () => {
    // Add your logout logic here
    setShowLogoutDialog(false)
    router.push('/login')
  }

  return (
    <div className="w-64 border-r bg-card shadow-lg">
      <div className="p-4 border-b">
        <h1 className="text-xl font-semibold">Admin Dashboard</h1>
      </div>
      
      <nav className="p-2 space-y-1">
        <SidebarLink 
          icon={Activity} 
          label="Overview" 
          href="/dashboard"
          active={pathname === '/dashboard'}
        />
        <SidebarLink 
          icon={Users} 
          label="Users" 
          href="/dashboard/users"
          active={pathname === '/dashboard/users'}
        />
        <SidebarLink 
          icon={Shield} 
          label="Moderation" 
          href="/dashboard/moderation"
          active={pathname === '/dashboard/moderation'}
        />
        <SidebarLink 
          icon={ScrollText} 
          label="Logs" 
          href="/dashboard/logs"
          active={pathname === '/dashboard/logs'}
        />
        
        <div className="pt-4">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-red-500 hover:text-red-500 hover:bg-red-500/10"
            onClick={() => setShowLogoutDialog(true)}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </nav>

      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Logout</DialogTitle>
            <DialogDescription>
              Are you sure you want to log out?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLogoutDialog(false)}>Cancel</Button>
            <Button onClick={handleLogout}>Yes, Logout</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

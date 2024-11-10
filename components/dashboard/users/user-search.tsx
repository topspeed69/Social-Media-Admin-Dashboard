'use client'

import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { UserProfile } from './user-profile'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { mockData } from '@/lib/mock-data'

export function UserSearch() {
  const [searchTerm, setSearchTerm] = useState('')
  const [showProfile, setShowProfile] = useState(false)

  const handleSearch = () => {
    if (searchTerm.trim()) {
      setShowProfile(true)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Input
          placeholder="Search user by username..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Button onClick={handleSearch}>Search</Button>
      </div>

      {showProfile ? (
        <UserProfile user={mockData.users.current} />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Search for a user to view their details.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

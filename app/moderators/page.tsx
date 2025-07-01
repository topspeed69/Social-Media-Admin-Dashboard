'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ModeratorDialog } from '@/components/dashboard/moderators/moderator-dialog'
import { useToast } from "@/components/ui/use-toast"

interface Moderator {
  id: number
  userId: number
  username: string
  email: string
  role: 'admin' | 'moderator'
  permissions: string[]
  createdAt: string
}

export default function ModeratorsPage() {
  const [moderators, setModerators] = useState<Moderator[]>([])
  const [showDialog, setShowDialog] = useState(false)
  const [selectedModerator, setSelectedModerator] = useState<Moderator | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  // Fetch moderators
  useEffect(() => {
    fetchModerators()
  }, [])

  const fetchModerators = async () => {
    try {
      const response = await fetch('/api/moderators')
      if (!response.ok) throw new Error('Failed to fetch moderators')
      const data = await response.json()
      setModerators(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch moderators",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (moderator: Moderator) => {
    setSelectedModerator(moderator)
    setShowDialog(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Moderators</h2>
        <Button onClick={() => setShowDialog(true)}>
          <Plus className="h-4 w-4 mr-2" /> Add Moderator
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Moderator List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {moderators.map((mod) => (
                <TableRow key={mod.id}>
                  <TableCell>{mod.username}</TableCell>
                  <TableCell>{mod.email}</TableCell>
                  <TableCell>{mod.role}</TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline" onClick={() => handleEdit(mod)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <ModeratorDialog open={showDialog} onOpenChange={setShowDialog} moderator={selectedModerator} />
    </div>
  )
}

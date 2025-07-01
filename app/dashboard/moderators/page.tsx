// app/dashboard/moderators/page.tsx
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
      console.log('Fetched moderators:', data)
      setModerators(data)
    } catch (error) {
      console.error('Error fetching moderators:', error)
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

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/moderators/${id}`, {
        method: 'DELETE'
      })
      if (!response.ok) throw new Error('Failed to delete moderator')
      
      toast({
        title: "Success",
        description: "Moderator deleted successfully"
      })
      fetchModerators()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete moderator",
        variant: "destructive"
      })
    }
  }

  const handleSave = async (data: any) => {
    try {
      let response;
      if (selectedModerator) {
        // Update existing moderator
        response = await fetch(`/api/moderators/${selectedModerator.id}`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });
      } else {
        // Create new moderator
        response = await fetch('/api/moderators', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save moderator');
      }

      toast({
        title: "Success",
        description: `Moderator ${selectedModerator ? 'updated' : 'created'} successfully`
      });
      
      setShowDialog(false);
      setSelectedModerator(null);
      fetchModerators();
    } catch (error) {
      console.error('Error saving moderator:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save moderator",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Moderator Management</h2>
        <Button onClick={() => setShowDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Moderator
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Moderators</CardTitle>
        </CardHeader>
        <CardContent>
          {moderators.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Username</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Permissions</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {moderators.map((mod) => (
                  <TableRow key={mod.id}>
                    <TableCell>{mod.username}</TableCell>
                    <TableCell>{mod.email}</TableCell>
                    <TableCell>
                      <span className={`capitalize ${
                        mod.role === 'admin' ? 'text-blue-600' : 'text-green-600'
                      }`}>
                        {mod.role}
                      </span>
                    </TableCell>
                    <TableCell>{mod.permissions.join(', ')}</TableCell>
                    <TableCell>
                      {new Date(mod.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(mod)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(mod.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              No moderators found. Add some using the button above.
            </div>
          )}
        </CardContent>
      </Card>

      <ModeratorDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        moderator={selectedModerator}
        onSave={handleSave}
      />
    </div>
  )
}
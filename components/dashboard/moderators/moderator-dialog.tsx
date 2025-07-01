// components/dashboard/moderators/moderator-dialog.tsx
'use client'

import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { Input } from "@/components/ui/input"

interface User {
  id: number;
  username: string;
  email: string;
}

interface ModeratorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  moderator?: {
    id: number;
    userId: number;
    username: string;
    email: string;
    role: string;
    permissions: string[];
  } | null;
  onSave: (data: any) => Promise<void>;
}

const availablePermissions = [
  "delete_posts",
  "ban_users",
  "manage_comments",
  "view_analytics",
  "manage_moderators"
];

export function ModeratorDialog({ 
  open, 
  onOpenChange, 
  moderator, 
  onSave 
}: ModeratorDialogProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [role, setRole] = useState<'moderator' | 'admin'>('moderator');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const resetForm = () => {
    setSelectedUser('');
    setRole('moderator');
    setSelectedPermissions([]);
  };

  useEffect(() => {
    if (open && !moderator) {
      setUsers([]);
      setSearchTerm('');
      resetForm();
    }
  }, [open, moderator]);

  useEffect(() => {
    if (moderator) {
      setSelectedUser(moderator.username);
      setRole(moderator.role as 'moderator' | 'admin');
      setSelectedPermissions(moderator.permissions);
    }
  }, [moderator]);

  useEffect(() => {
    if (searchTerm.length > 1) {
      fetchUsers(searchTerm);
    } else {
      setUsers([]);
    }
  }, [searchTerm]);

  const fetchUsers = async (query?: string) => {
    try {
      const response = await fetch(`/api/analytics/users?username=${encodeURIComponent(query || '')}`);
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      // If single user, wrap in array
      setUsers(Array.isArray(data) ? data : [data]);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      let submitData;
      
      if (moderator) {
        // Editing existing moderator
        submitData = {
          id: moderator.id,
          role,
          permissions: selectedPermissions
        };
      } else {
        // Creating new moderator
        if (!selectedUser) {
          throw new Error('Please select a user');
        }
        const userData = users.find(u => u.username === selectedUser);
        if (!userData) {
          throw new Error('Selected user not found');
        }
        submitData = {
          userId: userData.id,
          role,
          permissions: selectedPermissions
        };
      }

      console.log('Submitting data:', submitData);
      await onSave(submitData);

      toast({
        title: "Success",
        description: `Moderator ${moderator ? 'updated' : 'created'} successfully`
      });

      onOpenChange(false);
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save moderator",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {moderator ? 'Edit Moderator' : 'Add New Moderator'}
          </DialogTitle>
          <DialogDescription>
            {moderator 
              ? 'Edit moderator details and permissions.' 
              : 'Add a new moderator and set their permissions.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {!moderator && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Search User</label>
              <Input
                placeholder="Type username or email..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                disabled={loading}
              />
              <label className="text-sm font-medium">Select User</label>
              <Select
                value={selectedUser}
                onValueChange={setSelectedUser}
                disabled={loading || users.length === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a user" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.username}>
                      {user.username} ({user.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {(moderator || selectedUser) && (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium">Role</label>
                <div className="flex gap-4">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="role-moderator"
                      name="role"
                      value="moderator"
                      checked={role === 'moderator'}
                      onChange={(e) => setRole(e.target.value as 'moderator' | 'admin')}
                      className="mr-2"
                    />
                    <label htmlFor="role-moderator">Moderator</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="role-admin"
                      name="role"
                      value="admin"
                      checked={role === 'admin'}
                      onChange={(e) => setRole(e.target.value as 'moderator' | 'admin')}
                      className="mr-2"
                    />
                    <label htmlFor="role-admin">Admin</label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Permissions</label>
                <div className="space-y-2">
                  {availablePermissions.map((permission) => (
                    <div key={permission} className="flex items-center space-x-2">
                      <Checkbox
                        id={permission}
                        checked={selectedPermissions.includes(permission)}
                        onCheckedChange={(checked) => {
                          setSelectedPermissions(prev => 
                            checked 
                              ? [...prev, permission]
                              : prev.filter(p => p !== permission)
                          );
                        }}
                      />
                      <label htmlFor={permission} className="text-sm font-medium">
                        {permission.split('_').map(word => 
                          word.charAt(0).toUpperCase() + word.slice(1)
                        ).join(' ')}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={loading || (!moderator && !selectedUser)}
          >
            {loading ? 'Saving...' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
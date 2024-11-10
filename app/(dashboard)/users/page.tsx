import { UserSearch } from '@/components/dashboard/users/user-search'

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">User Management</h2>
      <UserSearch />
    </div>
  )
}

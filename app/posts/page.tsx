'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { PostsList } from '@/components/dashboard/posts/posts-list'
import { TrendingSection } from '@/components/dashboard/posts/trending-section'
import { useToast } from "@/components/ui/use-toast"

export default function PostManagementPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [showFlagged, setShowFlagged] = useState(false)
  const { toast } = useToast()

  const handleSearch = async () => {
    // We'll pass this down to PostsList
    if (searchTerm.trim()) {
      const searchParams = new URLSearchParams({
        search: searchTerm.trim(),
        showFlagged: showFlagged.toString()
      })
      window.history.pushState({}, '', `?${searchParams.toString()}`)
    } else {
      window.history.pushState({}, '', window.location.pathname)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <div>
          <h2 className="text-2xl font-bold">Post Management</h2>
          <p className="text-muted-foreground">Manage and moderate user posts</p>
        </div>
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="w-[300px]"
          />
          <Button onClick={handleSearch}>
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <PostsList 
            searchTerm={searchTerm}
            showFlagged={showFlagged}
          />
        </div>
        <div className="col-span-1">
          <TrendingSection />
        </div>
      </div>
    </div>
  )
}

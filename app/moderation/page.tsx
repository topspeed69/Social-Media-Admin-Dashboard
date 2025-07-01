import { FlaggedContent } from '@/components/dashboard/moderation/flagged-content'

export default function ModerationPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold">Content Moderation</h2>
          <p className="text-muted-foreground">Review and moderate flagged content</p>
        </div>
      </div>
      <FlaggedContent />
    </div>
  )
}

import { Plus } from "lucide-react"
import React, { useState } from "react"
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../shared/ui/index"

import { AddPostDialog } from "../../features/add-post/ui/AddPostDialog"
import { PostTable, PostFilter, PostPagination } from "../../widgets/post-dashboard/ui"

const PostsManager = () => {
  // 상태 관리
  const [showAddDialog, setShowAddDialog] = useState<boolean>(false)

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>게시물 관리자</span>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            게시물 추가
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <PostFilter />
          <PostTable />
          <PostPagination />
        </div>
      </CardContent>

      <AddPostDialog isOpen={showAddDialog} setIsOpen={setShowAddDialog} />
    </Card>
  )
}

export default PostsManager

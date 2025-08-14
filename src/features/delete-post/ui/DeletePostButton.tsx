import React from "react"
import { useDeletePostMutation } from "../api/hooks/use-delete-post-mutation"
import { Button } from "../../../shared/ui"
import { Trash2 } from "lucide-react"

/**
 *DeletePostButton
 **/
export const DeletePostButton = React.memo(function DeletePostButton({ postId }: { postId: number }) {
  const { mutate } = useDeletePostMutation()

  return (
    <Button variant="ghost" size="sm" onClick={() => mutate(postId)}>
      <Trash2 className="w-4 h-4" />
    </Button>
  )
})

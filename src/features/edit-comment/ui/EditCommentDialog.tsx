import React from "react"
import { Button, Dialog, Textarea } from "../../../shared/ui"
import { useUpdateCommentMutation } from "../api/hooks/use-update-comment-mutation"
import { Comment } from "../../../entities/comment"
import { useForm } from "react-hook-form"

/**
 * EditCommentDialog
 **/
export const EditCommentDialog = React.memo(function EditCommentDialog({
  isOpen,
  setIsOpen,
  comment,
}: {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  comment: Comment
}) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>댓글 수정</Dialog.Title>
        </Dialog.Header>
        <EditCommentForm setIsOpen={setIsOpen} comment={comment} />
      </Dialog.Content>
    </Dialog>
  )
})

/**
 * EditCommentForm
 **/
const EditCommentForm = React.memo(function EditCommentForm({
  setIsOpen,
  comment,
}: {
  setIsOpen: (open: boolean) => void
  comment: Comment
}) {
  const { mutate: updateComment, isPending } = useUpdateCommentMutation()
  const { register, handleSubmit } = useForm<{ body: string }>({
    defaultValues: {
      body: comment?.body || "",
    },
  })

  const onSubmit = (data: { body: string }) => {
    updateComment({
      id: comment.id,
      data: { body: data.body },
    })
    setIsOpen(false)
  }

  return (
    <div className="space-y-4">
      <Textarea placeholder="댓글 내용" {...register("body")} rows={4} />
      <div className="flex justify-end gap-2">
        <Button onClick={handleSubmit(onSubmit)} disabled={isPending}>
          댓글 수정
        </Button>
      </div>
    </div>
  )
})

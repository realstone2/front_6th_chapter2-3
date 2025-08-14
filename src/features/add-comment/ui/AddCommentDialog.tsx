import React from "react"
import { Button, Dialog, Textarea } from "../../../shared/ui"
import { useCreateCommentMutation } from "../api/hooks/use-create-comment-mutation"

import { useForm } from "react-hook-form"

/**
 * AddCommentDialog
 **/
export const AddCommentDialog = React.memo(function AddCommentDialog({
  isOpen,
  setIsOpen,
  postId,
}: {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  postId: number
}) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>새 댓글 추가</Dialog.Title>
        </Dialog.Header>
        <AddCommentForm setIsOpen={setIsOpen} postId={postId} />
      </Dialog.Content>
    </Dialog>
  )
})

/**
 * AddCommentForm
 **/
const AddCommentForm = React.memo(function AddCommentForm({
  setIsOpen,
  postId,
}: {
  setIsOpen: (open: boolean) => void
  postId: number
}) {
  const { mutate: createComment, isPending } = useCreateCommentMutation()
  const { register, handleSubmit, reset } = useForm<{ body: string }>()

  const onSubmit = (data: { body: string }) => {
    createComment({
      body: data.body,
      postId,
      userId: 1,
    })

    setIsOpen(false)
  }

  const handleCancel = () => {
    reset()
    setIsOpen(false)
  }

  return (
    <div className="space-y-4">
      <Textarea placeholder="댓글 내용" {...register("body")} rows={4} />
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={handleCancel}>
          취소
        </Button>
        <Button onClick={handleSubmit(onSubmit)} disabled={isPending}>
          댓글 추가
        </Button>
      </div>
    </div>
  )
})

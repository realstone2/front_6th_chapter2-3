import React from "react"
import { Input } from "../../../shared/ui/input"
import { Textarea } from "../../../shared/ui/textarea"
import { Button } from "../../../shared/ui/button"
import { Dialog } from "../../../shared/ui/dialog"
import { CreatePostRequest } from "../api/services"
import { useCreatePostMutation } from "../api/hooks/use-create-post-mutation"
import { useForm } from "react-hook-form"

/**
 * AddPostDialog
 **/
export const AddPostDialog = React.memo(function AddPostDialog({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>새 게시물 추가</Dialog.Title>
        </Dialog.Header>
        <AddPostForm setIsOpen={setIsOpen} />
      </Dialog.Content>
    </Dialog>
  )
})

/**
 * AddPostForm
 **/
const AddPostForm = React.memo(function AddPostForm({ setIsOpen }: { setIsOpen: (open: boolean) => void }) {
  const { mutate: addPost } = useCreatePostMutation()

  const { register, handleSubmit } = useForm<CreatePostRequest>()

  const onSubmit = (data: CreatePostRequest) => {
    setIsOpen(false)
    addPost(data)
  }

  return (
    <div className="space-y-4">
      <Input placeholder="제목" {...register("title")} />
      <Textarea rows={30} placeholder="내용" {...register("body")} />
      <Input type="number" placeholder="사용자 ID" {...register("userId")} />
      <Button onClick={handleSubmit(onSubmit)}>게시물 추가</Button>
    </div>
  )
})

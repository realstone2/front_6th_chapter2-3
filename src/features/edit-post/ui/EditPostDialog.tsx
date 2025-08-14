import React from "react"
import { useForm } from "react-hook-form"
import { useGetPostDetail } from "../../../entities/post"
import { Post } from "../../../entities/post/model/types"
import { Button, Dialog, Input, Textarea } from "../../../shared/ui"
import { useUpdatePostMutation } from "../api/hooks/use-update-post-mutation"
import { UpdatePostRequest } from "../api/services"

/**
 *EditPostDialog
 **/
export const EditPostDialog = React.memo(function EditPostDialog({
  postId,
  isOpen,
  setIsOpen,
}: {
  postId: number
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}) {
  const { data: post } = useGetPostDetail(postId)

  if (!post) {
    return null
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>게시물 수정</Dialog.Title>
        </Dialog.Header>
        <EditPostForm currentPost={post} setIsOpen={setIsOpen} />
      </Dialog.Content>
    </Dialog>
  )
})

/**
 *EditPostForm
 **/
const EditPostForm = React.memo(function EditPostForm({
  currentPost,
  setIsOpen,
}: {
  currentPost: Post
  setIsOpen: (isOpen: boolean) => void
}) {
  const { mutate: updatePost } = useUpdatePostMutation()

  const { register, handleSubmit } = useForm<UpdatePostRequest>({
    values: {
      body: currentPost?.body,
      title: currentPost?.title,
      userId: currentPost?.userId,
    },
  })

  const onSubmit = (data: UpdatePostRequest) => {
    updatePost({ id: currentPost.id, data })
    setIsOpen(false)
  }

  return (
    <div className="space-y-4">
      <Input placeholder="제목" {...register("title")} />
      <Textarea rows={15} placeholder="내용" {...register("body")} />
      <Button onClick={handleSubmit(onSubmit)}>게시물 업데이트</Button>
    </div>
  )
})

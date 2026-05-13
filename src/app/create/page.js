import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidateTag } from 'next/cache'
import { createPost } from '@/data/posts'
import { getUserIdByToken } from '@/data/users'
import { initDatabase } from '@/db/init'
import { CreatePost } from '@/components/CreatePost'

export default function CreatePostPage() {
  const token = cookies().get('AUTH_TOKEN')

  async function createPostAction(postData) {
    'use server'
    const userId = getUserIdByToken(token?.value)
    await initDatabase()

    const post = await createPost(userId, {
      title: postData.title,
      contents: postData.contents,
      isPublic: postData.isPublic,
      image: postData.image,
      video: postData.video,
      voice: postData.voice,
    })

    revalidateTag('posts')
    redirect(`/posts/${post._id}`)
  }

  if (!token?.value) {
    return <strong>You need to be logged in to create posts!</strong>
  }

  return <CreatePost createPostAction={createPostAction} />
}

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidateTag } from 'next/cache'
import { createPost } from '@/data/posts'
import { getUserIdByToken } from '@/data/users'
import { initDatabase } from '@/db/init'
import { CreatePost } from '@/components/CreatePost'

async function uploadFile(file, type) {
  if (!file) return null

  const formData = new FormData()
  formData.append('file', file)
  formData.append('type', type)

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/v1/upload`, {
    method: 'POST',
    body: formData,
  })

  if (!res.ok) {
    throw new Error(`Upload failed: ${res.statusText}`)
  }

  return await res.json()
}

export default function CreatePostPage() {
  const token = cookies().get('AUTH_TOKEN')

  async function createPostAction(formData) {
    'use server'
    const userId = getUserIdByToken(token?.value)
    await initDatabase()

    const postData = {
      title: formData.get('title'),
      contents: formData.get('contents'),
      isPublic: formData.get('isPublic') === 'true',
    }

    // Handle file uploads
    const image = formData.get('image')
    const video = formData.get('video')
    const voice = formData.get('voice')

    if (image instanceof File && image.size > 0) {
      try {
        const uploadedImage = await uploadFile(image, 'image')
        postData.image = {
          filename: uploadedImage.filename,
          url: uploadedImage.url,
          size: uploadedImage.size,
        }
      } catch (error) {
        console.error('Image upload error:', error)
      }
    }

    if (video instanceof File && video.size > 0) {
      try {
        const uploadedVideo = await uploadFile(video, 'video')
        postData.video = {
          filename: uploadedVideo.filename,
          url: uploadedVideo.url,
          size: uploadedVideo.size,
        }
      } catch (error) {
        console.error('Video upload error:', error)
      }
    }

    if (voice instanceof File && voice.size > 0) {
      try {
        const uploadedVoice = await uploadFile(voice, 'voice')
        postData.voice = {
          filename: uploadedVoice.filename,
          url: uploadedVoice.url,
          size: uploadedVoice.size,
        }
      } catch (error) {
        console.error('Voice upload error:', error)
      }
    }

    const post = await createPost(userId, postData)
    revalidateTag('posts')
    redirect(`/posts/${post._id}`)
  }

  if (!token?.value) {
    return <strong>You need to be logged in to create posts!</strong>
  }

  return <CreatePost createPostAction={createPostAction} />
}

import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import { getVisiblePostById } from '@/data/posts'
import { getUserIdByToken } from '@/data/users'
import { initDatabase } from '@/db/init'
import { FullPost } from '@/components/FullPost'

export default async function ViewPostPage({ params }) {
  const token = cookies().get('AUTH_TOKEN')?.value
  let userId = null
  if (token) {
    try {
      userId = getUserIdByToken(token)
    } catch (err) {
      userId = null
    }
  }

  await initDatabase()
  const [id] = params.path
  const post = await getVisiblePostById(id, userId)
  if (!post) notFound()
  return (
    <FullPost
      title={post.title}
      contents={post.contents}
      author={post.author}
      isPublic={post.isPublic}
      image={post.image}
      video={post.video}
      voice={post.voice}
    />
  )
}

export async function generateMetadata({ params }) {
  const [id] = params.path
  const token = cookies().get('AUTH_TOKEN')?.value
  let userId = null
  if (token) {
    try {
      userId = getUserIdByToken(token)
    } catch (err) {
      userId = null
    }
  }

  const post = await getVisiblePostById(id, userId)
  if (!post) notFound()

  return {
    title: `${post.title} | Full-Stack Next.js Blog`,
    description: `Written by ${post.author.username}`,
  }
}

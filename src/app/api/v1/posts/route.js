import { initDatabase } from '@/db/init'
import { listPublicPosts } from '@/data/posts'

export async function GET() {
  await initDatabase()
  const posts = await listPublicPosts()
  return Response.json({ posts, currentTime: Date.now() })
}

export const dynamic = 'force-dynamic'

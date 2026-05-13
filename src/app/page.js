import { cookies } from 'next/headers'
import { initDatabase } from '@/db/init'
import { listVisiblePosts } from '@/data/posts'
import { getUserIdByToken } from '@/data/users'
import { PostList } from '@/components/PostList'

export default async function HomePage() {
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
  const posts = await listVisiblePosts(userId)
  const pageTag = userId ? 'My feed' : 'Public posts'
  const pageSummary = userId
    ? 'You can see your own posts plus public posts from other users.'
    : 'This page shows only public posts. Log in to create private posts or view your own.'

  return (
    <section className='home-page'>
      <div className='page-intro'>
        <p className='page-tag'>{pageTag}</p>
        <p className='page-summary'>{pageSummary}</p>
        <p className='debug-info'>Found {posts.length} posts</p>
      </div>
      <PostList posts={posts} />
    </section>
  )
}

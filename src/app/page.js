import { initDatabase } from '@/db/init'
import { listPublicPosts } from '@/data/posts'
import { PostList } from '@/components/PostList'

export default async function HomePage() {
  await initDatabase()
  const posts = await listPublicPosts()
  const pageTag = 'Public posts'
  const pageSummary = 'This page shows only public posts. Log in to create private posts or view your own.'

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

import { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Post } from './Post.jsx'

export function PostList({ posts = [] }) {
  return (
    <section className='posts-list'>
      <div className='posts-meta'>
        <p className='posts-note'>Showing {posts.length} post{posts.length === 1 ? '' : 's'} from all signed-in users.</p>
      </div>
      {posts.length === 0 ? (
        <div className='notice'>No posts yet — create your first post to get started.</div>
      ) : (
        posts.map((post) => (
          <Fragment key={`post-${post._id}`}>
            <Post
              _id={post._id}
              title={post.title}
              author={post.author}
              isPublic={post.isPublic}
              contents={post.contents}
              image={post.image}
              video={post.video}
              voice={post.voice}
            />
            <hr />
          </Fragment>
        ))
      )}
    </section>
  )
}

PostList.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.shape(Post.propTypes)).isRequired,
}

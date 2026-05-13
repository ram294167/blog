import PropTypes from 'prop-types'
import Link from 'next/link'
import slug from 'slug'

export function Post({ _id, title, author, isPublic }) {
  return (
    <article className='post-card'>
      <div className={`post-visibility ${isPublic ? 'public' : 'private'}`}>
        {isPublic ? 'Public' : 'Private'}
      </div>
      <h3>
        <Link href={`/posts/${_id}/${slug(title)}`}>{title}</Link>
      </h3>
      <em>
        Written by <strong>{author.username}</strong>
      </em>
    </article>
  )
}

Post.propTypes = {
  _id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  author: PropTypes.shape({
    username: PropTypes.string.isRequired,
  }).isRequired,
  isPublic: PropTypes.bool,
  contents: PropTypes.string,
}

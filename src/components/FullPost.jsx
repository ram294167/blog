import PropTypes from 'prop-types'

export function FullPost({ title, contents, author, isPublic }) {
  return (
    <article className='post-card'>
      <div className={`post-visibility ${isPublic ? 'public' : 'private'}`}>
        {isPublic ? 'Public' : 'Private'}
      </div>
      <h3>{title}</h3>
      <div>{contents}</div>
      <br />
      <em>
        Written by <strong>{author.username}</strong>
      </em>
    </article>
  )
}

FullPost.propTypes = {
  title: PropTypes.string.isRequired,
  author: PropTypes.shape({
    username: PropTypes.string.isRequired,
  }).isRequired,
  isPublic: PropTypes.bool,
  contents: PropTypes.string,
}

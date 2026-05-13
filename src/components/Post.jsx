import PropTypes from 'prop-types'
import Link from 'next/link'
import slug from 'slug'

export function Post({ _id, title, author, isPublic, contents, image, video, voice }) {
  const hasMedia = image || video || voice
  const mediaTypes = []
  if (image) mediaTypes.push('📸')
  if (video) mediaTypes.push('🎬')
  if (voice) mediaTypes.push('🎙️')

  return (
    <article className='post-card'>
      <div className={`post-visibility ${isPublic ? 'public' : 'private'}`}>
        {isPublic ? 'Public' : 'Private'}
      </div>
      <h3>
        <Link href={`/posts/${_id}/${slug(title)}`}>{title}</Link>
      </h3>

      {contents && (
        <div className='post-preview'>
          {contents.length > 150 ? `${contents.substring(0, 150)}...` : contents}
        </div>
      )}

      {hasMedia && (
        <div className='post-media-preview'>
          <span className='media-indicators'>
            {mediaTypes.join(' ')} Media attached
          </span>
        </div>
      )}

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
  image: PropTypes.shape({
    url: PropTypes.string,
    filename: PropTypes.string,
  }),
  video: PropTypes.shape({
    url: PropTypes.string,
    filename: PropTypes.string,
  }),
  voice: PropTypes.shape({
    url: PropTypes.string,
    filename: PropTypes.string,
  }),
}

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

      {image && image.url ? (
        <div className='post-media-preview post-image-preview'>
          <a href={image.url} target='_blank' rel='noopener noreferrer'>
            <img
              src={image.url}
              alt={title}
              style={{ maxWidth: '100%', height: 'auto', borderRadius: '12px' }}
            />
          </a>
          <p>
            <a href={image.url} target='_blank' rel='noopener noreferrer'>View image</a>
          </p>
        </div>
      ) : null}

      {video && video.url ? (
        <div className='post-media-preview post-video-preview'>
          <div className='media-label'>🎬 Video attached</div>
          <p>
            <a href={video.url} target='_blank' rel='noopener noreferrer'>Open video</a>
          </p>
        </div>
      ) : null}

      {voice && voice.url ? (
        <div className='post-media-preview post-audio-preview'>
          <div className='media-label'>🎙️ Audio attached</div>
          <p>
            <a href={voice.url} target='_blank' rel='noopener noreferrer'>Open audio</a>
          </p>
        </div>
      ) : null}

      {!image?.url && !video?.url && !voice?.url && hasMedia && (
        <div className='post-media-preview'>
          <span className='media-indicators'>
            {mediaTypes.join(' ')} Media attached
          </span>
        </div>
      )}

      <div className='post-footer'>
        <em>Written by <strong>{author.username}</strong></em>
        <div className='view-post-link'>
          <Link href={`/posts/${_id}/${slug(title)}`}>View post</Link>
        </div>
      </div>
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

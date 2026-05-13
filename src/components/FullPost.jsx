import PropTypes from 'prop-types'

export function FullPost({ title, contents, author, isPublic, image, video, voice }) {
  return (
    <article className='post-card full-post'>
      <div className={`post-visibility ${isPublic ? 'public' : 'private'}`}>
        {isPublic ? 'Public' : 'Private'}
      </div>
      <h3>{title}</h3>
      
      <div className='post-content'>
        {contents}
      </div>

      {image && image.url && (
        <div className='post-media post-image'>
          <img src={image.url} alt={title} />
        </div>
      )}

      {video && video.url && (
        <div className='post-media post-video'>
          <video controls style={{ width: '100%', borderRadius: '12px' }}>
            <source src={video.url} />
            Your browser does not support the video tag.
          </video>
        </div>
      )}

      {voice && voice.url && (
        <div className='post-media post-voice'>
          <div className='voice-player'>
            <span className='voice-icon'>🎙️</span>
            <audio controls style={{ flex: 1 }}>
              <source src={voice.url} />
              Your browser does not support the audio tag.
            </audio>
          </div>
        </div>
      )}

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

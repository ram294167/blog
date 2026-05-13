'use client'

import { useState } from 'react'
import PropTypes from 'prop-types'
import { VoiceRecorder } from './VoiceRecorder'

export function CreatePost({ createPostAction }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [previewImage, setPreviewImage] = useState(null)
  const [attachments, setAttachments] = useState({
    image: null,
    video: null,
    voice: null,
  })

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setAttachments(prev => ({ ...prev, image: file }))
      const reader = new FileReader()
      reader.onload = (event) => setPreviewImage(event.target?.result)
      reader.readAsDataURL(file)
    }
  }

  const handleVideoChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setAttachments(prev => ({ ...prev, video: file }))
    }
  }

  const handleVoiceRecorded = (blob) => {
    const file = new File([blob], 'voice-recording.webm', { type: 'audio/webm' })
    setAttachments(prev => ({ ...prev, voice: file }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formData = new FormData(e.target)
      
      if (attachments.image) formData.append('image', attachments.image)
      if (attachments.video) formData.append('video', attachments.video)
      if (attachments.voice) formData.append('voice', attachments.voice)

      await createPostAction(formData)
      
      setAttachments({ image: null, video: null, voice: null })
      setPreviewImage(null)
      e.target.reset()
    } catch (error) {
      console.error('Error creating post:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className='create-post-card' onSubmit={handleSubmit}>
      <div className='form-header'>
        <h2>Create New Post</h2>
        <p className='form-subtitle'>Share your thoughts and media with the community</p>
      </div>

      <div className='form-group'>
        <label htmlFor='title'>Post Title</label>
        <input
          type='text'
          name='title'
          id='title'
          placeholder="What's on your mind?"
          required
          disabled={isSubmitting}
        />
      </div>

      <div className='form-group'>
        <label htmlFor='contents'>Content</label>
        <textarea
          name='contents'
          id='contents'
          placeholder='Write your post content here... You can also add images, videos, or voice recordings below.'
          required
          disabled={isSubmitting}
        />
      </div>

      <div className='media-section'>
        <div className='media-subsection'>
          <label className='media-label'>📸 Add Image</label>
          <div className='file-input-wrapper'>
            <input
              type='file'
              id='image'
              name='image'
              accept='image/*'
              onChange={handleImageChange}
              disabled={isSubmitting}
            />
            <span className='file-input-placeholder'>
              {attachments.image ? `✓ ${attachments.image.name}` : 'Choose an image or drag here'}
            </span>
          </div>
          {previewImage && (
            <div className='media-preview'>
              <img src={previewImage} alt='Preview' />
              <button
                type='button'
                className='remove-media'
                onClick={() => {
                  setAttachments(prev => ({ ...prev, image: null }))
                  setPreviewImage(null)
                  document.getElementById('image').value = ''
                }}
              >
                ✕
              </button>
            </div>
          )}
        </div>

        <div className='media-subsection'>
          <label className='media-label'>🎬 Add Video</label>
          <div className='file-input-wrapper'>
            <input
              type='file'
              id='video'
              name='video'
              accept='video/*'
              onChange={handleVideoChange}
              disabled={isSubmitting}
            />
            <span className='file-input-placeholder'>
              {attachments.video ? `✓ ${attachments.video.name}` : 'Choose a video or drag here'}
            </span>
          </div>
        </div>

        <div className='media-subsection'>
          <label className='media-label'>🎤 Record Voice</label>
          <VoiceRecorder
            onVoiceRecorded={handleVoiceRecorded}
            disabled={isSubmitting}
            currentRecording={attachments.voice}
            onClear={() => setAttachments(prev => ({ ...prev, voice: null }))}
          />
        </div>
      </div>

      <div className='form-group checkbox-group'>
        <label className='checkbox-label'>
          <input type='checkbox' name='isPublic' value='true' disabled={isSubmitting} />
          <span>Make this post public</span>
        </label>
      </div>

      <button
        type='submit'
        className='button-primary button-large'
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Publishing...' : 'Publish Post'}
      </button>
    </form>
  )
}

CreatePost.propTypes = {
  createPostAction: PropTypes.func.isRequired,
}

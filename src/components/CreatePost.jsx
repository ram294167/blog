'use client'

import { useState } from 'react'
import PropTypes from 'prop-types'
import { VoiceRecorder } from './VoiceRecorder'

const MAX_UPLOAD_SIZE = 150 * 1024 * 1024

const formatBytes = (bytes) => {
  if (!bytes) return '0 B'
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`
}

export function CreatePost({ createPostAction }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [previewImage, setPreviewImage] = useState(null)
  const [isPublic, setIsPublic] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [uploadWarning, setUploadWarning] = useState('')
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
      if (file.size > MAX_UPLOAD_SIZE) {
        setUploadWarning(
          `Selected video is too large (${formatBytes(file.size)}). Maximum allowed upload size is ${formatBytes(MAX_UPLOAD_SIZE)}.`
        )
      } else {
        setUploadWarning(
          `Selected video size: ${formatBytes(file.size)}. It will upload if below ${formatBytes(MAX_UPLOAD_SIZE)}.`
        )
      }
    }
  }

  const handleVoiceRecorded = (blob) => {
    const file = new File([blob], 'voice-recording.webm', { type: 'audio/webm' })
    setAttachments(prev => ({ ...prev, voice: file }))
  }

  const uploadAttachment = async (file, type) => {
    const uploadData = new FormData()
    uploadData.append('file', file)
    uploadData.append('type', type)

    const res = await fetch('/api/v1/upload', {
      method: 'POST',
      body: uploadData,
    })

    if (!res.ok) {
      const errorData = await res.json().catch(() => null)
      throw new Error(errorData?.error || res.statusText)
    }

    return res.json()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')
    setIsSubmitting(true)

    try {
      const form = e.target
      const payload = {
        title: form.title.value,
        contents: form.contents.value,
        isPublic,
        image: null,
        video: null,
        voice: null,
      }

      if (attachments.video && attachments.video.size > MAX_UPLOAD_SIZE) {
        setErrorMessage(
          `Video is too large (${formatBytes(attachments.video.size)}). Please choose a video smaller than ${formatBytes(MAX_UPLOAD_SIZE)}.`
        )
        setIsSubmitting(false)
        return
      }

      if (attachments.image) {
        const uploadedImage = await uploadAttachment(attachments.image, 'image')
        payload.image = {
          filename: uploadedImage.filename,
          url: uploadedImage.url,
          size: uploadedImage.size,
          type: uploadedImage.type,
        }
      }

      if (attachments.video) {
        const uploadedVideo = await uploadAttachment(attachments.video, 'video')
        payload.video = {
          filename: uploadedVideo.filename,
          url: uploadedVideo.url,
          size: uploadedVideo.size,
          type: uploadedVideo.type,
        }
      }

      if (attachments.voice) {
        const uploadedVoice = await uploadAttachment(attachments.voice, 'voice')
        payload.voice = {
          filename: uploadedVoice.filename,
          url: uploadedVoice.url,
          size: uploadedVoice.size,
          type: uploadedVoice.type,
        }
      }

      await createPostAction(payload)

      setAttachments({ image: null, video: null, voice: null })
      setPreviewImage(null)
      setIsPublic(false)
      form.reset()
    } catch (error) {
      console.error('Error creating post:', error)
      setErrorMessage(error.message || 'Unable to create post. Please try again.')
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
          {attachments.video && uploadWarning && (
            <div className={`media-warning ${attachments.video.size > MAX_UPLOAD_SIZE ? 'danger' : 'info'}`}>
              {uploadWarning}
            </div>
          )}
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
          <input 
            type='checkbox' 
            name='isPublic' 
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
            disabled={isSubmitting} 
          />
          <span className='checkbox-status'>
            {isPublic ? '🌐 Public - Everyone can see' : '🔒 Private - Only you can see'}
          </span>
        </label>
        <small className='checkbox-hint'>
          {isPublic 
            ? 'This post will be visible to all logged-in users' 
            : 'This post will only be visible to you'}
        </small>
      </div>

      {errorMessage && (
        <div className='form-error'>
          {errorMessage}
        </div>
      )}

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

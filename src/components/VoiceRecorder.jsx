'use client'

import { useState, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'

export function VoiceRecorder({ onVoiceRecorded, disabled, currentRecording, onClear }) {
  const [isRecording, setIsRecording] = useState(false)
  const [duration, setDuration] = useState(0)
  const mediaRecorderRef = useRef(null)
  const streamRef = useRef(null)
  const timerRef = useRef(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder

      const chunks = []
      mediaRecorder.ondataavailable = (event) => chunks.push(event.data)
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' })
        onVoiceRecorded(blob)
      }

      mediaRecorder.start()
      setIsRecording(true)
      setDuration(0)

      timerRef.current = setInterval(() => {
        setDuration(prev => prev + 1)
      }, 1000)
    } catch (error) {
      console.error('Error accessing microphone:', error)
      alert('Unable to access microphone. Please check permissions.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      if (timerRef.current) clearInterval(timerRef.current)
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className='voice-recorder'>
      {isRecording ? (
        <div className='recording-active'>
          <div className='recording-indicator'>
            <span className='recording-dot'></span>
            <span>Recording: {formatTime(duration)}</span>
          </div>
          <button
            type='button'
            className='button-danger button-small'
            onClick={stopRecording}
            disabled={disabled}
          >
            Stop Recording
          </button>
        </div>
      ) : (
        <div>
          <button
            type='button'
            className='button-secondary button-small'
            onClick={startRecording}
            disabled={disabled || currentRecording !== null}
          >
            🎙️ Start Recording
          </button>
          {currentRecording && (
            <div className='voice-recorded'>
              <span>✓ Voice message recorded ({formatTime(duration)})</span>
              <button
                type='button'
                className='button-text'
                onClick={() => {
                  onClear()
                  setDuration(0)
                }}
              >
                Remove
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

VoiceRecorder.propTypes = {
  onVoiceRecorded: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  currentRecording: PropTypes.object,
  onClear: PropTypes.func.isRequired,
}

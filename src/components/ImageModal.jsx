'use client'

import { useState } from 'react'
import PropTypes from 'prop-types'

export function ImageModal({ src, alt, onClose }) {
  if (!src) return null

  return (
    <div className='modal-overlay' onClick={onClose}>
      <div className='modal-content' onClick={(e) => e.stopPropagation()}>
        <button className='modal-close' onClick={onClose}>×</button>
        <img src={src} alt={alt} className='modal-image' />
      </div>
    </div>
  )
}

ImageModal.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
  onClose: PropTypes.func.isRequired,
}
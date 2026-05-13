import PropTypes from 'prop-types'

export function CreatePost({ createPostAction }) {
  return (
    <form className='form-card' action={createPostAction}>
      <h2>Create Post</h2>
      <div className='form-group'>
        <label htmlFor='title'>Title</label>
        <input type='text' name='title' id='title' required />
      </div>
      <div className='form-group'>
        <label htmlFor='contents'>Contents</label>
        <textarea name='contents' id='contents' required />
      </div>
      <div className='form-group'>
        <label className='checkbox-label'>
          <input type='checkbox' name='isPublic' value='true' />
          Make this post public
        </label>
      </div>
      <input type='submit' className='button-primary' value='Create Post' />
    </form>
  )
}

CreatePost.propTypes = {
  createPostAction: PropTypes.func.isRequired,
}

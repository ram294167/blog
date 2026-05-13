'use client'
import { useFormState } from 'react-dom'
import PropTypes from 'prop-types'

export function Login({ loginAction }) {
  const [state, formAction] = useFormState(loginAction, {})
  return (
    <form className='form-card' action={formAction}>
      <h2>Log In</h2>
      <div className='form-group'>
        <label htmlFor='username'>Username</label>
        <input type='text' name='username' id='username' required />
      </div>
      <div className='form-group'>
        <label htmlFor='password'>Password</label>
        <input type='password' name='password' id='password' required />
      </div>
      <input type='submit' className='button-primary' value='Log In' />
      {state.error ? <div className='form-error'>Error logging in: {state.error}</div> : null}
    </form>
  )
}

Login.propTypes = {
  loginAction: PropTypes.func.isRequired,
}

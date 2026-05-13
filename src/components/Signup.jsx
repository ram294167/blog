'use client'
import { useFormState } from 'react-dom'
import PropTypes from 'prop-types'

export function Signup({ signupAction }) {
  const [state, formAction] = useFormState(signupAction, {})
  return (
    <form className='form-card' action={formAction}>
      <h2>Sign Up</h2>
      <div className='form-group'>
        <label htmlFor='username'>Username</label>
        <input type='text' name='username' id='username' required />
      </div>
      <div className='form-group'>
        <label htmlFor='password'>Password</label>
        <input type='password' name='password' id='password' required />
      </div>
      <input type='submit' className='button-primary' value='Sign Up' />
      {state.error ? <div className='form-error'>Error signing up: {state.error}</div> : null}
    </form>
  )
}

Signup.propTypes = {
  signupAction: PropTypes.func.isRequired,
}

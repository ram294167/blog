import Link from 'next/link'
import PropTypes from 'prop-types'

export function UserBar({ username, logoutAction }) {
  return (
    <form className='user-bar' action={logoutAction}>
      <span className='user-info'>Logged in as <strong>{username}</strong></span>
      <button type='submit'>Logout</button>
    </form>
  )
}

UserBar.propTypes = {
  username: PropTypes.string.isRequired,
  logoutAction: PropTypes.func.isRequired,
}

export function LoginSignupLinks() {
  return (
    <div className='auth-links'>
      <Link href='/login'>Log In</Link>
      <Link href='/signup'>Sign Up</Link>
    </div>
  )
}

export function Navigation({ username, logoutAction }) {
  return (
    <div className='site-nav'>
      <Link href='/'>Home</Link>
      <Link href='/create'>Create Post</Link>
      {username ? (
        <UserBar username={username} logoutAction={logoutAction} />
      ) : (
        <LoginSignupLinks />
      )}
    </div>
  )
}

Navigation.propTypes = {
  username: PropTypes.string,
  logoutAction: PropTypes.func.isRequired,
}

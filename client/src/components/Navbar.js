import React from 'react'
import { Link } from 'react-router-dom'
import { useCookies } from 'react-cookie'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {
  const [ cookies, setCookies ] = useCookies(['access_token'])
  const navigate = useNavigate()

  const Logout = () => {
    setCookies('access_token', '')
    window.localStorage.removeItem('userId')
    navigate('/auth')
  }

  return (
    <div className='navbar'>
      {!cookies.access_token ? (
        <>
          <Link to='/'>Home</Link>
          <img src='./coursehelper.png' alt='logo'/>
          <Link to='/auth'>Login/Register</Link>
        </>
      ) : (
        <>
          <img src='./coursehelper.png' alt='logo'/>
          <Link to='/'>Home</Link>
          <Link to='/add-class'>Add Class</Link>
          <Link to='/user-reviews'>Your Reviews</Link>
          <button onClick={Logout}>Logout</button>
        </>
      )}
    </div>
  )
}

export default Navbar
import React, { useState } from 'react'
import axios from 'axios'
import { useCookies } from 'react-cookie'
import { useNavigate } from 'react-router-dom'

const Auth = ({ alertOpen, setAlertOpen, setAlertMessage }) => {
  return (
    <div className='auth'>
      <Login alertOpen={alertOpen} setAlertOpen={setAlertOpen} setAlertMessage={setAlertMessage}/>
      <Register alertOpen={alertOpen} setAlertOpen={setAlertOpen} setAlertMessage={setAlertMessage}/>
    </div>
  )
}

const Login = ({ alertOpen, setAlertOpen, setAlertMessage }) => {
  const [ username, setUsername ] = useState('')
  const [ password, setPassword ] = useState('')
  const [ , setCookies] = useCookies(['access_token'])
  const navigate = useNavigate()

  const onSubmit = async (event) => {
    event.preventDefault()
    try{
      const response = await axios.post('https://course-helper-api.vercel.app/auth/login', {
        username,
        password
      })

      
      if(response.data.message){
        setAlertMessage(response.data.message)
        setAlertOpen(true)
        return
      }

      setCookies('access_token', response.data.token)
      window.localStorage.setItem('userId', response.data.userId)
      navigate('/')
    } catch (error){
      console.error(error)
    }
  }

  return (
    <Form 
      username={username} 
      setUsername={setUsername} 
      password={password} 
      setPassword={setPassword} 
      label='Login'
      onSubmit={onSubmit}
    />
  )
}

const Register = ({ alertOpen, setAlertOpen, setAlertMessage }) => {
  const [ username, setUsername ] = useState('')
  const [ password, setPassword ] = useState('')

  const onSubmit = async (event) => {
    event.preventDefault()
    try {
      const response = await axios.post('https://course-helper-api.vercel.app/auth/register', {
        username,
        password
      })
      //alert(response.data.message)
      setAlertMessage(response.data.message)
      setAlertOpen(true)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Form 
      username={username} 
      setUsername={setUsername} 
      password={password} 
      setPassword={setPassword} 
      label='Register'
      onSubmit={onSubmit}
    />
  )
}

const Form = ({username, setUsername, password, setPassword, label, onSubmit}) => {
  return (
    <div className='auth-container'>
      <form onSubmit={onSubmit}>
        <h2>{label}</h2>
        <div className='form-group'>
          <label htmlFor='username'> Username: </label>
          <input type='text' id='username' value={username} onChange={(e) => setUsername(e.target.value)}/>
        </div>
        <div className='form-group'>
          <label htmlFor='password'> Password: </label>
          <input type='password' id='password' value={password} onChange={(e) => setPassword(e.target.value)}/>
        </div>
        <button type='submit'>{label}</button>
      </form>
    </div>
  )
}

export default Auth

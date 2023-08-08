import React, { useState } from 'react'
import axios from 'axios'
import { useGetUserId } from '../hooks/useGetUserId'
import { useNavigate } from 'react-router-dom'
import { useCookies } from 'react-cookie'

const AddClass = ({ alertOpen, setAlertOpen, setAlertMessage }) => {
  const userId = useGetUserId()
  const [ cookies, ] = useCookies(['access_token'])

  const [ course, setCourse ] = useState({
    name: '',
    description: '',
    prerequisites: [],
    userOwner: userId
  })

  const navigate = useNavigate()

  const handleChange = (event) => {
    const { name, value } = event.target
    setCourse({...course, [name]: value}) //just changes one aspect of the course object
  }

  const handlePrereqChange = (event, index) => {
    const { value } = event.target
    const capitalizedPrereq = value.toUpperCase()
    const prerequisites = course.prerequisites
    prerequisites[index] = capitalizedPrereq
    setCourse({...course, prerequisites: prerequisites})
  }

  const addPrereq = () => { 
    setCourse({...course, prerequisites: [...course.prerequisites, '']})
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    if (course.name === '' || course.description === ''){
      //alert('You need to fill in all applicable parts')
      setAlertMessage('You need to fill in all applicable parts')
      setAlertOpen(true)
      return
    }
    const courseName = course.name.toUpperCase()
    course.name = courseName
    try{
      const res = await axios.post('http://localhost:4000/courses', course, { headers: {authorization: cookies.access_token}})
      //alert(res.data.message)
      setAlertMessage(res.data.message)
      setAlertOpen(true)
      navigate('/')
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className='add-class'>
      <h2>Add Class</h2>
      <form onSubmit={onSubmit}>
        <label htmlFor='name'>Name</label>
        <input type='text' id='name' name='name' onChange={handleChange}/>

        <label htmlFor='description'>Description</label>
        <textarea id='description' name='description' onChange={handleChange}></textarea>

        <label htmlFor='prerequisites'>Prerequisites</label>
        {course.prerequisites.map((prerequisite, index) => (
          <input 
            key={index} 
            type='text' 
            id='prerequisites'
            name='prerequisites' 
            // value={prerequisite} 
            onChange={(event) => handlePrereqChange(event, index)} 
          />
        ))}
        <button className='prereq-btn' type='button' onClick={addPrereq}>Add Prerequisite</button>

        <button className='submit-button' type='submit'>
          Add Class
        </button>
      </form>
    </div>
  )
}

export default AddClass
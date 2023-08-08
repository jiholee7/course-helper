import React from 'react'

const Alert = ({ alertOpen, setAlertOpen, alertMessage }) => {

  return (
    <div className='alert'>
      <div className='alert-message'>
        <h2>{alertMessage}</h2>
        <button onClick={() => setAlertOpen(false)}>Close</button>
      </div>
      <div className='alert-background' onClick={() => setAlertOpen(false)}></div>
    </div>
  )
}

export default Alert
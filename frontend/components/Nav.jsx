import React from 'react'

const Nav = () => {
  return (
    <div className='Navigation'>
        <a href="/">
          <img 
            src="../assets/Logo.png" 
            alt="HomePage"
            style={{ width: '150px', height: '50px' }}
          />
        </a>
        <ul>
          <li>Loan Track</li>
          <li>Admin Page</li>
          <li>Tutorial</li>
        </ul>
    </div>
  )
}

export default Nav
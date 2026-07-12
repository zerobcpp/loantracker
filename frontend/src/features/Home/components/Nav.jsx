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
          
          <li><a href="/loan">Loan Track</a></li>
          <li><a href="/admin">Admin Page</a></li>
          <li><a href="/insurance">Insurance</a></li>
          <li><a href="/tutorial">Tutorial</a></li>
        </ul>
    </div>
  )
}

export default Nav
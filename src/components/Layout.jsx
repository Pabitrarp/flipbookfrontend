import React from 'react'
import {Header} from './Header.jsx'

export const Layout = ({children}) => {
  return (
    <div>
        
          <Header />
    
        <div>
           {children}
        </div>
    </div>
  )
}

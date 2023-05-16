import * as React from 'react'
import { Outlet } from 'react-router-dom'
import { Navbar } from './navbar/Navbar'
import { ForceGraph2D } from 'react-force-graph'
import axios from 'axios'
// import { Provider } from 'react-redux'

export const App = () => {

    return <div className='row justify-content-center g-0'>
        <div className='col-12'>
            
            <Navbar />
            <Outlet />
            
        </div>
    </div>
        
}
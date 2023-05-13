import * as React from 'react'
import { Outlet } from 'react-router-dom'
import { Navbar } from './navbar/Navbar'
import { ForceGraph2D } from 'react-force-graph'
import axios from 'axios'
// import { Provider } from 'react-redux'

export const App = () => {

    return <div style={{height: '100vh', width: '100vw'}}>
        <Outlet />
    </div>
}
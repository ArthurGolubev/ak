import * as React from 'react'
import { Outlet } from 'react-router'


export const Main = () => {

    return <div className='row justify-content-center g-0'>
        <div className='col-12'>
            <Outlet />
        </div>
    </div>
}
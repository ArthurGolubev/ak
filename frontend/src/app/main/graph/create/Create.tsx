import * as React from 'react'
import { Link, Outlet } from 'react-router-dom'


export const Create = () => {

    return <div className='row justify-content-center mt-4'>
        <div className='col-12'>

            <div className='row justify-content-center'>
                <div className='col-auto'>
                    <div className='btn-group'>
                        <Link to={'/main/graph-view/create/node'} className='btn btn-primary'>Node</Link>
                        <Link to={'/main/graph-view/create/link'} className='btn btn-primary'>Link</Link>
                    </div>
                </div>
            </div>

            <div className='row justify-content-center mt-4'>
                <div className='col-12'>
                    <Outlet />
                </div>
            </div>

        </div>
    </div>
}
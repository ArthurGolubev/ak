import * as React from 'react'
import { useGraphStore } from '../../store'
import { Link, Outlet, useLocation } from 'react-router-dom'

export const GraphSideBar = () => {

    const {fetchGraph, isLoading} = useGraphStore((state) => ({
        isLoading: state.isLoading,
        fetchGraph: state.fetchGraph,
    }))

    const location = useLocation()



    React.useEffect(() => {
        const result = async () => fetchGraph()
        result()
    }, [])

    return <div className='card' style={{height: '94vh'}}>
        <div className='card-body'>

            <div className='row justify-content-center'>
                <div className='col-12'>
                    <ul className='nav nav-tabs'>
                        <li className='nav-item'>
                            <Link
                                className={location.pathname == '/main/graph-view/create' ? 'nav-link active' : 'nav-link' }
                                to={'/main/graph-view/create'}>Create</Link>
                        </li>
                        <li className='nav-item'>
                            <Link
                                className={location.pathname == '/main/graph-view/info' ? 'nav-link active' : 'nav-link' }
                                to={'/main/graph-view/info'}>Info</Link>
                        </li>
                        <li className='nav-item'>
                            <Link
                                className={location.pathname == '/main/graph-view/delete' ? 'nav-link active' : 'nav-link' }
                                to={'/main/graph-view/delete'}>Delete</Link>
                        </li>
                    </ul>
                </div>
            </div>
            
            <Outlet />

        </div>
    </div>
}
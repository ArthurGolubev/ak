import * as React from "react"
import { Link } from "react-router-dom"

export const Navbar = () => {

    return <nav className='navbar navbar-expand-sm bg-light' style={{height: '5vh'}}>
        <div className='container-fluid'>
            <Link className='navbar-brand' to={'/'}>
                gra
            </Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
        
            <div className="collapse navbar-collapse " id="navbarNav">
                {/* <div className='col-auto text-center'>
                    {isLoadingSub && <LoadingStatus />}
                </div> */}
                <div className='ms-auto'>
                    <div className='row justify-content-center'>
                        <div className='col'>
                            <ul className="navbar-nav">
                                <li className="nav-item">
                                    <a href='#/user/authorization' className='nav-link active' type='button'>Authorization</a>
                                </li>
                                <li className="nav-item">
                                    <a href='#/user/registration' className='nav-link active' type='button'>Registration</a>
                                </li>
                                <li className="nav-item">
                                    <a href='#/main/graph-view/info' className='nav-link active' type='button'>graph</a>
                                </li>
                            </ul>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </nav>
}
import * as React from "react"
import { Link } from "react-router-dom"

export const Navbar = () => {

    return <div className='navbar-expand-sm bg-light' style={{height: '5vh'}} >
        <div className='container-fluid'>
            <Link className='navbar-brand' to={'/'}>
                gra
            </Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
        </div>
    </div>
}
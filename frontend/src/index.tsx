import * as ReactDOM from "react-dom/client"
import * as React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import "bootstrap-icons/font/bootstrap-icons.css"
import { RouterProvider } from 'react-router-dom'
import { router } from "./Router"



const root = ReactDOM.createRoot(document.querySelector("#root"))


root.render( <RouterProvider router={router} /> )


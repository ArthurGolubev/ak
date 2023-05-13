import * as React from 'react'
import { createHashRouter } from "react-router-dom"
import { App } from './app/App'
import { Main } from './app/main/Main'
import { Graph } from './app/main/graph/Graph'

export const router = createHashRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "main",
                element: <Main />,
                children: [
                    {
                        path: 'graph-view',
                        element: <Graph />
                    }
                ]
            }
        ]
    }
])
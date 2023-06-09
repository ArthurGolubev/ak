import * as React from 'react'
import { createHashRouter } from "react-router-dom"
import { App } from './app/App'
import { Main } from './app/main/Main'
import { Graph } from './app/main/graph/Graph'
import { Create } from './app/main/graph/create/Create'
import { Info } from './app/main/graph/info/Info'
import { User } from './app/profile/User'
import { Registration } from './app/profile/Registration'
import { Authorization } from './app/profile/Authorization'
import { Delete } from './app/main/graph/delete/Delete'
import { CreateNode } from './app/main/graph/create/CreateNode'
import { CreateLink } from './app/main/graph/create/CreateLink'
import { Edit } from './app/main/graph/edit/Edit'

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
                        element: <Graph />,
                        children: [
                            {
                                path: 'create',
                                element: <Create />,
                                children: [
                                    {
                                        path: 'node',
                                        element: <CreateNode />
                                    },
                                    {
                                        path: 'link',
                                        element: <CreateLink />
                                    }
                                ]
                            },
                            {
                                path: 'info',
                                element: <Info />
                            },
                            {
                                path: 'edit',
                                element: <Edit />
                            },
                            {
                                path: 'delete',
                                element: <Delete />
                            }
                        ]
                    }
                ]
            },
            {
                path: "user",
                element: <User />,
                children: [
                    {
                        path: 'registration',
                        element: <Registration />
                    },
                    {
                        path: 'authorization',
                        element: <Authorization />
                    }
                ]
            }
        ]
    }
])
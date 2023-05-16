import * as React from 'react'
import { CreateNode } from './CreateNode'
import { CreateLink } from './CreateLink'


export const Create = () => {

    return <div className='row justify-content-center'>
        <div className='col-12'>
            
            <CreateNode />

            <CreateLink />

        </div>
    </div>
}
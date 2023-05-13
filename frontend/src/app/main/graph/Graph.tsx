import * as React from "react"
import { GraphView } from "./GraphView"
import { GraphSideBar } from "./GraphSidebar"


export const Graph = () => {

    return <div>
        
        <div className='row justify-content-center'>
            <div className='col-10'>
                <GraphView />
            </div>
            <div className='col-2'>
                <GraphSideBar />
            </div>
        </div>

    </div>
}
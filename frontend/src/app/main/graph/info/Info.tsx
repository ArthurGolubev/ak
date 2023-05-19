import * as React from "react"
import { useGraphStore } from "../../../store"
import { NodePropsInfo } from "./NodePropsInfo"
import { Link } from "react-router-dom"


export const Info = () => {

    const {graphElemInfo} = useGraphStore((state) => ({
        graphElemInfo: state.graphElemInfo
    }))

    console.log('graphElemInfo -> ', graphElemInfo)
    return <div className='row justify-content-center'>
        <div className='col-12'>

            <div className='row justify-content-center'>
                <div className='col-auto'>
                    <Link to={'/main/graph-view/edit'} className="link-primary">Edit</Link>
                </div>
            </div>

            <div className='row justify-content-center'>
                <div className='col-11'>
                    <p>{graphElemInfo?.properties?.title}</p>
                </div>
            </div>
            
            <div className='row justify-content-center'>
                <div className='col-11'>
                    <p>{graphElemInfo?.label}</p>
                </div>
            </div>

            <NodePropsInfo />

        </div>
    </div>
}
import * as React from "react";
import { useGraphStore } from "../../../store";
import { NodeProps } from "./NodeProps";


export const Info = () => {

    const {graphElemInfo} = useGraphStore((state) => ({
        graphElemInfo: state.graphElemInfo
    }))

    console.log('graphElemInfo -> ', graphElemInfo)
    return <div className='row justify-content-center'>
        <div className='col-12'>
            
            <div className='row justify-content-center'>
                <div className='col-11'>
                    <p>{graphElemInfo?.id}</p>
                </div>
            </div>

            <div className='row justify-content-center'>
                <div className='col-11'>
                    <p>{graphElemInfo?.label}</p>
                </div>
            </div>

            <NodeProps />

        </div>
    </div>
}
import * as React from "react"
import { useGraphStore } from "../../../store"



export const NodeProps = () => {

    const {graphElemInfo} = useGraphStore((state) => ({
        graphElemInfo: state.graphElemInfo
    }))

    console.log('graphElemInfo 123 -> ', graphElemInfo)

    return <div className='row justify-content-center'>
        <div className='col-11'>
            <ul className="list-group">
                {
                    graphElemInfo != undefined && Object.entries(graphElemInfo?.properties).map((prop: any) => <li className="list-item" key={prop[0]}>{prop[0]} - {prop[1]}</li>)
                }
            </ul>
        </div>
    </div>
}
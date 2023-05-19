import * as React from "react"
import { useGraphStore } from "../../../store"



export const NodePropsInfo = () => {

    const {graphElemInfo} = useGraphStore((state) => ({
        graphElemInfo: state.graphElemInfo
    }))

    console.log('graphElemInfo 123 -> ', graphElemInfo)

    return <div className='row justify-content-center' style={{maxHeight: '80vh'}}>
        <div className='col-11  owerflov-auto'>
            {
                graphElemInfo != undefined && Object.entries(graphElemInfo?.properties)
                .filter(prop => prop[0] != 'title' && prop[0] != 'uuid' && prop[0] != 'user_id')
                .map((prop: any) => {
                    console.log('p ---- ', prop)
                    let key: string = prop[0]
                    let val: string = prop[1]
                    console.log('key - ', key, 'val - ', val)
                    return <div className='row justify-content-center' key={key}>
                        <div className='col-12'>

                            <div className='row justify-content-start'>
                                <div className='col-auto'>
                                    <b>{key}</b>
                                </div>
                            </div>

                            <div className='row justify-content-start'>
                                <div className='col-12'>
                                    {val}
                                </div>
                            </div>
                            
                        </div>
                    </div>
                })
            }
        </div>
    </div>
}
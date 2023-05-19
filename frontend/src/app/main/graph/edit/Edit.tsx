import * as React from 'react'
import { useGraphStore } from '../../../store'
import { NodePropsEdit } from './NodePropsEdit'



export const Edit = () => {


    const {graphElemInfo, setGraphElemInfo} = useGraphStore((state) => ({
        graphElemInfo: state.graphElemInfo,
        setGraphElemInfo: state.setGraphElemInfo
    }))


    return <div className='row justify-content-center mt-4'>
        <div className='col-11'>
            {
                graphElemInfo?.properties?.title && 
                <div className='row justify-content-center'>
                    <div className='col-12'>
                        <input
                        className='form-control'
                        type="text"
                        value={graphElemInfo?.properties.title}
                        onChange={e => setGraphElemInfo({...graphElemInfo, properties: {...graphElemInfo.properties, title: e.target.value}})}
                        />
                    </div>
                </div>
            }

            <NodePropsEdit />

        </div>
    </div>
}



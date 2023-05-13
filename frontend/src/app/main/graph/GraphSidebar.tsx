import * as React from 'react'
import axios from 'axios'
import { useGraphStore } from '../../store'

export const GraphSideBar = () => {

    const {fetchGraph, isLoading, createNode} = useGraphStore((state) => ({
        isLoading: state.isLoading,
        fetchGraph: state.fetchGraph,
        createNode: state.createNewNode,
    }))


    const [label, setLabel] = React.useState('')

    React.useEffect(() => {
        const result = async () => fetchGraph()
        result()
    }, [])

    return <div className='card' style={{height: '100vh'}}>
        <div className='card-body'>
            
            <div className='row justify-content-center mt-3'>
                <div className='col-11'>
                    <input className='form-control mt-2' type="text" placeholder='Label' onChange={e => setLabel(e.target.value)} value={label}/>
                </div>
            </div>

            <div className='row justify-content-center mt-3'>
                <div className='col-auto'>
                    <button onClick={() => createNode(label)} className='btn btn-sm btn-primary' type='button'>Create Node</button>
                </div>
            </div>

            <div className='row justify-content-center mt-3'>
                <div className='col-auto'>
                    <button onClick={() => fetchGraph()} className='btn btn-sm btn-primary' type='button'>Get All Nodes</button>
                </div>
            </div>

        </div>
    </div>
}
import * as React from "react"
import { useGraphStore } from "../../../store"
import { AddProp } from "./AddProp"
import { PropsList } from "../PropsList"



export const CreateNode = () => {

    const [label, setLabel] = React.useState('')

    const {link, fetchGraph, isLoading, createNode, addNodePropsToList, nodePropsList} = useGraphStore((state) => ({
        setTargetToSelect: state.setTargetToSelect,
        targetToSelect: state.targetToSelect,
        isLoading: state.isLoading,
        fetchGraph: state.fetchGraph,
        createNode: state.createNewNode,
        createLink: state.createLink,
        link: state.link,
        addNodePropsToList: state.addNodePropsToList,
        nodePropsList: state.nodePropsList
    }))

    const createNodeHandler = () => {
        createNode(label, nodePropsList)
        setLabel('')
    }


    return <div className='row justify-content-center'>
        <div className='col-12'>

            <div className='row justify-content-center mt-2'>
                <div className='col-11'>
                    <h5>Создание нода</h5>
                </div>
            </div>
            
            <div className='row justify-content-center mt-3'>
                <div className='col-11'>
                    <input className='form-control mt-2' type="text" placeholder='Label' onChange={e => setLabel(e.target.value)} value={label}/>
                </div>
            </div>

            <div className='row justify-content-center mt-3'>
                <div className='col-auto'>
                    <button
                    onClick={() => createNodeHandler()}
                    className='btn btn-sm btn-primary' type='button'
                    disabled={isLoading}
                    >Create Node</button>
                </div>
            </div>

            
            <AddProp addProp={addNodePropsToList}/>

            <PropsList propsList={nodePropsList}/>

        </div>
    </div>
}
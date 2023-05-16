import * as React from "react"
import { useGraphStore } from "../../../store"
import { AddProp } from "./AddProp"
import { PropsList } from "../PropsList"



export const CreateLink = () => {
    
    const {link, targetToSelect, setTargetToSelect, createLink, addLinkPropsToList, linkPropsList, setLink, isLoading} = useGraphStore((state) => ({
        setTargetToSelect: state.setTargetToSelect,
        targetToSelect: state.targetToSelect,
        isLoading: state.isLoading,
        createLink: state.createLink,
        link: state.link,
        addLinkPropsToList: state.addLinkPropsToList,
        linkPropsList: state.linkPropsList,
        setLink: state.setLink,
    }))

    return <div className='row justify-content-center mt-3'>
        <div className='col-11'>
            
            <div className='row justify-content-center mt-2'>
                <div className='col-11'>
                    <h5>Создание связи</h5>
                </div>
            </div>

            <div className='row justify-content-center mt-3'>
                <input className='form-control' type='text' onChange={e=>setLink({...link, label: e.target.value})} placeholder="label" value={link.label}/>
            </div>
            
            <div className='row justify-content-between mt-2'>
                <div className='col-auto'>
                    <button onClick={()=>setTargetToSelect('start')} className='btn btn-sm btn-primary' type='button' disabled={targetToSelect == 'start'}>От</button>
                </div>
                <div className='col-auto'>
                    <button
                        onClick={()=>createLink(link, linkPropsList)}
                        className='btn btn-sm btn-primary'
                        type='button'
                        disabled={!link.start || !link.end || !link.label || isLoading}
                        >create link</button>
                </div>
                <div className='col-auto'>
                    <button onClick={()=>setTargetToSelect('end')} className='btn btn-sm btn-primary' type='button' disabled={targetToSelect == 'end'}>До</button>
                </div>
            </div>

            <div className='row justify-content-center mt-2'>
                {/* <div className='col-auto'>
                    <button
                        onClick={()=>createLink(link, linkPropsList)}
                        className='btn btn-sm btn-primary'
                        type='button'
                        disabled={!link.start || !link.end || !link.label}
                        >create link</button>
                </div> */}
            </div>

            <AddProp addProp={addLinkPropsToList}/>

            <PropsList propsList={linkPropsList}/>

        </div>
    </div>
}
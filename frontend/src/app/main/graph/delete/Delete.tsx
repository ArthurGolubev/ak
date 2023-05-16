import * as React from 'react'
import { useGraphStore } from '../../../store'
import { Info } from '../info/Info'


export const Delete = () => {

    const {isLoading, setTargetToSelect, targetToSelect, deleteElem, graphElemInfo} = useGraphStore((state) => ({
        targetToSelect: state.targetToSelect,
        setTargetToSelect: state.setTargetToSelect,
        deleteElem: state.deleteElem,
        graphElemInfo: state.graphElemInfo,
        isLoading: state.isLoading
    }))

    return <div className='row justify-content-center'>
        <div className='col-11'>

            <div className='row justify-content-center mt-4'>
                <div className='col-auto'>
                    <button
                    onClick={()=>setTargetToSelect('delete')}
                    className='btn btn-sm btn-danger'
                    type='button'
                    disabled={targetToSelect == 'delete'}
                    >Удалить</button>
                </div>
            </div>

            {
                graphElemInfo != undefined && targetToSelect == 'delete' && 
                <div className='row justify-content-center mt-3'>
                    <div className='col-12'>
                        <div className='alert alert-primary' role='alert'>

                            <Info />
                            
                            <div className='row justify-content-center mt-4'>
                                <div className='col-12 text-center'>
                                    <p><b>Удалить?</b></p>
                                </div>
                            </div>

                            <div className='row justify-content-center gx-4 mt-1'>
                                <div className='col-auto'>
                                    <button
                                    onClick={()=>deleteElem(graphElemInfo)}
                                    className='btn btn-sm btn-success' type='button'
                                    disabled={isLoading}
                                    >Да</button>
                                </div>
                                <div className='col-auto'>
                                    <button
                                    onClick={()=>setTargetToSelect(undefined)}
                                    className='btn btn-sm btn-success' type='button'
                                    disabled={isLoading}
                                    >Нет</button>
                                </div>
                            </div>

                        </div>

                    </div>
                </div>
            }

        </div>

        
    </div>
}
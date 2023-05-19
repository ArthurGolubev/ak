import * as React from "react"
import { useGraphStore } from "../../../store"
import { AddProp } from "../create/AddProp"



export const NodePropsEdit = () => {

    const {labels, graphElemInfo, updateProps, setGraphElemInfo} = useGraphStore((state) => ({
        graphElemInfo: state.graphElemInfo,
        updateProps: state.updateProps,
        setGraphElemInfo: state.setGraphElemInfo,
        labels: state.graph.node_labels
    }))

    const [props, setProps] = React.useState({})
    const [label, setLabel] = React.useState('')

    console.log('graphElemInfo 123 -> ', graphElemInfo)
    const updatePropsHandler = () => {
        let p = {...props, title: graphElemInfo.properties?.title}
        updateProps('node', p, graphElemInfo.id, label)
        setProps({})
    }

    const addPropHAndler = (key: string, value: string) => {
        setProps({...props, [key]: value})
        setGraphElemInfo({...graphElemInfo, properties: {...graphElemInfo.properties, [key]: value}})
    }


    return <div className='row justify-content-center'>
        <div className='col-11'>

            <AddProp addProp={addPropHAndler} />

            <div className='row justify-content-center mt-2'>
                <div className='col-12'>
                    <select className="form-select" onChange={e => setLabel(e.target.value)}>
                        <option value={''}>-</option>
                        {
                            labels.map((label: string) => (<option key={label} value={label}>{label}</option>))
                        }
                    </select>
                </div>
            </div>
            
            <div className='row justify-content-center mt-3'>
                <div className='col-11'>
                    <input className='form-control mt-2' type="text" placeholder='Label' onChange={e => setLabel(e.target.value)} value={label}/>
                </div>
            </div>

            {
                graphElemInfo != undefined && Object.entries(graphElemInfo?.properties)
                .filter(prop => prop[0] != 'title' && prop[0] != 'uuid' && prop[0] != 'user_id')
                .map((prop: any) => {
                    let key: string = prop[0]
                    let val = prop[1]
                    
                    return <div className='row justify-content-center' key={key}>
                        <div className='col-12'>

                            <div className='row justify-content-center'>
                                <div className='col-12'>
                                    <b>{key}</b>
                                </div>
                            </div>
                            
                            <div className='row justify-content-center'>
                                <div className='col-12'>
                                    <textarea
                                    defaultValue={val}
                                    className="form-control"
                                    onChange={e=>setProps({...props, [key]: e.target.value}) }
                                    placeholder="Если поле пустое - свойство нода удалится после обновления"
                                    />
                                </div>
                            </div>

                        </div>
                    </div>
                })
            }

            <div className='row justify-content-center mt-3'>
                <div className='col-12'>
                    <button onClick={()=>updatePropsHandler()} className='btn btn-sm btn-success' type='button'>Update</button>
                </div>
            </div>

        </div>
    </div>
}
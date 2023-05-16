import * as React from "react";



export const AddProp = ({addProp}: {addProp: (key: string, value: string) => void}) => {

    const [state, setState] = React.useState({key: '', value: ''})

    const addPropsHandeler = () => {
        addProp(state.key, state.value)
        setState({key: '', value: ''})
    }

    return <div className='row justify-content-center mt-3'>
        
        <div className='row justify-content-center'>
            <div className='col-6'>
                <input
                    className="form-control form-control-sm"
                    type={'text'}
                    placeholder="key"
                    onChange={e => setState({...state, key: e.target.value})}
                    value={state.key}
                    />
            </div>
            <div className='col-6'>
                <input
                    className="form-control form-control-sm"
                    type={'text'}
                    placeholder="value"
                    onChange={e => setState({...state, value: e.target.value})}
                    value={state.value}
                />
            </div>
        </div>

        <div className='row justify-content-center mt-3'>
            <div className='col-auto'>
                <button onClick={()=>addPropsHandeler()} className='btn btn-sm btn-success' type='button'>AddProps</button>
            </div>
        </div>
        
    </div>
}
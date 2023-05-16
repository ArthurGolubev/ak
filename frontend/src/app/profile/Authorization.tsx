import * as React from 'react'
import { useProfile } from '../store'
// import { useMutation, useQuery } from '@apollo/client'
// import { AUTHORIZATION, GET_ME } from './restMutations'



export const Authorization = () => {
    const [state, setState] = React.useState({ validPassword: true, validLogin: true })

    const authUser = useProfile().authUser
    const isLoading = useProfile().isLoading

    
    const authorizationHandler = () => {
        let username = (document.querySelector('#input-login') as HTMLInputElement)
        let password = (document.querySelector('#input-password') as HTMLInputElement)
        authUser(username.value, password.value)
        username.value = ''
        password.value = ''
    }

    return <div className='row justify-content-center' style={{height: '65vh'}}>
        <div className='col-auto d-flex align-items-center'>
            <div className='card'>
                <div className='card-body'>
                    <div className='card-title'>
                        Авторизация
                    </div>
                    <div className='card-text'>

                        <div className='row justify-content-center'>
                            <label htmlFor='input-login' className='col-5 col-form-label'>Login:</label>
                            <div className='col'>
                                <input type='text' id='input-login'
                                className={state.validLogin ? 'form-control form-control-sm' : 'form-control form-control-sm is-invalid'}
                                />
                            </div>
                        </div>

                        <div className='row justify-content-center'>
                            <label htmlFor='input-login' className='col-5 col-form-label'>Password:</label>
                            <div className='col'>
                                <input type='password' id='input-password'
                                className={state.validLogin ? 'form-control form-control-sm' : 'form-control form-control-sm is-invalid'}
                                />
                            </div>
                        </div>

                        <div className='row justify-content-center mt-3'>
                            <div className='col-auto'>
                                <button
                                onClick={()=>authorizationHandler()}
                                className='btn btn-sm btn-primary' type='button'
                                disabled={isLoading}
                                >Авторизироваться</button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>
}

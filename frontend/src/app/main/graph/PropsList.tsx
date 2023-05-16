import * as React from "react"



export const PropsList = ({propsList}: {propsList: Array<{key: string, value: string}> }) => {

    return <div className='row justify-content-center mt-3'>
        <div className='col-12'>
            <ul>
                {
                    propsList.map((elem, iter) => {
                        return <li key={iter}>{elem.key} - {elem.value}</li>
                    })
                }
            </ul>
        </div>
    </div>
}
import axios from 'axios'
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'


const ax = axios.create({
    baseURL: 'http://10.152.183.28', // dev
    // baseURL: 'https://ak.in-arthurs-apps.space', // prod
    headers: {
        // 'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem("akJWT")}`
    }
})

interface graphData {
    nodes: Array<{id: string, label: string}> | []
    links: Array<{source: string, target: string}> | []
    node_labels: Array<string> | []
    link_labels: Array<string> | []
}

type target = 'start' | 'end' | 'delete' | undefined
type link = {
    start: string
    end: string
    label: string
}
type prop = {
    key: string
    value: string
}

type graphElem = {
    id: string,
    label: string
    properties: {
        uuid: string,
        title: string
    }
    type: 'link' | 'node'
}

interface GraphState {
    isLoading: boolean
    graph: graphData
    graphElemInfo: graphElem | undefined
    targetToSelect: target
    link: link
    linkPropsList: Array<prop>
    nodePropsList: Array<prop>

    setGraphElemInfo: (node: object) => void
    fetchGraph: () => void
    createNewNode: (label: string, props: Array<prop>) => void
    setTargetToSelect: (target: target) => void
    setLink: (link: link) => void
    createLink: (link: link, props: Array<prop>) => void
    addLinkPropsToList: (key: string, value: string) => void
    addNodePropsToList: (key: string, value: string) => void
    deleteElem: (elem: graphElem) => void
    updateProps: (type: string, props: {}, uuid: string, label: string) => void

}



export const useGraphStore = create<GraphState>()(
    devtools((set) => ({
        isLoading: false,
        graphElemInfo: undefined,
        graph: {nodes: [], links: [], node_labels: [], link_labels: []},
        targetToSelect: undefined,
        link: {start: '', end: '', label: ''},
        linkPropsList: [],
        nodePropsList: [],



        // -------------------------------------------------------------------------------------

        setGraphElemInfo: (elem: graphElem) => set((state) => ({...state, graphElemInfo: elem})),
        setTargetToSelect: (target) => set((state) => ({...state, targetToSelect: target})),
        setLink: (link: link) => set((state) => ({...state, link: link})),
        addLinkPropsToList: (key: string, value: string) => set((state) => ({...state, linkPropsList: state.linkPropsList.concat({key, value})})),
        addNodePropsToList: (key: string, value: string) => set((state) => ({...state, nodePropsList: state.nodePropsList.concat({key, value})})),

        // -------------------------------------------------------------------------------------

        fetchGraph: async () => {
            set((state) => ({...state, isLoading: true}))
            const response = await ax.get('/graph/node/show-all')
            set((state) => ({...state, graph: response.data}))
            set((state) =>({...state, isLoading: false}))
        },
        createNewNode: async (label: string, props: Array<prop>) => {
            set(state => ({...state, isLoading: true}))
            let p = JSON.stringify({props})
            const response1 = await ax.post('/graph/node/create-new', {label, props: p})
            const response2 = await ax.get('/graph/node/show-all')
            set((state) => ({...state, graph: response2.data}))
            set(state => ({...state, isLoading: false, nodePropsList: []}))
        },
        createLink: async (link: link, props: Array<prop>) => {
            console.log('props -> ', props)
            set(state => ({...state, isLoading: true}))
            let l = JSON.stringify({link})
            let p = JSON.stringify({props})
            const response1 = await ax.post('/graph/node/create-link', {link: l, props: p})
            const response2 = await ax.get('/graph/node/show-all')
            set((state) => ({...state, graph: response2.data}))
            set(state => ({...state, isLoading: false, targetToSelect: undefined, linkPropsList: [], link: {start: '', end: '', label: ''}}))
        },
        deleteElem: async (elem) => {
            set(state => ({...state, isLoading: true}))
            switch (elem.type) {
                case 'node':
                    const response1 = await ax.post('/graph/delete/node', {uuid: elem.properties.uuid})
                    break;
                case 'link':
                    const response2 = await ax.post('/graph/delete/link', {uuid: elem.properties.uuid})
                    break;
                default:
                    console.log('DEFAULT CASE FROM store.ts -> ', elem.type)
                    break;
            }
            set(state => ({...state, isLoading: false, graphElemInfo: undefined, targetToSelect: undefined}))
            const response3 = await ax.get('/graph/node/show-all')
            set((state) => ({...state, graph: response3.data}))
        },
        updateProps: async (type, props, uuid, label) => {
            set(state => ({...state, isLoading: true}))
            switch (type) {
                case 'node':
                    const response1 = await ax.post('/graph/update/node', {uuid, label, props: JSON.stringify(props)})
                    break;
                case 'link':
                    const response2 = await ax.post('/graph/update/link', {uuid, props: JSON.stringify(props)})
                    break;
                default:
                    console.log('DEFAULT CASE FROM store.ts -> ', type)
                    break;
            }
            set(state => ({...state, isLoading: false, graphElemInfo: undefined, targetToSelect: undefined}))
            const response3 = await ax.get('/graph/node/show-all')
            set((state) => ({...state, graph: response3.data}))
        }

    }),
))




interface Profile {
    isLoading: boolean
    createUser: (username: string, email: string, password: string) => void
    authUser: (username: string, password: string) => void
}

export const useProfile = create<Profile>()(
    devtools((set) => ({
        isLoading: false,

        createUser: async (username, email, password) => {
            set(state => ({...state, isLoading: true}))
            const response = await ax.post('/user/create', ({username, email, password}))
            console.log('some response 1 -> ', response)
            set(state => ({...state, isLoading: false}))
        },
        authUser: async (username, password) => {
            set(state => ({...state, isLoading: true}))
            const response = await ax.post('/user/get-token-from-client', ({username, password}))
            console.log('some response 2 -> ', response)
            localStorage.setItem('akJWT', response.data.accessToken)
            set(state => ({...state, isLoading: false}))
        }
    }))
)
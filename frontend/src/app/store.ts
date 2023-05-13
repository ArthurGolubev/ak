import axios from 'axios'
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'


interface graphData {
    nodes: Array<{id: string, label: string}> | []
    links: Array<{source: string, target: string}> | []
}

interface GraphState {
    isLoading: boolean
    graph: graphData
    selectedNode: string

    setSelectedNode: (node: string) => void
    fetchGraph: () => void
    createNewNode: (label: string) => void
}

const baseUrl = 'http://10.152.183.28' // dev

export const useGraphStore = create<GraphState>()(
    devtools((set) => ({
        isLoading: false,
        selectedNode: '',
        graph: {nodes: [], links: []},

        // -------------------------------------------------------------------------------------

        setSelectedNode: (nodeId: string) => set(() => ({selectedNode: nodeId})),
        fetchGraph: async () => {
            set({isLoading: true})
            const response = await axios.get(baseUrl + '/node/show-all')
            set((state) => ({...state, graph: response.data}))
            console.log('e.data -> ', response.data)
            set({isLoading: false})
        },
        createNewNode: async (label: string) => {
            set({isLoading: true})
            const response1 = await axios.post(baseUrl + '/node/create-new', {label})
            const response2 = await axios.get(baseUrl + '/node/show-all')
            set((state) => ({...state, graph: response2.data}))
            console.log('e.data -> ', response2.data)
            set({isLoading: false})
        }

    }),
))


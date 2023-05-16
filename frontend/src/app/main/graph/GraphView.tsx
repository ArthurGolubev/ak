import * as React from 'react'
import { ForceGraph2D } from 'react-force-graph'
import axios from 'axios'
import * as ReactDomServer from 'react-dom/server'
import { useGraphStore } from '../../store'

export const GraphView = () => {



    const state = useGraphStore().graph
    const {targetToSelect, setLink, link, setTargetToSelect} = useGraphStore((state) => ({
        link: state.link,
        setLink: state.setLink,
        targetToSelect: state.targetToSelect,
        setTargetToSelect: state.setTargetToSelect
    }))
    

    const setGraphElemInfo = useGraphStore(state => state.setGraphElemInfo)
    //   --------------------------------------------------------------------------------------------------
    // Скопировал из примера в документации и дополнил

    const data = React.useMemo(() => {
        console.log('state.data -> ', state)
        const gData = state as any

        // cross-link node objects
        gData.links.forEach((link: any) => {
            console.log('link -> ', link)
            const a = gData.nodes.find((e: any) => e.id == link.source);
            const b = gData.nodes.find((e: any) => e.id == link.target);
            !a.neighbors && (a.neighbors = []);
            !b.neighbors && (b.neighbors = []);
            a.neighbors.push(b);
            b.neighbors.push(a);

            !a.links && (a.links = []);
            !b.links && (b.links = []);
            a.links.push(link);
            b.links.push(link);
        });
            console.log('gData -> ', gData)
            return gData
        }, [state]);

    
    const NODE_R = 8;
    const [highlightNodes, setHighlightNodes] = React.useState(new Set());
    const [highlightLinks, setHighlightLinks] = React.useState(new Set());
    const [hoverNode, setHoverNode] = React.useState(null);

    const updateHighlight = () => {
        setHighlightNodes(highlightNodes);
        setHighlightLinks(highlightLinks);
    };




    const handleNodeHover = (node: any) => {
        console.log('node -> ', node)
        highlightNodes.clear();
        highlightLinks.clear();
        if (node) {
            highlightNodes.add(node);
            node.neighbors?.forEach((neighbor: any) => highlightNodes.add(neighbor));
            node.links?.forEach((link: any) => highlightLinks.add(link));
            setGraphElemInfo(node)
            switch (targetToSelect) {
                case 'start':
                    setLink({...link, start: node.id})
                    setTargetToSelect(undefined)
                    break;
                case 'end':
                    setLink({...link, end: node.id})
                    setTargetToSelect(undefined)
                    break;
                default:
                    console.log('default select')
                    break;
            }
        } else {
        setGraphElemInfo(undefined)

        }

        setHoverNode(node || null);
        updateHighlight();
    };



    const handleLinkHover = (link: any) => {
        console.log('link -> ', link)
        highlightNodes.clear();
        highlightLinks.clear();

        if (link) {
        setGraphElemInfo(link)
        highlightLinks.add(link);
        highlightNodes.add(link.source);
        highlightNodes.add(link.target);
    } else {
        setGraphElemInfo(undefined)
    }
        updateHighlight();
    };

    const paintRing = React.useCallback((node: any, ctx: any) => {
        ctx.beginPath();
        ctx.font = "0.3em system-ui"
        ctx.fillText(node.label, node.x, node.y + 10)
        if(highlightNodes.has(node)){
            ctx.arc(node.x, node.y, NODE_R * 0.7, 0, 2 * Math.PI, false);
            ctx.fillStyle = node === hoverNode ? 'red' : 'orange';
        }
        ctx.fill();
    }, [hoverNode]);
    //   --------------------------------------------------------------------------------------------------




    const createNiceNodeDescription = (e: {label: string, id: string}) => {
        const JSXElem =  <div>
            {e.label}
            {/* <div className='card'>
                <div className='card-body'>
                    <h4 className='card-title text-black'>{e.label}</h4>
                    <p className='card-text text-black'>{e.id}</p>
                </div>
            </div> */}
        </div>
        return ReactDomServer.renderToStaticMarkup(JSXElem)
    }



    return <div>
        <ForceGraph2D
            graphData={data}
            nodeLabel={(e: any) => createNiceNodeDescription(e)}
            nodeAutoColorBy={'label'}
            onNodeClick={node => handleNodeHover(node)}
            onLinkClick={link => handleLinkHover(link)}
            onBackgroundClick={() => {
                handleNodeHover(undefined)
                handleLinkHover(undefined)
            }}
            // onNodeHover={handleNodeHover}
            // onLinkHover={handleLinkHover}
            // nodeRelSize={NODE_R}
            autoPauseRedraw={false}
            linkWidth={link => highlightLinks.has(link) ? 5 : 1}
            linkDirectionalParticles={4}
            linkDirectionalParticleWidth={link => highlightLinks.has(link) ? 4 : 0}
            nodeCanvasObjectMode={node => highlightNodes.has(node) ? 'before' : 'after' }
            nodeCanvasObject={paintRing}
        />
    </div>
}
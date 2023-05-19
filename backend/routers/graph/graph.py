import json
from typing import Dict
from typing import Any
from loguru import logger 
from fastapi import Depends
from fastapi import APIRouter
from backend.models import User, TargetElem
from backend.auth import get_current_user
from fastapi.responses import JSONResponse
from backend.database import get_driver, query, database
import time


router = APIRouter(prefix='/graph')


@router.post('/node/create-new')
async def create_new_node(body: Dict[str, str], user: User = Depends(get_current_user)):
    props = json.loads(body['props'])['props']
    new_dict = {}
    for prop in props:
        new_dict[prop['key']] = prop['value']
    new_dict['user_id'] = user.id
    records, _, _ = await get_driver().execute_query(
        query(f"""
            CREATE (n:`{body.get('label')}` $props)
            SET n.uuid = apoc.create.uuid()
            RETURN n
        """),
        props=new_dict,
        database_=database,
    )
    logger.info(f'\n{records=}\n')
    return "it's ok!"





@router.get('/node/show-all')
async def show_all(user: User = Depends(get_current_user)):
    t0 = time.time()
    records, _, _ = await get_driver().execute_query(
        query("""
            MATCH p1 = (n {user_id: $user_id}) 
            WHERE NOT (n)--() 
            RETURN [n] as node, relationships(p1) as links 
            UNION 
            OPTIONAL MATCH p = (n1 {user_id: $user_id})-[*]->(n2 {user_id: $user_id}) 
            RETURN nodes(p) as node, relationships(p) as links 
        """),
        database_=database,
        user_id=user.id
    )
    t1 = time.time()
    step1 = t1 - t0
    nodes: list[Any] = []
    links: list[Any] = []
    node_labels: list[Any] = []
    link_labels: list[Any] = []
    logger.info(f'\n\n{records=}')
    for record in records:
        nodes1 = record.get('node')
        if nodes1:
            for node1 in nodes1:
                if isinstance(node1, dict):
                    node1.pop('user_id')
                labels = list(node1.labels)
                node = {
                    "id": node1.get('uuid'),
                    # TODO отправлять список установленных ярлыков -> отображение графа должно брать первый из масива (сделать на клиенте)
                    "label": labels[0], 
                    "properties": {k: v for k, v in node1.items()},
                    "type": "node"
                }
                try:
                    nodes.index(node)
                except ValueError:
                    nodes.append(node)
                node_labels.extend(labels)
        if record['links']:
            for link in record['links']:
                source = link.start_node.get('uuid')
                target = link.end_node.get('uuid')
                if source and target:
                    props = {k: v for k, v in link.items()}
                    props.pop('user_id')
                    label = link.type
                    link = {"source": source, "target": target, "properties": props, "label": label, "type": "link"}
                    try:
                        links.index(link)
                    except ValueError:
                        links.append(link)
                    link_labels.append(label)
    step2 = time.time() - t1
    logger.info(f'\n\n{step1=}\n{step2=}\n\n')
    return JSONResponse(content={
        "nodes": nodes,
        "links": links,
        "node_labels": list(set(node_labels)),
        "link_labels": list(set(link_labels))
        })





@router.post('/node/create-link')
async def create_link(body: Dict[str, str], label: str = 'TO', user: User = Depends(get_current_user)):
    link = json.loads(body['link'])['link']
    props = json.loads(body['props'])['props']
    new_dict = {}
    for prop in props:
        new_dict[prop['key']] = prop['value']
    new_dict['user_id'] = user.id
    records, _, _ = await get_driver().execute_query(
        # TODO label
        query(f"""
            MATCH (s), (e)
            WHERE s.uuid = $start AND e.uuid = $end AND s.user_id = $user_id AND e.user_id = $user_id
            CREATE (s)-[r:`{link['label']}` $props]->(e)
            SET r.uuid = apoc.create.uuid()
        """),
        start=link['start'],
        end=link['end'],
        database_=database,
        props=new_dict,
        user_id=user.id
    )


@router.post('/delete/node')
async def delete_node(target_elem: TargetElem, user: User = Depends(get_current_user)):
    records, _, _ = await get_driver().execute_query(
        query("""
            MATCH (n) 
            WHERE n.uuid = $uuid AND n.user_id = $user_id
            DETACH DELETE n 
        """),
        database_=database,
        uuid=target_elem.uuid,
        user_id=user.id
    )


@router.post('/delete/link')
async def delete_link(target_elem: TargetElem, user: User = Depends(get_current_user)):
    records, _, _ = await get_driver().execute_query(
        query("""
            MATCH ()-[l {uuid: $uuid}]-()
            WHERE l.user_id = $user_id
            DELETE l
            RETURN l
        """),
        database_=database,
        uuid=target_elem.uuid,
        user_id=user.id
    )
    logger.warning(f'{records=}')


@router.post('/update/node')
async def update_node(body: Dict[str, str], user: User = Depends(get_current_user)):
    logger.info(f'{body=}')
    uuid = body['uuid']
    label = body['label']
    props = json.loads(body['props'])
    logger.info(f'{uuid=}')
    logger.info(f'{props=}')
    expr = "MATCH (n {user_id: $user_id, uuid: $uuid}) "
    for k, v in props.items():
        logger.info(f'\n{k=}\n{v=}')
        if v == '':
            expr += f"REMOVE n.{k} "
        else:
            expr += f"SET n.{k} = '{v}' "
    expr += f"SET n:{label} "
    expr += "RETURN n"
    records, _, _ = await get_driver().execute_query(
        query(expr),
        database_=database,
        uuid=uuid,
        user_id=user.id
    )
    logger.warning(f'{records=}')


@router.post('/update/link')
async def update_link(body: Dict[str, str], user: User = Depends(get_current_user)):
    logger.info(f'{body=}')
    uuid = body['uuid']
    label = body['label']
    props = json.loads(body['props'])
    logger.info(f'{uuid=}')
    logger.info(f'{props=}')
    logger.info(f'{label=}')
    expr = "MATCH (n {user_id: $user_id, uuid: $uuid}) "
    for k, v in props.items():
        if v == '':
            expr += f"REMOVE n.{k} "
        else:
            expr += f"SET n.{k} = '{v}' "
    expr += f"SET n:'{label}' "
    expr += "RETURN n"
    records, _, _ = await get_driver().execute_query(
        query(expr),
        database_=database,
        uuid=uuid,
        user_id=user.id
    )
    logger.warning(f'{records=}')
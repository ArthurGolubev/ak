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


router = APIRouter(prefix='/graph')



# @router.get('/clear')
# async def clear_db(limit: int = 100):
#     records, _, _ = await get_driver().execute_query(
#         "MATCH (n1)-[r]-(n2) "
#         "DELETE n1, n2, r"
#     )



# @router.get('/create')
# async def create_data(limit: int = 100, user: User = Depends(get_current_user)):
#     user_id=user.id
#     name = "Arthur"
#     friend_name_1 = "Guinevere_1"
#     friend_name_2 = "Guinevere_2"
#     records, _, _ = await get_driver().execute_query(
#         "MERGE (r:Root {user: $user_id, uuid: apoc.create.uuid()}) "
#         "MERGE (a:Person {user: $user_id, name: $name, uuid: apoc.create.uuid()})<-[:usr {uuid: apoc.create.uuid()}]-(r) "
#         "MERGE (a)-[:KNOWS {uuid: apoc.create.uuid()}]->(friend1:Person {user: $user_id, name: $friend_name_1, uuid: apoc.create.uuid()}) "
#         "MERGE (a)-[:KNOWS {uuid: apoc.create.uuid()}]->(friend2:Person {user: $user_id, name: $friend_name_2, uuid: apoc.create.uuid()}) ",
#         user_id=user_id,
#         name=name,
#         friend_name_1=friend_name_1,
#         friend_name_2=friend_name_2
#     )



# @router.get('/test_q')
# async def test_q(q: str, user: User = Depends(get_current_user)):
#     records, _, _ = await get_driver().execute_query(
#         query(q),
#         database_=database,
#     )
#     logger.info(f'\n\n{records}\n\n')
#     for r in records:
#         logger.info(f'{r}\n')




@router.post('/node/create-new')
async def create_new_node(body: Dict[str, str], user: User = Depends(get_current_user)):
    props = json.loads(body['props'])['props']
    new_dict = {}
    for prop in props:
        new_dict[prop['key']] = prop['value']
    new_dict['user_id'] = user.id
    records, _, _ = await get_driver().execute_query(
        # query(f"""
        #     # MATCH (r:Root) WHERE r.user = $user_root_id
        #     CREATE (r)-[:owner]->(n:{body.get('label')} $props)
        #     SET n.uuid = apoc.create.uuid()
        #     RETURN n
        # """),
        query(f"""
            CREATE (r)-[:owner]->(n:{body.get('label')} $props)
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
    records, _, _ = await get_driver().execute_query(
        # query("""
        #     MATCH (r:Root) WHERE r.user = {user_root_id}
        #     MATCH p = (r)-[*]->(n)
        #     RETURN n as node, relationships(p) as links
        # """.format(
        #     user_root_id=user_root_id,
        # )),
        # query("""
        #     MATCH (n3) 
        #     WHERE n3.user_id = $user_id 
        #     RETURN n3 as node
        # """),
        query("""
            MATCH (n) 
            WHERE n.user_id = $user_id 
            OPTIONAL MATCH p = (n1)-[*]->(n2) 
            WHERE n1.user_id = $user_id AND n2.user_id = $user_id 
            RETURN n as node, relationships(p) as links 
        """),
        database_=database,
        user_id=user.id
    )
    nodes: list[Any] = []
    links: list[Any] = []
    logger.info(f'\n{records=}\n')
    for record in records:
        props = record.data().get('node')
        logger.info(f'------------->{props=}\n')
        if isinstance(props, dict):
            props.pop('user_id')
        node = {
            "id": record["node"].get('uuid'),
            # TODO отправлять список установленных ярлыков -> отображение графа должно брать первый из масива (сделать на клиенте)
            "label": list(record["node"].labels)[0], 
            "properties": props,
            "type": "node"
        }
        try:
            nodes.index(node)
        except ValueError:
            nodes.append(node)
        if record['links']:
            for link in record['links']:
                source = link.start_node.get('uuid')
                target = link.end_node.get('uuid')
                if source and target:
                    props = {k: v for k, v in link.items()}
                    props.pop('user_id')
                    link = {"source": source, "target": target, "properties": props, "label": link.type, "type": "link"}
                    try:
                        links.index(link)
                    except ValueError:
                        links.append(link)
    return JSONResponse(content={"nodes": nodes, "links": links})





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
            CREATE (s)-[r:{link['label']} $props]->(e)
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
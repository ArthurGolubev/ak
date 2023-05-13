#!/usr/bin/env python
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from loguru import logger 
from typing import Dict

import os
from typing import Any
from contextlib import asynccontextmanager
from textwrap import dedent
from typing import Optional, cast

import neo4j
from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from neo4j import AsyncGraphDatabase
from typing_extensions import LiteralString
from fastapi.responses import JSONResponse


PATH = os.path.dirname(os.path.abspath(__file__))


url = "neo4j://standalone-with-storage-class.default.svc.cluster.local:7687"
username = "neo4j"
password = "dc3F2UnWefN2YO"
neo4j_version = os.getenv("NEO4J_VERSION", "4")
database = "neo4j"

port = int(os.getenv("PORT", 8000))

shared_context = {}


def query(q: LiteralString) -> LiteralString:
    # this is a safe transform:
    # no way for cypher injection by trimming whitespace
    # hence, we can safely cast to LiteralString
    return cast(LiteralString, dedent(q).strip())


@asynccontextmanager
async def lifespan(app: FastAPI):
    driver = AsyncGraphDatabase.driver(url, auth=(username, password))
    shared_context["driver"] = driver
    yield
    await driver.close()


def get_driver() -> neo4j.AsyncDriver:
    return shared_context["driver"]


app = FastAPI(lifespan=lifespan)


# @app.get("/")
# async def get_index():
#     return FileResponse(os.path.join(PATH, "static", "index.html"))


def add_friend(tx, name, friend_name):
    tx.run("MERGE (a:Person {name: $name}) "
        "MERGE (a)-[:KNOWS]->(friend:Person {name: $friend_name})",
        name=name, friend_name=friend_name)


@app.get('/clear')
async def clear_db(limit: int = 100):
    records, _, _ = await get_driver().execute_query(
        "MATCH (n1)-[r]-(n2) "
        "DELETE n1, n2, r"
    )



@app.get('/create')
async def create_data(limit: int = 100):
    user_id=1
    name = "Arthur"
    friend_name_1 = "Guinevere_1"
    friend_name_2 = "Guinevere_2"
    records, _, _ = await get_driver().execute_query(
        "MERGE (r:Root {user: $user_id, uuid: apoc.create.uuid()}) "
        "MERGE (a:Person {user: $user_id, name: $name, uuid: apoc.create.uuid()})<-[:usr]-(r) "
        "MERGE (a)-[:KNOWS]->(friend1:Person {user: $user_id, name: $friend_name_1, uuid: apoc.create.uuid()}) "
        "MERGE (a)-[:KNOWS]->(friend2:Person {user: $user_id, name: $friend_name_2, uuid: apoc.create.uuid()}) ",
        user_id=user_id,
        name=name,
        friend_name_1=friend_name_1,
        friend_name_2=friend_name_2
    )


@app.get('/test_q')
async def test_q(q: str):
    records, _, _ = await get_driver().execute_query(
        query(q),
        # root_label='Person',
        # branch_label="Person",
        database_=database,
        # routing_="",
        # limit=limit,
    )
    logger.info(f'\n\n{records}\n\n')
    for r in records:
        logger.info(f'{r}\n')


@app.get("/graph")
async def get_graph(
    limit: int = 100,
    label_1: str = "%|!%",
    label_2: str = "%|!%",
    ):
    
    records, _, _ = await get_driver().execute_query(
        # query("""
        #     MATCH (m:Movie)<-[:ACTED_IN]-(a:Person)
        #     RETURN m.title AS movie, collect(a.name) AS cast
        #     LIMIT $limit
        # """),
        # query("""
        #     MATCH (n)
        #     RETURN n AS node
        # """),
        # query("""
        #     MATCH (n)<-[r]-(m)
        #     RETURN n.name AS root, collect(m.name) as friends
        # """),
        query(f"""
            MATCH (n:{label_1})<-[r]-(m:{label_2})
            RETURN n.name AS name, collect(m.name) as friends, r as links
        """),
        root_label='Person',
        branch_label="Person",
        database_=database,
        routing_="r",
        limit=limit,
    )
    nodes: list[dict[str, Any]] = []
    rels: list[dict[str, Any]] = []
    i = 0
    logger.info(f'{records=}')
    logger.debug(f'\n\n{len(records)=}\n\n')
    for id_, record in enumerate(records):
        logger.success(f'\n\n{record["links"]=}\n\n')
        nodes.append({"id": id_, "titel": record["name"], "label": "Person"})
        logger.info(f"{record=}")
        logger.info(f"{record['name']=}")
        logger.info(f"{record['friends']=}")
        # logger.info(f"{record['node'].get('message')=}")
        logger.info(f"{record.value()=}")
        logger.info(f"{record.keys()=}")
        # logger.info(f"{record['node'].keys()=}")
        logger.info(f"{record.values()=}")
        # logger.info(f"{record['node'].values()=}")
        logger.info(f"{record.items()=}")
        # logger.info(f"{record['node'].items()=}")
        logger.info(f"{record.data()=}")
        target = i
        i += 1
        for name in record["friends"]:
            actor = {"id": id_, "title": name, "label": "Person"}
            try:
                source = nodes.index(actor)
            except ValueError:
                nodes.append(actor)
                source = i
                i += 1
            rels.append({"source": source, "target": target})
    return {"nodes": nodes, "links": rels}



@app.post('/node/create-new')
async def create_new_node(label: Dict[str, str]):
    logger.info(f'\n{label=}\n')
    user_root_id = 1
    records, _, _ = await get_driver().execute_query(
        query("""
            MATCH (r:Root) WHERE r.user = {user_root_id}
            CREATE (r)-[:owner]->(n:{label} $props)
            SET n.uuid = apoc.create.uuid()
            RETURN n
        """.format(
            user_root_id=user_root_id,
            label=label.get('label'),
            # props='{name: "Aleksey"}'
        )),
        props = {"props": "ok 1", "props2": "ok 2"},
        database_=database,
        # routing_="w",
    )
    logger.info(f'\n{records=}\n')
    return "it's ok!"





@app.get('/node/show-all')
async def show_all():
    user_root_id = 1
    records, _, _ = await get_driver().execute_query(
        query("""
            MATCH (r:Root) WHERE r.user = {user_root_id}
            MATCH p = (r)-[*]->(n)
            RETURN n as node, relationships(p) as links
        """.format(
            user_root_id=user_root_id,
        )),
        database_=database,
    )
    nodes = []
    links = []
    # logger.info(f'\n{records=}\n')
    for record in records:
        nodes.append({
            "id": record["node"].get('uuid'),
            "label": list(record["node"].labels)[0]
            })
        for link in record['links']:
            logger.info(f'\n{link.nodes[0]=}\n')
            logger.debug(f'\n{record=}\n')
            logger.info(f'\n{link.nodes[0].get("uuid")=}\n')
            source = link.nodes[0].get("uuid")
            target = link.nodes[1].get("uuid")
            if source and target:
                link = {"source": source, "target": target}
                try:
                    links.index(link)
                except ValueError:
                    links.append(link)
    return JSONResponse(content={"nodes": nodes, "links": links})

# @app.get('/node/add-to')


app.mount('/', StaticFiles(directory='./frontend', html=True), name='index')

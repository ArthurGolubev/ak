import os
from sqlmodel import Session
from sqlmodel import SQLModel, create_engine
from typing_extensions import LiteralString
from neo4j import AsyncGraphDatabase
import neo4j
from fastapi import FastAPI
import os
from contextlib import asynccontextmanager
from textwrap import dedent
from typing import cast

USER = os.getenv("POSTGRES_USER")
PASSWORD = os.getenv("POSTGRES_PASSWORD")
HOST = os.getenv("POSTGRES_HOST")

SQLALCHEMY_DATABASE_URL = f"postgresql://{USER}:{PASSWORD}@{HOST}:5432/{USER}"
# SQLALCHEMY_DATABASE_URL = f"postgresql://{USER}:{PASSWORD}@localhost:5432/{USER}" # Kubernetes
engine = create_engine(SQLALCHEMY_DATABASE_URL)


# sqlite_file_name = "db.db"
# sqlite_url = f"sqlite:///{sqlite_file_name}"
# connect_args = {"check_same_thread": False}
# engine = create_engine(sqlite_url, connect_args=connect_args)

url = "neo4j://standalone-with-storage-class.default.svc.cluster.local:7687"
username = "neo4j"
password = os.getenv('NEO4J_PASS')
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



def get_session():
    with Session(engine) as session:
        yield session




# def create_db_and_tables():
#     SQLModel.metadata.create_all(engine)
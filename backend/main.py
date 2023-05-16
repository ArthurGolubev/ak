#!/usr/bin/env python

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles


from fastapi import FastAPI
from backend.routers import routers
from backend.database import lifespan


app = FastAPI()

app = FastAPI(lifespan=lifespan)


app.include_router(routers.router)
app.mount('/', StaticFiles(directory='./frontend', html=True), name='index')

from fastapi import APIRouter
from backend.routers.user import user
from backend.routers.graph import graph

router = APIRouter()

router.include_router(user.router)
router.include_router(graph.router)
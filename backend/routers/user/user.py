from loguru import logger
from sqlmodel import Session, select
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import RedirectResponse



from backend.auth import get_current_user
from backend.auth import get_password_hash
from backend.auth import login_for_access_token



from backend.models import User
from backend.models import Token
from backend.models import UserRead
from backend.models import UserCreate
from backend.models import UserAuthorization
from backend.database import get_driver, query, database


from backend.database import get_session



router = APIRouter(prefix='/user')




@router.get('/get-me', response_model=UserRead)
async def read_user_me(current_user: User = Depends(get_current_user)):
    logger.debug(__name__)
    return current_user



@router.post('/create', response_model=UserRead)
async def create_user(*, session = Depends(get_session), user: UserCreate):
    logger.debug(f'\n{user=}\n')
    logger.info(__name__)
    user.password = get_password_hash(user.password)
    db_user1 = User.from_orm(user)
    session.add(db_user1)
    session.commit()
    logger.success('123!')
    session.refresh(db_user1)
    logger.info(f"{db_user1=}")
    # records, _, _ = await get_driver().execute_query(
    #     query("""
    #         CREATE (r:Root {user: $user_id, uuid: apoc.create.uuid()}) 
    #         RETURN r
    #     """),
    #     user_id=db_user1.id,
    #     database_=database,
    # )
    return db_user1




@router.get('/get-users', response_model=list[User])
async def read_users(session = Depends(get_session)):
    # не использую
    users = session.exec(select(User)).all()
    return users




@router.get('/get/{user_id}')
async def read_user(*, session = Depends(get_session), user_id: int):
    # не использую
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail='User not found')
    return user





@router.post("/get-token-from-client", response_model=Token)  # название пути можно изменить на более однозначное
async def login_for_access_token_from_client(user: UserAuthorization, session = Depends(get_session)):
    logger.debug(f'\n{user=}\n')
    return login_for_access_token(user=user, session=session)

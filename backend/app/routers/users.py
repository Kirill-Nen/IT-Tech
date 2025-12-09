from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Annotated
from uuid import uuid4

from ..db.session import create_session
from ..db.crud import users as users_crud
from ..auth import security
from ..schemas import UserRegisterSchema, UserLoginSchema

router = APIRouter(prefix='/api/users')

@router.post('/register')
async def register_user(
    user: UserRegisterSchema,
    session: Annotated[AsyncSession, Depends(create_session)]
):
    try:
        if await users_crud.get_user_by_email(user.email, session):
            raise HTTPException(status_code=400, detail='user with this email already exists')
        
        result = await users_crud.add_user(user, session)
        return {
            'success': True,
            'token': security.create_access_token(uid=str(uuid4()), data={'id': result.id}),
            'email': result.email,
            'isLogin': True
        }
    except Exception as e:
        return HTTPException(status_code=404, detail=str(e))
    

@router.post('/login')
async def login_user(
    user: UserLoginSchema,
    session: Annotated[AsyncSession, Depends(create_session)]
):
    try:
        existing_user = await users_crud.get_user_by_email(user.email, session)
        if not existing_user or not existing_user.check_password(user.password):
            raise HTTPException(status_code=400, detail='invalid email or password')
        
        return {
            'success': True,
            'token': security.create_access_token(uid=str(uuid4()), data={'id': existing_user.id}),
            'email': existing_user.email,
            'isLogin': True
        }
    except Exception as e:
        return HTTPException(status_code=404, detail=str(e))
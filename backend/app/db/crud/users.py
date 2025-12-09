from sqlalchemy import select, update, insert, delete
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Union

from ..models.users import User
from ...schemas import UserRegisterSchema, UserLoginSchema


async def add_user(
    data: UserRegisterSchema,
    session: AsyncSession
) -> Union[User, None]:
    user = User(
        fio=data.fio,
        email=data.email
    )
    user.set_password(data.password)
    session.add(user)
    await session.commit()
    return user


async def get_user_by_email(
    email: str,
    session: AsyncSession
) -> Union[User, None]:
    result = await session.execute(
        select(User).where(User.email == email)
    )
    return result.scalars().first()
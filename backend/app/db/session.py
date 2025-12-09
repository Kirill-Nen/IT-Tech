from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker

from .base import Base
from .config import settings
from .models import *

engine = create_async_engine(
    url=settings._getDSN()
)

sessionNew= async_sessionmaker(
    bind=engine,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False
)

async def create_session():
    async with sessionNew() as session:
        yield session

async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
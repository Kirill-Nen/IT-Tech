from pydantic import BaseModel


class UserRegisterSchema(BaseModel):
    fio: str
    email: str
    password: str


class UserLoginSchema(BaseModel):
    email: str
    password: str
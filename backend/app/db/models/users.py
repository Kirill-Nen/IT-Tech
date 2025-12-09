from sqlalchemy import Column, BigInteger, String
from werkzeug.security import generate_password_hash, check_password_hash

from ..base import Base


class User(Base):
    __tablename__ = 'users'
    id = Column(BigInteger, primary_key=True, autoincrement=True, nullable=False)
    fio = Column(String, nullable=False)
    email = Column(String, nullable=False)
    password = Column(String, nullable=False)

    def set_password(self, password):
        self.password = generate_password_hash(password)

    def check_password(self, password) -> bool:
        return check_password_hash(self.password, password)
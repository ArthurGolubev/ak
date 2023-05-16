from sqlmodel import SQLModel, Field
from humps import camelize, decamelize



def to_camel(string):
    return camelize(string)


def to_snake(string):
    return decamelize(string)


class UserBase(SQLModel):
    username: str = Field(index=True, unique=True)
    email: str = Field(unique=True)


class UserCreate(UserBase):
    password: str


class User(UserBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    password: str


class UserAuthorization(SQLModel):
    username: str
    password: str


class Token(SQLModel):
    access_token: str
    token_type: str

    class Config:
        alias_generator = to_camel
        allow_population_by_field_name = True


class TokenData(SQLModel):
    username: str | None = None


class UserRead(UserBase):
    id: int

    class Config:
        alias_generator = to_camel
        allow_population_by_field_name = True


class TargetElem(SQLModel):
    uuid: str
    source: str | None = None
    target: str | None = None
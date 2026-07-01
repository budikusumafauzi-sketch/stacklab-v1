from typing import Generator
from fastapi import Depends
from sqlalchemy.orm import Session

from app.core import database


def get_db() -> Generator:
    yield from database.get_db()

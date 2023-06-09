FROM python:3.10 as requirements-stage

WORKDIR /tmp

RUN pip install poetry

COPY ./backend/pyproject.toml ./backend/poetry.lock* /tmp/

RUN poetry export -f requirements.txt --output requirements.txt --without-hashes






FROM python:3.10

WORKDIR /ak

COPY --from=requirements-stage /tmp/requirements.txt /ak/requirements.txt

RUN pip install --no-cache-dir --upgrade -r /ak/requirements.txt

COPY ./ .



CMD [ "uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000" ]
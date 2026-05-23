FROM python:3.11

WORKDIR /app

COPY . .

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        default-libmysqlclient-dev \
        build-essential \
    && rm -rf /var/lib/apt/lists/* \
    && pip install django djangorestframework djoser djangorestframework-simplejwt django-cors-headers mysqlclient

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
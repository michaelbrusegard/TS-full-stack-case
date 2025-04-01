import os
from pathlib import Path

# Core
BASE_DIR = Path(__file__).resolve().parent.parent
SECRET_KEY = os.getenv('DJANGO_SECRET_KEY')
DEBUG = os.getenv('DEBUG', 'False') == 'True'
ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS', '*').split(',')
ROOT_URLCONF = 'core.urls'
WSGI_APPLICATION = 'core.wsgi.application'

print("--- Reading settings ---")
print(f"DB_USER from env: {os.getenv('DB_USER')}")
print(f"DB_NAME from env: {os.getenv('DB_NAME')}")
print(f"DB_PASSWORD from env: {'******' if os.getenv('DB_PASSWORD') else None}")
print(f"DB_HOST from env: {os.getenv('DB_HOST')}")
print(f"DB_PORT from env: {os.getenv('DB_PORT')}")
print(f"DATABASE_URL from env: {os.getenv('DATABASE_URL')}")
print("------------------------")

# Database
DATABASES = {
    'default': {
        'ENGINE': 'django.contrib.gis.db.backends.postgis',
        'NAME': os.getenv('DB_NAME'),
        'USER': os.getenv('DB_USER'),
        'PASSWORD': os.getenv('DB_PASSWORD'),
        'HOST': os.getenv('DB_HOST'),
        'PORT': os.getenv('DB_PORT'),
    }
}

# Rest
REST_FRAMEWORK = {
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
}
SPECTACULAR_SETTINGS = {
    'TITLE': 'Telescope Case API',
    'VERSION': '1.0.0',
}

# Application
INSTALLED_APPS = [
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.gis',
    'rest_framework',
    'rest_framework_gis',
    'drf_spectacular',
    'properties',
]
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

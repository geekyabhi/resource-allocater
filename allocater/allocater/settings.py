from pathlib import Path

from allocater.env_config import ConfigUtil

configuration = ConfigUtil().get_config_data()

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.mysql",
        "NAME": configuration.get("DB_NAME"),
        "USER": configuration.get("DB_USER"),
        "PASSWORD": configuration.get("DB_PASSWORD"),
        "HOST": configuration.get("DB_HOST"),
        "PORT": configuration.get("DB_PORT", "3306"),  # Default MySQL port is 3306
        "OPTIONS": {
            "unix_socket": "/var/run/mysqld/mysqld.sock",  # Update with the correct path
        },
    }
}


BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = "django-insecure-7h0*6yk(7ch=n_29bx8f)@_y92zi4&z2x5=x+$%=3+gs1=+h&q"
DEBUG = True

ALLOWED_HOSTS = []


INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "allocate_machine.apps.AllocateMachineConfig",
    "users.apps.UsersConfig",
]


STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "middlewere.error_handler.ErrorHandlerMiddleware",
]

ROOT_URLCONF = "allocater.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "allocater.wsgi.application"


AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]


LANGUAGE_CODE = "en-us"

TIME_ZONE = "UTC"

USE_I18N = True

USE_TZ = True


STATIC_URL = "static/"

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

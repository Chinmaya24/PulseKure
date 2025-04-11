"""
WSGI config for pulsecure project.
"""

import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'pulsecure.settings')

application = get_wsgi_application() 
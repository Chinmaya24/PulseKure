from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _

class User(AbstractUser):
    email = models.EmailField(_('email address'), unique=True)
    firstName = models.CharField(_('first name'), max_length=150)
    lastName = models.CharField(_('last name'), max_length=150)
    isEmailVerified = models.BooleanField(_('email verified'), default=False)
    isTwoFactorEnabled = models.BooleanField(_('2FA enabled'), default=False)
    profilePicture = models.ImageField(
        _('profile picture'),
        upload_to='profile_pictures/',
        null=True,
        blank=True
    )

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['firstName', 'lastName']

    class Meta:
        verbose_name = _('user')
        verbose_name_plural = _('users')

    def __str__(self):
        return self.email 
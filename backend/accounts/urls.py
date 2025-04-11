from django.urls import path
from .views import ProfileView, ResendVerificationEmailView, VerifyEmailView

urlpatterns = [
    path('profile/', ProfileView.as_view(), name='profile'),
    path('auth/resend-verification/', ResendVerificationEmailView.as_view(), name='resend-verification'),
    path('auth/verify-email/<str:uidb64>/<str:token>/', VerifyEmailView.as_view(), name='verify-email'),
] 
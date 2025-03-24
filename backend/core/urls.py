from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView

urlpatterns = [
    path('api/', include('properties.urls')),
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
]

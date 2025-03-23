from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PropertyViewSet, PortfolioViewSet

router = DefaultRouter()
router.register(r'properties', PropertyViewSet)
router.register(r'portfolios', PortfolioViewSet)

urlpatterns = [
    path('', include(router.urls)),
]

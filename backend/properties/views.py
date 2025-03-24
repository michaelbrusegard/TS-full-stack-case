from rest_framework import viewsets
from rest_framework.request import Request
from typing import Any, cast
from .models import Property, Portfolio
from .serializers import PropertySerializer, PortfolioSerializer
from rest_framework_gis.pagination import GeoJsonPagination

class GeoPropertyPagination(GeoJsonPagination):
    page_size = 10

class PortfolioViewSet(viewsets.ModelViewSet):
    queryset = Portfolio.objects.all()
    serializer_class = PortfolioSerializer
    pagination_class = None

class PropertyViewSet(viewsets.ModelViewSet):
    queryset = Property.objects.all()
    serializer_class = PropertySerializer
    pagination_class = GeoPropertyPagination

    def get_queryset(self) -> Any:
        queryset = Property.objects.all()
        request = cast(Request, self.request)
        portfolio_id = request.query_params.get('portfolio', None)
        if portfolio_id is not None:
            queryset = queryset.filter(portfolio_id=portfolio_id)
        return queryset

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

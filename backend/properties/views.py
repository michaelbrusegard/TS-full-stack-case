from rest_framework import viewsets
from rest_framework.request import Request
from rest_framework_gis.pagination import GeoJsonPagination
from rest_framework_gis.filters import InBBoxFilter
from rest_framework.filters import OrderingFilter
from typing import Any, cast
from .models import Property, Portfolio
from .serializers import PropertySerializer, PortfolioSerializer
from .throttles import PropertyRateThrottle

class GeoPropertyPagination(GeoJsonPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

class PortfolioViewSet(viewsets.ModelViewSet):
    queryset = Portfolio.objects.all()
    serializer_class = PortfolioSerializer
    throttle_classes = [PropertyRateThrottle]
    pagination_class = None

    def get_queryset(self):
        return Portfolio.objects.prefetch_related('properties').all()

class PropertyViewSet(viewsets.ModelViewSet):
    queryset = Property.objects.all()
    serializer_class = PropertySerializer
    throttle_classes = [PropertyRateThrottle]
    pagination_class = GeoPropertyPagination
    bbox_filter_field = 'location'
    filter_backends = (InBBoxFilter, OrderingFilter)
    ordering_fields = ['id', 'name', 'estimated_value', 'relevant_risks', 'handled_risks']
    ordering = ['id']

    def get_queryset(self) -> Any:
        queryset = Property.objects.all()
        request = cast(Request, self.request)
        portfolio_id = request.query_params.get('portfolio', None)
        if portfolio_id is not None:
            queryset = queryset.filter(portfolio_id=portfolio_id)
        return queryset

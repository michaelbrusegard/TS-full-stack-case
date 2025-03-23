from rest_framework import viewsets
from rest_framework.request import Request
from typing import Any, cast
from .models import Property, Portfolio
from .serializers import PropertySerializer, PortfolioSerializer

class PortfolioViewSet(viewsets.ModelViewSet):
    queryset = Portfolio.objects.all()
    serializer_class = PortfolioSerializer

class PropertyViewSet(viewsets.ModelViewSet):
    queryset = Property.objects.all()
    serializer_class = PropertySerializer

    def get_queryset(self) -> Any:
        queryset = Property.objects.all()
        request = cast(Request, self.request)
        portfolio_id = request.query_params.get('portfolio', None)
        if portfolio_id is not None:
            queryset = queryset.filter(portfolio_id=portfolio_id)
        return queryset

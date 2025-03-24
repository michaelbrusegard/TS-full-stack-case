from django.test import TestCase
from django.contrib.gis.geos import Point
from rest_framework.test import APIClient
from rest_framework import status
from .models import Property, Portfolio

class PropertyViewSetTests(TestCase):
    def setUp(self):
        Property.objects.all().delete()
        Portfolio.objects.all().delete()
        self.client = APIClient()
        self.portfolio = Portfolio.objects.create(name="Oslo Portfolio")
        self.property = Property.objects.create(
            portfolio=self.portfolio,
            name="Karl Johans gate 1",
            address="Karl Johans gate 1",
            zip_code="0154",
            city="Oslo",
            location=Point(10.7522, 59.9139),
            estimated_value=25000000,
            relevant_risks=5,
            handled_risks=3,
            total_financial_risk=1200000
        )

    def test_list_properties(self):
        response = self.client.get('/api/properties/', format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue('type' in response.json())
        self.assertTrue('features' in response.json())
        self.assertEqual(len(response.json()['features']), 1)

    def test_filter_properties_by_portfolio(self):
        response = self.client.get(f'/api/properties/?portfolio={self.portfolio.pk}', format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue('type' in response.json())
        self.assertTrue('features' in response.json())
        self.assertEqual(len(response.json()['features']), 1)

    def test_create_property(self):
        data = {
            'type': 'Feature',
            'geometry': {
                'type': 'Point',
                'coordinates': [10.7271, 59.9111]
            },
            'properties': {
                'portfolio': self.portfolio.pk,
                'name': 'Aker Brygge 12',
                'address': 'Stranden 1',
                'zip_code': '0250',
                'city': 'Oslo',
                'estimated_value': 45000000,
                'relevant_risks': 4,
                'handled_risks': 2,
                'total_financial_risk': 2100000
            }
        }
        response = self.client.post('/api/properties/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Property.objects.count(), 2)

class PortfolioViewSetTests(TestCase):
    def setUp(self):
        Portfolio.objects.all().delete()
        self.client = APIClient()
        self.portfolio = Portfolio.objects.create(name="Oslo Vest Portefølje")

    def test_list_portfolios(self):
        response = self.client.get('/api/portfolios/', format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = response.json()
        self.assertEqual(len(results), 1)

    def test_create_portfolio(self):
        data = {'name': 'Bergen Portfolio'}
        response = self.client.post('/api/portfolios/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Portfolio.objects.count(), 2)

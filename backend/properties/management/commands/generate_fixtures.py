from django.core.management.base import BaseCommand
from django.contrib.gis.geos import Point
from properties.models import Portfolio, Property
import random

class Command(BaseCommand):
    help = 'Generates fixture data for properties and portfolios'

    def handle(self, **_):
        portfolios = [
            Portfolio.objects.create(name="Oslo Portfolio"),
            Portfolio.objects.create(name="Bergen Portfolio"),
            Portfolio.objects.create(name="Trondheim Portfolio"),
            Portfolio.objects.create(name="Stavanger Portfolio")
        ]

        cities = {
            'Oslo': {'lat': 59.9139, 'lon': 10.7522, 'radius': 0.05},
            'Bergen': {'lat': 60.3913, 'lon': 5.3242, 'radius': 0.04},
            'Trondheim': {'lat': 63.4305, 'lon': 10.3951, 'radius': 0.04},
            'Stavanger': {'lat': 58.9700, 'lon': 5.7331, 'radius': 0.03}
        }

        streets = {
            'Oslo': ['Karl Johans gate', 'Grønland', 'Torggata', 'Bogstadveien', 'Møllergata'],
            'Bergen': ['Torgallmenningen', 'Bryggen', 'Strandgaten', 'Kong Oscars gate', 'Marken'],
            'Trondheim': ['Munkegata', 'Nordre gate', 'Olav Tryggvasons gate', 'Thomas Angells gate', 'Fjordgata'],
            'Stavanger': ['Øvre Holmegate', 'Kirkegata', 'Pedersgata', 'Kongsgata', 'Løkkeveien']
        }

        for _ in range(50):
            city = random.choice(list(cities.keys()))
            portfolio = next(p for p in portfolios if p.name.startswith(city))
            city_data = cities[city]
            lat = city_data['lat'] + random.uniform(-city_data['radius'], city_data['radius'])
            lon = city_data['lon'] + random.uniform(-city_data['radius'], city_data['radius'])
            street = random.choice(streets[city])
            street_number = random.randint(1, 100)
            relevant_risks = random.randint(1, 10)
            handled_risks = random.randint(0, relevant_risks)
            value = random.randint(5000000, 50000000)
            risk_percentage = random.uniform(0.02, 0.10)
            financial_risk = int(value * risk_percentage)

            Property.objects.create(
                portfolio=portfolio,
                name=f"{street} {street_number}",
                address=f"{street} {street_number}",
                zip_code=f"{random.randint(0, 9)}{random.randint(0, 9)}{random.randint(0, 9)}{random.randint(0, 9)}",
                city=city,
                location=Point(lon, lat),
                estimated_value=value,
                relevant_risks=relevant_risks,
                handled_risks=handled_risks,
                total_financial_risk=financial_risk
            )

        self.stdout.write(self.style.SUCCESS(
            f'Successfully created {len(portfolios)} portfolios and {Property.objects.count()} properties'
        ))

from django.core.management.base import BaseCommand
from django.contrib.gis.geos import Point
from properties.models import Portfolio, Property
import random

class Command(BaseCommand):
    def handle(self, **_):
        norwegian_portfolios = [
            Portfolio.objects.create(name="Oslo Portfolio"),
            Portfolio.objects.create(name="Bergen Portfolio"),
            Portfolio.objects.create(name="Trondheim Portfolio"),
            Portfolio.objects.create(name="Stavanger Portfolio")
        ]

        european_portfolios = [
            Portfolio.objects.create(name="Nordic Portfolio"),
            Portfolio.objects.create(name="Central Europe Portfolio"),
            Portfolio.objects.create(name="Southern Europe Portfolio"),
        ]

        cities = {
            'Oslo': {'lat': 59.9139, 'lon': 10.7522, 'radius': 0.05, 'portfolio': norwegian_portfolios[0]},
            'Bergen': {'lat': 60.3913, 'lon': 5.3242, 'radius': 0.04, 'portfolio': norwegian_portfolios[1]},
            'Trondheim': {'lat': 63.4305, 'lon': 10.3951, 'radius': 0.04, 'portfolio': norwegian_portfolios[2]},
            'Stavanger': {'lat': 58.9700, 'lon': 5.7331, 'radius': 0.03, 'portfolio': norwegian_portfolios[3]},
            'Stockholm': {'lat': 59.3293, 'lon': 18.0686, 'radius': 0.06, 'portfolio': european_portfolios[0]},
            'Copenhagen': {'lat': 55.6761, 'lon': 12.5683, 'radius': 0.05, 'portfolio': european_portfolios[0]},
            'Helsinki': {'lat': 60.1699, 'lon': 24.9384, 'radius': 0.05, 'portfolio': european_portfolios[0]},
            'Berlin': {'lat': 52.5200, 'lon': 13.4050, 'radius': 0.08, 'portfolio': european_portfolios[1]},
            'Munich': {'lat': 48.1351, 'lon': 11.5820, 'radius': 0.06, 'portfolio': european_portfolios[1]},
            'Amsterdam': {'lat': 52.3676, 'lon': 4.9041, 'radius': 0.05, 'portfolio': european_portfolios[1]},
            'Brussels': {'lat': 50.8503, 'lon': 4.3517, 'radius': 0.05, 'portfolio': european_portfolios[1]},
            'Paris': {'lat': 48.8566, 'lon': 2.3522, 'radius': 0.07, 'portfolio': european_portfolios[1]},
            'Vienna': {'lat': 48.2082, 'lon': 16.3738, 'radius': 0.06, 'portfolio': european_portfolios[1]},
            'Zurich': {'lat': 47.3769, 'lon': 8.5417, 'radius': 0.04, 'portfolio': european_portfolios[1]},
            'Madrid': {'lat': 40.4168, 'lon': -3.7038, 'radius': 0.07, 'portfolio': european_portfolios[2]},
            'Barcelona': {'lat': 41.3851, 'lon': 2.1734, 'radius': 0.06, 'portfolio': european_portfolios[2]},
            'Rome': {'lat': 41.9028, 'lon': 12.4964, 'radius': 0.07, 'portfolio': european_portfolios[2]},
            'Milan': {'lat': 45.4642, 'lon': 9.1900, 'radius': 0.06, 'portfolio': european_portfolios[2]},
            'Athens': {'lat': 37.9838, 'lon': 23.7275, 'radius': 0.06, 'portfolio': european_portfolios[2]},
            'Lisbon': {'lat': 38.7223, 'lon': -9.1393, 'radius': 0.05, 'portfolio': european_portfolios[2]},
        }

        norwegian_streets = {
            'Oslo': ['Karl Johans gate', 'Grønland', 'Torggata', 'Bogstadveien', 'Møllergata'],
            'Bergen': ['Torgallmenningen', 'Bryggen', 'Strandgaten', 'Kong Oscars gate', 'Marken'],
            'Trondheim': ['Munkegata', 'Nordre gate', 'Olav Tryggvasons gate', 'Thomas Angells gate', 'Fjordgata'],
            'Stavanger': ['Øvre Holmegate', 'Kirkegata', 'Pedersgata', 'Kongsgata', 'Løkkeveien']
        }

        european_street_patterns = [
            "Main Street", "High Street", "Church Street", "Market Street",
            "Station Road", "Park Avenue", "Royal Street", "Castle Road",
            "Harbor Street", "Lake View", "Mountain Road", "River Street",
            "Old Town Road", "New Street", "West Street", "East Street"
        ]

        for _ in range(50):
            city = random.choice(['Oslo', 'Bergen', 'Trondheim', 'Stavanger'])
            city_data = cities[city]
            lat = city_data['lat'] + random.uniform(-city_data['radius'], city_data['radius'])
            lon = city_data['lon'] + random.uniform(-city_data['radius'], city_data['radius'])
            street = random.choice(norwegian_streets[city])
            street_number = random.randint(1, 100)
            relevant_risks = random.randint(1, 10)
            handled_risks = random.randint(0, relevant_risks)
            value = random.randint(5000000, 50000000)
            risk_percentage = random.uniform(0.02, 0.10)
            financial_risk = int(value * risk_percentage)

            Property.objects.create(
                portfolio=city_data['portfolio'],
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

        for _ in range(450):
            city = random.choice([c for c in cities.keys() if c not in norwegian_streets])
            city_data = cities[city]
            lat = city_data['lat'] + random.uniform(-city_data['radius'], city_data['radius'])
            lon = city_data['lon'] + random.uniform(-city_data['radius'], city_data['radius'])
            street = f"{random.choice(european_street_patterns)} {random.choice(['North', 'South', 'East', 'West', ''])}"
            street_number = random.randint(1, 200)
            value = random.randint(200000, 10000000)
            relevant_risks = random.randint(1, 15)
            handled_risks = random.randint(0, relevant_risks)
            risk_percentage = random.uniform(0.02, 0.15)
            financial_risk = int(value * risk_percentage)

            Property.objects.create(
                portfolio=city_data['portfolio'],
                name=f"{street.strip()} {street_number}",
                address=f"{street.strip()} {street_number}",
                zip_code=f"{random.randint(0, 9)}{random.randint(0, 9)}{random.randint(0, 9)}{random.randint(0, 9)}",
                city=city,
                location=Point(lon, lat),
                estimated_value=value,
                relevant_risks=relevant_risks,
                handled_risks=handled_risks,
                total_financial_risk=financial_risk
            )

        self.stdout.write(self.style.SUCCESS(
            f'Successfully created {len(norwegian_portfolios) + len(european_portfolios)} portfolios '
            f'and {Property.objects.count()} properties across Europe'
        ))

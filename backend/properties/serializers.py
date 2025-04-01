from rest_framework import serializers
from rest_framework_gis.serializers import GeoFeatureModelSerializer
from .models import Property, Portfolio
import re

class PropertySerializer(GeoFeatureModelSerializer):
    class Meta:
        model = Property
        geo_field = 'location'
        fields = [
            'id', 'portfolio', 'name', 'address', 'zip_code',
            'city', 'location', 'estimated_value', 'relevant_risks',
            'handled_risks', 'total_financial_risk'
        ]

    def validate_name(self, value):
        if len(value.strip()) < 1:
            raise serializers.ValidationError("Name is required")
        if len(value) > 100:
            raise serializers.ValidationError("Name must be less than 100 characters")
        return value.strip().title()

    def validate_address(self, value):
        if len(value.strip()) < 1:
            raise serializers.ValidationError("Address is required")
        if len(value) > 255:
            raise serializers.ValidationError("Address must be less than 255 characters")
        return value.strip().title()

    def validate_zip_code(self, value):
        if not re.match(r'^\d{4}$', value):
            raise serializers.ValidationError("ZIP code must be 4 digits")
        return value

    def validate_city(self, value):
        if len(value.strip()) < 1:
            raise serializers.ValidationError("City is required")
        if len(value) > 100:
            raise serializers.ValidationError("City must be less than 100 characters")
        return value.strip()

    def validate_location(self, value):
        if value.x < -180 or value.x > 180:
            raise serializers.ValidationError("Longitude must be between -180 and 180")
        if value.y < -90 or value.y > 90:
            raise serializers.ValidationError("Latitude must be between -90 and 90")
        return value

    def validate_estimated_value(self, value):
        if value < 0:
            raise serializers.ValidationError("Estimated value must be positive")
        if value > 1000000000:
            raise serializers.ValidationError("Estimated value seems unreasonably high")
        return value

    def validate_relevant_risks(self, value):
        if value < 0:
            raise serializers.ValidationError("Relevant risks must be positive")
        if value > 1000:
            raise serializers.ValidationError("Number of relevant risks seems unreasonably high")
        if not isinstance(value, int):
            raise serializers.ValidationError("Relevant risks must be a whole number")
        return value

    def validate_handled_risks(self, value):
        if value < 0:
            raise serializers.ValidationError("Handled risks must be positive")
        if value > 1000:
            raise serializers.ValidationError("Number of handled risks seems unreasonably high")
        if not isinstance(value, int):
            raise serializers.ValidationError("Handled risks must be a whole number")
        return value

    def validate_total_financial_risk(self, value):
        if value < 0:
            raise serializers.ValidationError("Financial risk must be positive")
        if value > 1000000000:
            raise serializers.ValidationError("Financial risk must be between 0 and 1000000000")
        return value

    def validate(self, attrs):
        if attrs.get('handled_risks', 0) > attrs.get('relevant_risks', 0):
            raise serializers.ValidationError(
                "Number of handled risks cannot exceed number of relevant risks"
            )
        return attrs

class PortfolioSerializer(serializers.ModelSerializer):
    properties = PropertySerializer(many=True, read_only=True)

    class Meta:
        model = Portfolio
        fields = ['id', 'name', 'created_at', 'properties']

    def validate_name(self, value):
        if len(value.strip()) < 1:
            raise serializers.ValidationError("Name is required")
        if len(value) > 100:
            raise serializers.ValidationError("Name must be less than 100 characters")
        return value.strip().title()

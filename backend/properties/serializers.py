from rest_framework import serializers
from .models import Property, Portfolio

class PortfolioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Portfolio
        fields = ['id', 'name', 'created_at']

class PropertySerializer(serializers.ModelSerializer):
    class Meta:
        model = Property
        fields = [
            'id', 'portfolio', 'name', 'address', 'zip_code',
            'city', 'location', 'estimated_value', 'relevant_risks',
            'handled_risks', 'total_financial_risk'
        ]

    def validate(self, attrs):
        if attrs.get('handled_risks', 0) > attrs.get('relevant_risks', 0):
            raise serializers.ValidationError(
                "Number of handled risks cannot exceed number of relevant risks"
            )
        return attrs

from django.contrib.gis.db import models
from django.core.exceptions import ValidationError

class Portfolio(models.Model):
    name = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.name)

class Property(models.Model):
    portfolio = models.ForeignKey(
        Portfolio,
        related_name='properties',
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )
    name = models.CharField(max_length=255)
    address = models.CharField(max_length=255)
    zip_code = models.CharField(max_length=10)
    city = models.CharField(max_length=255)
    location = models.PointField()
    estimated_value = models.IntegerField(help_text="Value in NOK")
    relevant_risks = models.IntegerField()
    handled_risks = models.IntegerField()
    total_financial_risk = models.IntegerField(help_text="Risk in NOK")

    def clean(self):
        if self.handled_risks > self.relevant_risks:
            raise ValidationError("Number of handled risks cannot exceed number of relevant risks")

    def __str__(self):
        return str(self.name)

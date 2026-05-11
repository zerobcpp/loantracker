from rest_framework import serializers
from .models import Insurance


class InsuranceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Insurance
        fields = '__all__'


class InsuranceHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Insurance.history.model
        fields = '__all__'
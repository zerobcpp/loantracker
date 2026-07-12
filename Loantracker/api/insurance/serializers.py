from rest_framework import serializers
from .models import Insurance


class InsuranceSerializer(serializers.ModelSerializer):
    # expose the related loan's loan number (text) in the serialized output
    loan_number = serializers.CharField(source='loan.loan', read_only=True)
    class Meta:
        model = Insurance
        fields = [
            'id',
            'loan_number',
            'insurance_type',
            'insurance_provider',
            'insurance_agent',
            'insurance_start_date',
            'insurance_end_date',
            'created_at',
            'updated_at',
            'comment',
        ]


class InsuranceHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Insurance.history.model
        fields = '__all__'
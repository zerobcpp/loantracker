from rest_framework import serializers
from .models import Loan

class LoanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Loan
        fields = '__all__'
    
class LoanHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Loan.history.model
        fields = '__all__'
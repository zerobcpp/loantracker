from rest_framework import serializers
from .models import Loan, Commercial_loan, Residential_loan

class LoanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Loan
        fields = '__all__'
    
class LoanHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Loan.history.model
        fields = '__all__'
    
    
class CommercialLoanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Commercial_loan
        fields = '__all__'

class CommercialLoanHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Commercial_loan.history.model
        fields = '__all__'


class ResidentialLoanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Residential_loan
        fields = '__all__'
        

class ResidentialLoanHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Residential_loan.history.model
        fields = '__all__'
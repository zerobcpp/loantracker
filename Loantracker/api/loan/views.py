from django.shortcuts import render

from rest_framework import viewsets
from .models import Residential_loan, Commercial_loan
from .serializers import LoanSerializer, LoanHistorySerializer
from .serializers import CommercialLoanSerializer, CommercialLoanHistorySerializer
from .serializers import ResidentialLoanSerializer, ResidentialLoanHistorySerializer
from rest_framework.decorators import action
from rest_framework.response import Response
# Create your views here.

class ResidentialViewSet(viewsets.ModelViewSet):
    queryset = Residential_loan.objects.all()
    serializer_class = ResidentialLoanSerializer
    
    @action(detail = True, methods=['get'])
    def history(self, request, pk=None):
        loan = self.get_object()
        history = Residential_loan.history.all()
        serializer = LoanHistorySerializer(history, many=True)
        #print(serializer.data)
        return Response(serializer.data)
    
class CommercialViewSet(viewsets.ModelViewSet):
    queryset = Commercial_loan.objects.all()
    serializer_class = CommercialLoanSerializer
    
    @action(detail = True, methods=['get'])
    def history(self, request, pk=None):
        loan = self.get_object()
        history = Commercial_loan.history.all()
        serializer = CommercialLoanHistorySerializer(history, many=True)
        #print(serializer.data)
        return Response(serializer.data)
from django.shortcuts import render

from rest_framework import viewsets
from .models import Loan
from .serializers import LoanSerializer, LoanHistorySerializer
from rest_framework.decorators import action
from rest_framework.response import Response
# Create your views here.

class LoanViewSet(viewsets.ModelViewSet):
    queryset = Loan.objects.all()
    serializer_class = LoanSerializer
    
    @action(detail = True, methods=['get'])
    def history(self, request, pk=None):
        loan = self.get_object()
        history = loan.history.all()
        serializer = LoanHistorySerializer(history, many=True)
        print(serializer.data)
        return Response(serializer.data)
from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.decorators import action
from .models import Insurance
from .serializers import InsuranceSerializer, InsuranceHistorySerializer
from rest_framework.response import Response

# Create your views here.

class InsuranceViewSet(viewsets.ModelViewSet):
    queryset = Insurance.objects.all()
    serializer_class = InsuranceSerializer
    
    @action(detail = True, methods=['get'])
    def history(self, request, pk=None):
        insurance = self.get_object()
        history = insurance.history.all()
        serializer = InsuranceHistorySerializer(history, many=True)
        return Response(serializer.data)
    

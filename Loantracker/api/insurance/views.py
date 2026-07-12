from django.utils import timezone

from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.decorators import action
from .models import Insurance
from .serializers import InsuranceSerializer, InsuranceHistorySerializer
from rest_framework.response import Response
from django.http import JsonResponse
from rest_framework.decorators import api_view

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
    

@api_view(['GET'])
def generate_insurance_report(request):
    #print('called')
    time = timezone.now()
    ins = Insurance.objects.all().filter(insurance_start_date__year = time.year, insurance_start_date__month = time.month, loan__is_active=True)
    total = ins.count()
    #print(ins, time.month, time.year)
    response = {
        "time": time.isoformat(),
        "total_insurances": total,
        "insurances": InsuranceSerializer(ins, many=True).data,
    }
    return JsonResponse(response)
    

from django.http import HttpResponse
from django.shortcuts import render

from rest_framework import viewsets
from .models import Residential_loan, Commercial_loan
from .serializers import LoanSerializer, LoanHistorySerializer
from .serializers import CommercialLoanSerializer, CommercialLoanHistorySerializer
from .serializers import ResidentialLoanSerializer, ResidentialLoanHistorySerializer
from rest_framework.decorators import action, api_view
from rest_framework.response import Response
from django.utils import timezone
from django.http import JsonResponse
# Create your views here.

class ResidentialViewSet(viewsets.ModelViewSet):
    queryset = Residential_loan.objects.all()
    serializer_class = ResidentialLoanSerializer
    
    @action(detail = True, methods=['get'])
    def history(self, request, pk=None):
        loan = self.get_object()
        history = loan.history.all()
        serializer = LoanHistorySerializer(history, many=True)
        #print(serializer.data)
        return Response(serializer.data)
    
class CommercialViewSet(viewsets.ModelViewSet):
    queryset = Commercial_loan.objects.all()
    serializer_class = CommercialLoanSerializer
    
    @action(detail = True, methods=['get'])
    def history(self, request, pk=None):
        loan = self.get_object()
        history = loan.history.all()
        serializer = CommercialLoanHistorySerializer(history, many=True)
        #print(serializer.data)
        return Response(serializer.data)

@api_view(['GET'])
def generate_report(request):
    from api.loan.models import Loan
    
    now = timezone.now()
    current_month = now.month
    current_year = now.year
    loans = Loan.objects.filter(created_at__year=current_year, created_at__month=current_month)
    total = loans.count()
    concluded_loans = loans.filter(is_active=False).count()
    active_loans = loans.filter(is_active=True).count()
    
    #print(loans)
    report = {
        "time": now.isoformat(),
        "total_loans": total,
        "loans": LoanSerializer(loans, many=True).data,
        "concluded_loans": concluded_loans,
        "active_loans": active_loans,
    }
    return JsonResponse(report)
    
    

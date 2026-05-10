from django.shortcuts import render

from rest_framework import viewsets
from .models import Loan
from .serializers import LoanSerializer
# Create your views here.

class LoanViewSet(viewsets.ModelViewSet):
    queryset = Loan.objects.all()
    serializer_class = LoanSerializer
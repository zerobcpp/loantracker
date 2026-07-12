from django.urls import path, include
from .views import home

urlpatterns = [
    path('', home, name='home'),
    path('loans/', include('api.loan.urls')),
    path('insurance/', include('api.insurance.urls')),
]

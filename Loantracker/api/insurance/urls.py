from django.urls import include, path
from rest_framework import routers
from .views import InsuranceViewSet, generate_insurance_report

router = routers.DefaultRouter()
router.register(r'', InsuranceViewSet, basename='insurance')


urlpatterns = [
    path('report/', generate_insurance_report, name='insurance-report'),
    path('', include(router.urls)),
]
from django.urls import include, path
from rest_framework import routers

from .views import ResidentialViewSet, CommercialViewSet, generate_report

router = routers.DefaultRouter()

router.register(r'residential', ResidentialViewSet, basename='residential')
router.register(r'commercial', CommercialViewSet, basename='commercial')

urlpatterns = [
    path('', include(router.urls)),
    path('report', generate_report, name='generate_report'),
]

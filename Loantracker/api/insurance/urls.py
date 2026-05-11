from django.urls import include, path
from rest_framework import routers
from .views import InsuranceViewSet

router = routers.DefaultRouter()
router.register(r'', InsuranceViewSet, basename='insurance')


urlpatterns = [
    path('', include(router.urls)),
]
from django.urls import include, path
from rest_framework import routers

from .views import ResidentialViewSet, CommercialViewSet
router = routers.DefaultRouter()
router.register(r'', ResidentialViewSet, basename='residential')
router.register(r'', CommercialViewSet, basename='commercial')

urlpatterns = [
    path('', include(router.urls)),
]

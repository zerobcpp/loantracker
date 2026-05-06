from django.urls import include, path
from rest_framework import routers

from .views import LoanViewSet
router = routers.DefaultRouter()
router.register(r'', LoanViewSet, basename='loan')
urlpatterns = [
    path('', include(router.urls)),
]

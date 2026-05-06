from django.db import models
from simple_history.models import HistoricalRecords
# Create your models here.

class Insurance(models.Model):
    
    loan_id = models.IntegerField()
    insurance_type = models.CharField(max_length=256)
    insurance_provider = models.CharField(max_length=100)
    insurance_amount = models.DecimalField(max_digits=10, decimal_places=2)
    insurance_start_date = models.DateField()
    insurance_end_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    comment = models.TextField(blank=True, null=True)
    
    history = HistoricalRecords()
    def __str__(self):
        return f"{self.insurance_type} - {self.insurance_provider}"
    
    

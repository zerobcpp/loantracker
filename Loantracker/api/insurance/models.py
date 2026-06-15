from django.db import models
from simple_history.models import HistoricalRecords
from datetime import timedelta


# Create your models here.


class Insurance(models.Model):
    
    loan = models.ForeignKey('loan.loan', on_delete=models.CASCADE, related_name='insurances')
    insurance_type = models.CharField(max_length=128, null=True, blank=True)
    insurance_provider = models.CharField(max_length=256, blank=True, null=True)
    insurance_agent = models.ForeignKey('InsuranceAgency', on_delete=models.SET_NULL, null=True, blank=True)
    #insurance_amount = models.DecimalField(max_digits=10, decimal_places=2)
    insurance_start_date = models.DateField(blank=True, null=True)
    insurance_end_date = models.DateField(blank=True, null=True)  # Will be calculated in save method
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    comment = models.TextField(blank=True, null=True)
    history = HistoricalRecords()
    
    
    def save(self, *args, **kwargs):
        if not self.insurance_end_date and self.insurance_start_date:
            # Default to 1 year coverage if end_date not provided
            self.insurance_end_date = self.insurance_start_date + timedelta(days=365)
        super().save(*args, **kwargs)
        
        
    def __str__(self):
        return f"{self.loan}"
    
    
    
class InsuranceAgency(models.Model):
    name = models.CharField(max_length=256)
    contact_info = models.TextField(blank=True, null=True)
    # phone = models.CharField(max_length=20, blank=True, null=True)
    # address = models.TextField(blank=True, null=True)
    
    # emails = models.JSONField(blank=True, null=True, help_text="List of email addresses, e.g., ['primary@email.com', 'secondary@email.com']")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    history = HistoricalRecords()
    
    def __str__(self):
        return self.name


        


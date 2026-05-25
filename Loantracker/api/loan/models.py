from django.apps import apps
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone
from simple_history.models import HistoricalRecords
# Create your models here.
BUCKET = 32

class Loan(models.Model):
    loan = models.TextField()
    has_note = models.BooleanField(default=False)
    has_mortgage = models.BooleanField(default=False)
    has_title_insurance = models.BooleanField(default=False)
    has_insurance = models.BooleanField(default=False)
    has_recorded_mortgage = models.BooleanField(default=False)
    comment = models.TextField(blank=True, null=True)
    location = models.TextField(blank=True, null=True)
    
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    history = HistoricalRecords()
    
    def __str__(self):
        return f"{self.loan}"
    
    
    def save(self, *args, **kwargs):
        if not self.location:
            self.location = (int(self.loan) * 1009) % BUCKET
        super().save(*args, **kwargs)

class Commercial_loan(Loan):
    history = HistoricalRecords(inherit=True)
    class Meta:
        
        verbose_name = "Commercial Loan"
        verbose_name_plural = "Commercial Loans"


class Residential_loan(Loan):
    history = HistoricalRecords(inherit=True)
    class Meta:
        verbose_name = "Residential Loan"
        verbose_name_plural = "Residential Loans"
        
    
@receiver(post_save, sender=[Loan, Commercial_loan, Residential_loan])
def create_insurance_for_new_loan(sender, instance, created, **kwargs):
    if not created:
        return

    # Only create an insurance record for loans that are meant to have insurance.

    Insurance = apps.get_model('insurance', 'Insurance')
    Insurance.objects.create(
        loan = instance,
        insurance_start_date=timezone.now().date(),
    )
        
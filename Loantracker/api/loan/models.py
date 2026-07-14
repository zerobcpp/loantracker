from django.apps import apps
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone
from simple_history.models import HistoricalRecords

# Create your models here.
BUCKET = 20

class Loan(models.Model):
    loan = models.TextField()
    has_note = models.BooleanField(default=False)
    has_mortgage = models.BooleanField(default=False)
    has_title_insurance = models.BooleanField(default=False)
    has_insurance = models.BooleanField(default=False)
    has_recorded_mortgage = models.BooleanField(default=False)
    comment = models.TextField(blank=True, null=True)
    location = models.TextField(null=True, blank=True, help_text="Auto-calculated if wherabout is not provided")
    is_active = models.BooleanField(default=True, help_text="default True, set to False when loan is closed")
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)
    closed_at = models.DateField(blank=True, null=True, help_text="Date when loan was closed. Set when is_active is set to False.")
    
    history = HistoricalRecords()
    
    def __str__(self):
        return f"{self.loan}"
    
    
    def save(self, *args, **kwargs):
        if not self.location:
            self.location = (int(self.loan) * 1009) % BUCKET
        if not self.is_active and not self.closed_at:
            self.closed_at = timezone.now().date()
        super().save(*args, **kwargs)

class Commercial_loan(Loan):
    history = HistoricalRecords(inherit=True)
    has_UCC1 = models.BooleanField(default=False)
    has_Assignment_of_Rents = models.BooleanField(default=False)
    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Commercial Loan"
        verbose_name_plural = "Commercial Loans"


class Residential_loan(Loan):
    history = HistoricalRecords(inherit=True)
    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Residential Loan"
        verbose_name_plural = "Residential Loans"
        
    
def create_insurance_for_new_loan(sender, instance, created, **kwargs):
    if not created:
        return

    # Only create an insurance record for loans that are meant to have insurance.
    Insurance = apps.get_model('insurance', 'Insurance')
    Insurance.objects.create(
        loan=instance,
        insurance_start_date=timezone.now().date(),
    )


@receiver(post_save, sender=Loan)
def create_insurance_for_new_base_loan(sender, instance, created, **kwargs):
    create_insurance_for_new_loan(sender, instance, created, **kwargs)


@receiver(post_save, sender=Commercial_loan)
def create_insurance_for_new_commercial_loan(sender, instance, created, **kwargs):
    create_insurance_for_new_loan(sender, instance, created, **kwargs)


@receiver(post_save, sender=Residential_loan)
def create_insurance_for_new_residential_loan(sender, instance, created, **kwargs):
    create_insurance_for_new_loan(sender, instance, created, **kwargs)
        
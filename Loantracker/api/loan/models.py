from django.db import models
from simple_history.models import HistoricalRecords
# Create your models here.

class Loan(models.Model):
    loan_id = models.TextField()
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
        return f"Loan {self.loan_id}"
    
    
    def save(self, *args, **kwargs):
        skip = False
        if self.pk:
            previous = Loan.objects.get(pk=self.pk)
            
            if previous.comment != self.comment or previous.location != self.location:
                update_change_reason = f"Comment changed from '{previous.comment}' to '{self.comment}'"
            else:
                skip = True

        
        if skip:
            self.skip_history_when_saving = True
        super().save(*args, **kwargs)
        if skip:
            del self.skip_history_when_saving
        
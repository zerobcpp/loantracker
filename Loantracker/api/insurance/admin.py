from django.contrib import admin
from .models import Insurance, InsuranceAgency
from simple_history.admin import SimpleHistoryAdmin
# Register your models here.



class InsuranceAdmin(SimpleHistoryAdmin):
    list_display = ("loan", "insurance_type", "insurance_provider", "insurance_agent", "insurance_start_date", "insurance_end_date", "created_at")
    list_filter = ("insurance_type", "insurance_provider")
    search_fields = ("loan__loan", "insurance_provider", "comment")
    readonly_fields = ("created_at", "updated_at")
    ordering = ("-created_at",)

admin.site.register(Insurance, SimpleHistoryAdmin)
admin.site.register(InsuranceAgency, SimpleHistoryAdmin)
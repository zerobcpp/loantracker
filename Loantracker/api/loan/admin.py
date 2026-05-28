from django.contrib import admin
from .models import Commercial_loan, Residential_loan  
from simple_history.admin import SimpleHistoryAdmin
# Register your models here.


class CommercialloanAdmin(SimpleHistoryAdmin):
    list_display = ("loan", "has_note", "has_mortgage", "has_title_insurance", "has_insurance", "has_recorded_mortgage","has_UCC1", "has_Assignment_of_Rents","location", "created_at")
    list_filter = ("has_note", "has_mortgage", "has_title_insurance", "has_insurance", "has_recorded_mortgage")
    search_fields = ("loan_number", "comment")
    readonly_fields = ("created_at", "updated_at")
    fields = (
        "loan",
        "has_note",
        "has_mortgage",
        "has_title_insurance",
        "has_insurance",
        "has_recorded_mortgage",
        "has_UCC1",
        "has_Assignment_of_Rents",
        "location",
        "comment",
        "is_active",
        "closed_at",
        "created_at",
        "updated_at",
    )
    ordering = ("-created_at",)



class ResidentialloanAdmin(SimpleHistoryAdmin):
    list_display = ("loan", "has_note", "has_mortgage", "has_title_insurance", "has_insurance", "has_recorded_mortgage", "location", "created_at")
    list_filter = ("has_note", "has_mortgage", "has_title_insurance", "has_insurance", "has_recorded_mortgage")
    search_fields = ("loan", "comment")
    readonly_fields = ("created_at", "updated_at")
    fields = (
        "loan",
        "has_note",
        "has_mortgage",
        "has_title_insurance",
        "has_insurance",
        "has_recorded_mortgage",
        "location",
        "comment",
        "is_active",
        "closed_at",
        "created_at",
        "updated_at",
    )
    ordering = ("-created_at",)


admin.site.register(Residential_loan, ResidentialloanAdmin)
admin.site.register(Commercial_loan, CommercialloanAdmin)
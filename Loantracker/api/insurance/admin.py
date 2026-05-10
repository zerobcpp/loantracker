from django.contrib import admin
from .models import Insurance, InsuranceAgency
from simple_history.admin import SimpleHistoryAdmin
# Register your models here.

admin.site.register(Insurance, SimpleHistoryAdmin)
admin.site.register(InsuranceAgency, SimpleHistoryAdmin)
from django.test import TestCase

from api.insurance.models import Insurance
from api.loan.models import Residential_loan


class InsuranceSignalTests(TestCase):
    def test_new_residential_loan_creates_insurance(self):
        loan = Residential_loan.objects.create(
            loan='signal-test',
            has_note=False,
            has_mortgage=False,
            has_title_insurance=False,
            has_insurance=False,
            location='-1',
        )

        self.assertTrue(Insurance.objects.filter(loan=loan).exists())

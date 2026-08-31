from datetime import datetime

from django.test import TestCase
from django.utils import timezone

from api.insurance.models import Insurance
from api.loan.models import Commercial_loan, Residential_loan


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


class LoanHistoryDateTests(TestCase):
    def test_initial_history_date_matches_created_at(self):
        loan = Residential_loan.objects.create(
            loan='1001',
            has_note=False,
            has_mortgage=False,
            has_title_insurance=False,
            has_insurance=False,
            location='-1',
        )

        initial_history = loan.history.get(history_type='+')

        self.assertEqual(initial_history.history_date, loan.created_at)

    def test_initial_history_date_can_use_data_date_override(self):
        data_date = timezone.make_aware(datetime(2026, 1, 15, 9, 30))
        loan = Commercial_loan(
            loan='1002',
            has_note=True,
            has_mortgage=True,
            has_title_insurance=True,
            has_insurance=True,
            has_recorded_mortgage=True,
            has_UCC1=True,
            has_Assignment_of_Rents=True,
            location='-1',
        )
        loan._history_date = data_date
        loan.save()

        initial_history = loan.history.get(history_type='+')

        self.assertEqual(initial_history.history_date, data_date)

    def test_created_at_can_be_overridden_on_create(self):
        created_at = timezone.make_aware(datetime(2024, 7, 21))

        loan = Residential_loan.objects.create(
            loan='1003',
            has_note=False,
            has_mortgage=False,
            has_title_insurance=False,
            has_insurance=False,
            location='-1',
            created_at=created_at,
        )

        self.assertEqual(loan.created_at, created_at)

        initial_history = loan.history.get(history_type='+')
        self.assertEqual(initial_history.history_date, created_at)

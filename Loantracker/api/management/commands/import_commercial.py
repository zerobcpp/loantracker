import csv
from django.core.management.base import BaseCommand, CommandError
from api.loan.models import Commercial_loan


class Command(BaseCommand):
    help = 'Import commercial loan data from a CSV file'

    def add_arguments(self, parser):
        parser.add_argument('csv_file', type=str, help='Path to the CSV file to import')
        parser.add_argument(
            '--test',
            action='store_true',
            help='Preview the imported rows without saving them to the database',
        )

    def handle(self, *args, **options):
        csv_file = options['csv_file']
        dry_run = options['test']
        self.stdout.write(self.style.WARNING(f'Importing commercial loan data from: {csv_file}'))

        if dry_run:
            self.stdout.write(self.style.WARNING('Dry run enabled: no data will be saved.'))

        try:
            with open(csv_file, newline='', encoding='utf-8-sig') as file:
                reader = csv.reader(file)
                count = 0

                for row in reader:
                    if not row:
                        self.stdout.write(self.style.ERROR(f'Row skipped due to missing data: {row}'))
                        continue

                    loan = row[1]
                    preview = {
                        'loan': loan,
                        'has_note': True,
                        'has_insurance': True,
                        'has_mortgage': True,
                        'has_title_insurance': True,
                        'has_recorded_mortgage': row[17] != 'Yes',
                        'has_UCC1': row[18] != 'Yes',
                        'has_Assignment_of_Rents': row[19] != 'Yes',
                        'location': '-1',
                    }

                    if dry_run:
                        self.stdout.write(self.style.SQL_TABLE([preview]))
                    else:
                        Commercial_loan.objects.create(**preview)

                    count += 1

                if dry_run:
                    self.stdout.write(self.style.SUCCESS(f'Dry run complete: {count} row(s) would be processed from {csv_file}'))
                else:
                    self.stdout.write(self.style.SUCCESS(f'Processed {count} row(s) from {csv_file}'))
        except FileNotFoundError:
            raise CommandError(f'CSV file not found: {csv_file}')
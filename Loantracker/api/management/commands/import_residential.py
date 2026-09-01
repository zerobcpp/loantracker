import csv
from datetime import datetime, time

from django.core.management.base import BaseCommand, CommandError
from api.loan.models import Residential_loan
from django.utils import timezone


def date_to_created_at(value):
    return timezone.make_aware(datetime.combine(value, time.min))

class Command(BaseCommand):
    help = 'Import residential loan data from a CSV file'

    def add_arguments(self, parser):
        parser.add_argument('csv_file', type=str, help='Path to the CSV file to import')

    def handle(self, *args, **options):
        csv_file = options['csv_file']
        self.stdout.write(self.style.WARNING(f'Importing residential loan data from: {csv_file}'))

        try:
            with open(csv_file, newline='', encoding='utf-8-sig') as file:
                reader = csv.DictReader(file)
                count = 0
                
                
                for row in reader:
                    
                    s = row["TEXTJOIN Result"].split('##')
                    # for i, v in enumerate(s):   
                    #     print(i, v)
                    if s:
                        loan = s[0]
                        # note = True if s[12] != '' else False
                        # title = True if s[18] != '' else False
                        insurance = True if s[24] != '' else False
                        recorded_mortgage = True if s[30] != '' else False               
                        #LNT_date = s[6] if s[6] else timezone.now().date()
                        naive = datetime.strptime(s[12], "%m/%d/%Y").date() if s[13] else datetime.strptime(s[3], "%m/%d/%Y").date() if s[3] else timezone.now().date()
                        #print(naive)
                        created_at = date_to_created_at(naive)
                        
                        #aware = timezone.make_aware(naive).date()


                        
                        c = Residential_loan(
                            loan=loan,
                            has_insurance=insurance,
                            has_recorded_mortgage=recorded_mortgage,
                            location = "-1",
                            created_at=created_at,
                            updated_at=created_at, 
                        )
                        c._history_date = created_at
                        c.save()
                        count += 1
                    else:
                        self.stdout.write(self.style.ERROR(f'Row skipped due to missing TEXTJOIN Result: {row}'))
                    


                self.stdout.write(self.style.SUCCESS(f'Processed {count} row(s) from {csv_file}'))
        except FileNotFoundError:
            raise CommandError(f'CSV file not found: {csv_file}')

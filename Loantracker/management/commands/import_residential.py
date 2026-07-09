from django.core.management.base import BaseCommand
from api.loan.models import Residential_loan
import csv


class Command(BaseCommand):
    help = 'Import residential loan data from a CSV file'

    def add_arguments(self, parser):
        parser.add_argument('csv_file', type=str, help='Path to the CSV file to import')

    def handle(self, *args, **kwargs):
        csv_file = kwargs['csv_file']
        print("Importing residential loan data from:", csv_file)
        # Implement the logic to read the CSV file and import data into the database
        
        with open(csv_file, newline='') as file:
            reader = csv.DictReader(file)
            
            for row in reader:
                s = row['TEXTJOIN Result']
                s = s.split('##')
                print(s)
        
        
        self.stdout.write(self.style.SUCCESS(f'Successfully imported data from {csv_file}'))
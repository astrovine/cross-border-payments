import csv

def load_csv_data():
    data = []
    with open('data/payment.csv', 'r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        for row in reader:
            data.append(row)
    return data
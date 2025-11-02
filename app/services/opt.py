import requests
import os
from dotenv import load_dotenv

load_dotenv()
API_KEY = os.getenv('API_KEY')


def get_exchange_rates(source_currency='USD', dest_currency=None):
    """Get current exchange rates for currency"""
    if source_currency == 'USD':
        symbols = dest_currency if dest_currency else ''
        url = f'https://openexchangerates.org/api/latest.json?app_id={API_KEY}&base=USD&symbols={symbols}'
    else:
        url = f'https://openexchangerates.org/api/latest.json?app_id={API_KEY}&base=USD'
    try:
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()
        rates = data.get('rates', {})
        if source_currency == 'USD':
            return rates
        else:
            if source_currency not in rates or (dest_currency and dest_currency not in rates):
                print(f"Currency {source_currency} or {dest_currency} not found in rates")
                return None

            if dest_currency:
                usd_to_dest = rates[dest_currency]
                usd_to_source = rates[source_currency]
                source_to_dest = usd_to_dest / usd_to_source
                return {dest_currency: source_to_dest}
            else:
                source_rate = rates[source_currency]
                converted_rates = {}
                for currency, rate in rates.items():
                    if currency != source_currency:
                        converted_rates[currency] = rate / source_rate
                return converted_rates
    except requests.exceptions.RequestException as e:
        print(f"Error fetching exchange rates: {e}")
        return None

def calculate_total_cost(row, amount, exchange_rate, source_currency='USD'):
    """Calculate total cost for a provider given the amount and exchange rate"""
    fixed_fee = float(row.get('Fixed_Fee_Min_USD', 0))
    percentage_fee_min = float(row.get('Percentage_Fee_Min', 0))
    percentage_fee_max = float(row.get('Percentage_Fee_Max', 0))
    percentage_fee_avg = (percentage_fee_min + percentage_fee_max) / 2
    markup = float(row.get('Exchange_Rate_Markup_Min', 0))

    if source_currency != 'USD':
        try:
            url = f'https://openexchangerates.org/api/latest.json?app_id={API_KEY}&base=USD&symbols={source_currency}'
            response = requests.get(url)
            data = response.json()
            rates = data.get('rates', {})
            if source_currency in rates:
                amount_usd = amount / rates[source_currency]
            else:
                amount_usd = amount
        except:
            amount_usd = amount
    else:
        amount_usd = amount

    provider_rate = exchange_rate * (1 + markup / 100)
    total_fee_usd = fixed_fee + (percentage_fee_avg / 100) * amount_usd
    total_cost_dest = (amount_usd + total_fee_usd) * provider_rate
    return total_cost_dest


def calculate_speed(row):
    min_speed = float(row.get('Speed_Min_Hours', 0))
    max_speed = float(row.get('Speed_Max_Hours', 0))
    return (min_speed + max_speed) / 2

def recommend_provider(data, amount, source_currency, dest_currency, priority='cost'):
    """Recommend provider using list of dictionaries"""
    if source_currency == dest_currency:
        return {"error": "Source and destination currencies cannot be the same"}

    exchange_rates = get_exchange_rates(source_currency, dest_currency)
    if not exchange_rates or dest_currency not in exchange_rates:
        return {"error": f"Could not get exchange rate from {source_currency} to {dest_currency}"}

    exchange_rate = exchange_rates[dest_currency]
    results = []

    for row in data:
        cost = calculate_total_cost(row, amount, exchange_rate, source_currency)
        speed = calculate_speed(row)
        destination_amount = amount * exchange_rate

        results.append({
            'Provider': row['Provider'],
            'Total_Cost': cost,
            'Avg_Speed_Hours': speed,
            'Destination_Amount': destination_amount,
            'Exchange_Rate': exchange_rate,
            'Fees': float(row.get('Fixed_Fee_Min_USD', 0)) + (float(row.get('Percentage_Fee_Min', 0)) / 100) * amount,
            'Source_Currency': source_currency,
            'Dest_Currency': dest_currency
        })

    if not results:
        return None

    if priority == 'cost':
        results.sort(key=lambda x: x['Total_Cost'])
        best = results[0]
    elif priority == 'speed':
        results.sort(key=lambda x: x['Avg_Speed_Hours'])
        best = results[0]
    else:
        results.sort(key=lambda x: x['Total_Cost'])
        best = results[0]

    total_costs = [r['Total_Cost'] for r in results]
    baseline_cost = max(total_costs) if total_costs else 0
    best_cost = min(total_costs) if total_costs else 0
    savings = baseline_cost - best_cost

    return {
        'best': best,
        'providers': results,
        'summary': {
            'baseline_cost': baseline_cost,
            'best_cost': best_cost,
            'savings': savings,
            'savings_percentage': (savings / baseline_cost * 100) if baseline_cost > 0 else 0,
            'total_providers': len(results)
        }
    }


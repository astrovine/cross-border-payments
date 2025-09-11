import requests
import os
import pandas as pd
import numpy as np
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv('API_KEY')

def get_exchange_rates(source_currency='USD', dest_currency=None):
    """Fetch exchange rates and handle currency conversion."""
    if source_currency == 'USD':
        # Direct USD conversion
        symbols = dest_currency if dest_currency else ''
        url = f'https://openexchangerates.org/api/latest.json?app_id={API_KEY}&base=USD&symbols={symbols}'
    else:
        # Get all rates to perform cross-currency conversion
        url = f'https://openexchangerates.org/api/latest.json?app_id={API_KEY}&base=USD'

    try:
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()
        rates = data.get('rates', {})

        if source_currency == 'USD':
            return rates
        else:
            # Convert from source currency to destination currency via USD
            if source_currency not in rates or (dest_currency and dest_currency not in rates):
                print(f"Currency {source_currency} or {dest_currency} not found in rates")
                return None

            if dest_currency:
                # Cross rate calculation
                usd_to_dest = rates[dest_currency]
                usd_to_source = rates[source_currency]
                source_to_dest = usd_to_dest / usd_to_source
                return {dest_currency: source_to_dest}
            else:
                # Return all rates converted from source currency
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
    """Calculate total cost for a provider given the amount and exchange rate."""
    fixed_fee = row.get('Fixed_Fee_Min_USD', 0)
    percentage_fee_min = row.get('Percentage_Fee_Min', 0)
    percentage_fee_max = row.get('Percentage_Fee_Max', 0)
    percentage_fee_avg = (percentage_fee_min + percentage_fee_max) / 2
    markup = row.get('Exchange_Rate_Markup_Min', 0)

    # Convert amount to USD if source currency is not USD
    if source_currency != 'USD':
        # Get USD conversion rate for source currency
        try:
            url = f'https://openexchangerates.org/api/latest.json?app_id={API_KEY}&base=USD&symbols={source_currency}'
            response = requests.get(url)
            data = response.json()
            rates = data.get('rates', {})
            if source_currency in rates:
                amount_usd = amount / rates[source_currency]
            else:
                amount_usd = amount  # Fallback
        except:
            amount_usd = amount  # Fallback on error
    else:
        amount_usd = amount

    provider_rate = exchange_rate * (1 + markup / 100)
    total_fee_usd = fixed_fee + (percentage_fee_avg / 100) * amount_usd

    # Calculate total cost in destination currency
    total_cost_dest = (amount_usd + total_fee_usd) * provider_rate
    return total_cost_dest

def calculate_speed(row):
    min_speed = row.get('Speed_Min_Hours', 0)
    max_speed = row.get('Speed_Max_Hours', 0)
    return (min_speed + max_speed) / 2

def recommend_provider(df, amount, source_currency, dest_currency, priority='cost'):
    # Get exchange rates from source to destination currency
    if source_currency == dest_currency:
        return {"error": "Source and destination currencies cannot be the same"}

    exchange_rates = get_exchange_rates(source_currency, dest_currency)
    if not exchange_rates or dest_currency not in exchange_rates:
        return {"error": f"Could not get exchange rate from {source_currency} to {dest_currency}"}

    exchange_rate = exchange_rates[dest_currency]
    results = []

    for idx, row in df.iterrows():
        cost = calculate_total_cost(row, amount, exchange_rate, source_currency)
        speed = calculate_speed(row)

        # Calculate destination amount (amount in source currency converted to destination)
        destination_amount = amount * exchange_rate

        results.append({
            'Provider': row['Provider'],
            'Total_Cost': cost,
            'Avg_Speed_Hours': speed,
            'Destination_Amount': destination_amount,
            'Exchange_Rate': exchange_rate,
            'Fees': row.get('Fixed_Fee_Min_USD', 0) + (row.get('Percentage_Fee_Min', 0) / 100) * amount,
            'Source_Currency': source_currency,
            'Dest_Currency': dest_currency
        })

    if not results:
        return None

    recommendations = pd.DataFrame(results)

    if priority == 'cost':
        best = recommendations.sort_values(by='Total_Cost').iloc[0]
    elif priority == 'speed':
        best = recommendations.sort_values(by='Avg_Speed_Hours').iloc[0]
    else:
        best = recommendations.sort_values(by='Total_Cost').iloc[0]

    # Calculate summary statistics
    total_costs = recommendations['Total_Cost'].tolist()
    baseline_cost = max(total_costs) if total_costs else 0
    best_cost = min(total_costs) if total_costs else 0
    savings = baseline_cost - best_cost

    return {
        'best': best.to_dict(),
        'providers': recommendations.to_dict('records'),
        'summary': {
            'baseline_cost': baseline_cost,
            'best_cost': best_cost,
            'savings': savings,
            'savings_percentage': (savings / baseline_cost * 100) if baseline_cost > 0 else 0,
            'total_providers': len(results)
        }
    }

if __name__ == '__main__':
    df = pd.read_csv('C:/Code/Python/border-opt/dataset/payment.csv')

    print("testing exchange rate fetch and recommendation...\n")
    dest_currency_ngn = 'NGN'
    exchange_rates_ngn = get_exchange_rates(dest_currency_ngn)
    if exchange_rates_ngn:
        recommendation_ngn = recommend_provider(df, 1000, exchange_rates_ngn, dest_currency_ngn, priority='cost')
        print(recommendation_ngn)

    print("\n testing with GBP\n")
    dest_currency_gbp = 'GBP'
    exchange_rates_gbp = get_exchange_rates(dest_currency_gbp)
    if exchange_rates_gbp:
        recommendation_gbp = recommend_provider(df, 1000, exchange_rates_gbp, dest_currency_gbp, priority='speed')
        print(recommendation_gbp)

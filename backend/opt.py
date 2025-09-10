import requests
import os
import pandas as pd
import numpy as np

API_KEY = '2f1f680640e4499baf6924f25eed4b90'

def get_exchange_rates(dest_currency, base_currency='USD'):
    """Fetch exchange rates from Open Exchange Rates API."""
    symbols = ','.join(dest_currency) if isinstance(dest_currency, list) else dest_currency
    url = f'https://openexchangerates.org/api/latest.json?app_id={API_KEY}&base={base_currency}&symbols={symbols}'
    try:
        response = requests.get(url)
        response.raise_for_status()  # Raise error for bad status codes
        data = response.json()
        return data.get('rates', {})
    except requests.exceptions.RequestException as e:
        print(f"Error fetching exchange rates: {e}")
        return None

def calculate_total_cost(row, amount, exchange_rate):
    """Calculate total cost for a provider given the amount and exchange rate."""
    # Use the correct column names from your DataFrame
    fixed_fee = row.get('Fixed_Fee_Min_USD', 0)
    percentage_fee_min = row.get('Percentage_Fee_Min', 0)
    percentage_fee_max = row.get('Percentage_Fee_Max', 0)
    percentage_fee_avg = (percentage_fee_min + percentage_fee_max) / 2
    markup = row.get('Exchange_Rate_Markup_Min', 0)  # Correct column name
    provider_rate = exchange_rate * (1 + markup / 100)
    total_fee_usd = fixed_fee + (percentage_fee_avg / 100) * amount
    total_cost_dest = (amount + total_fee_usd) * provider_rate
    return total_cost_dest

def calculate_speed(row):
    min_speed = row.get('Speed_Min_Hours', 0)
    max_speed = row.get('Speed_Max_Hours', 0)
    return (min_speed + max_speed) / 2

def recommend_provider(df, amount, exchange_rates, dest_currency, priority='cost'):
    results = []
    for idx, row in df.iterrows():
        rate = exchange_rates.get(dest_currency)
        if rate is None:
            continue  # Skip if currency not supported

        cost = calculate_total_cost(row, amount, rate)
        speed = calculate_speed(row)

        results.append({
            'Provider': row['Provider'],
            'Total_Cost': cost,
            'Avg_Speed_Hours': speed,
            'Destination_Amount': amount * rate,
            'Exchange_Rate': rate,
            'Fees': row.get('Fixed_Fee_Min_USD', 0) + (row.get('Percentage_Fee_Min', 0) / 100) * amount,
        })

    if not results:
        return None

    recommendations = pd.DataFrame(results)

    if priority == 'cost':
        best = recommendations.sort_values(by='Total_Cost').iloc[0]
    elif priority == 'speed':
        best = recommendations.sort_values(by='Avg_Speed_Hours').iloc[0]
    else:
        # Default to cost if priority is unknown
        best = recommendations.sort_values(by='Total_Cost').iloc[0]

    # Calculate summary statistics
    total_costs = recommendations['Total_Cost'].tolist()
    baseline_cost = max(total_costs) if total_costs else 0
    best_cost = min(total_costs) if total_costs else 0
    savings = baseline_cost - best_cost

    # Return comprehensive result with all providers
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

    # Example 2: Test with GBP
    print("\n testing with GBP\n")
    dest_currency_gbp = 'GBP'
    exchange_rates_gbp = get_exchange_rates(dest_currency_gbp)
    if exchange_rates_gbp:
        recommendation_gbp = recommend_provider(df, 1000, exchange_rates_gbp, dest_currency_gbp, priority='speed')
        print(recommendation_gbp)

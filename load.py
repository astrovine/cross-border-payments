import pandas as pd
import os

# Create the dataset directory if it doesn't exist
os.makedirs('dataset', exist_ok=True)

# Payment providers data
payment_data = [
    ['Wise', 'Digital Money Transfer', 'Fixed + Percentage', 0.50, 2.00, 0.41, 0.62, 0.25, 24, 80, 0.00, 0.00, 'Wise Transparency', 'Mid-market rate used'],
    ['Western Union', 'Traditional + Digital', 'Variable by corridor', 5.00, 15.00, 1.00, 5.00, 0.25, 168, 200, 2.00, 4.00, 'World Bank RPW', 'Extensive agent network'],
    ['MoneyGram', 'Traditional + Digital', 'Variable by corridor', 4.00, 12.00, 1.00, 4.50, 0.50, 72, 200, 2.00, 3.50, 'World Bank RPW', 'Domestic limit 10000 USD'],
    ['Swift', 'Bank Wire Network', 'Fixed + Correspondent', 15.00, 50.00, 0.05, 0.25, 24.00, 72, 999, 0.00, 0.00, 'Banking Industry', 'Interbank network protocol'],
    ['Remitly', 'Digital Money Transfer', 'Tiered Service', 0.00, 8.00, 0.50, 2.50, 0.25, 72, 50, 1.00, 3.00, 'Remitly Transparency', 'Express vs Economy options'],
    ['Xoom', 'Digital Money Transfer', 'Variable by corridor', 0.00, 4.99, 1.00, 3.00, 0.25, 24, 160, 1.00, 2.50, 'PayPal Xoom', 'PayPal integration available'],
    ['WorldRemit', 'Digital Money Transfer', 'Fixed Fee Model', 2.99, 9.99, 0.00, 1.00, 0.25, 48, 130, 1.00, 2.00, 'WorldRemit Public', 'Mobile-focused platform'],
    ['Ria Money Transfer', 'Traditional + Digital', 'Variable by corridor', 3.00, 15.00, 1.00, 4.00, 1.00, 72, 190, 2.00, 4.00, 'Ria Public', 'Walmart partnership active'],
    ['Transfer Galaxy', 'Digital Money Transfer', 'Percentage Based', 0.00, 0.00, 0.80, 1.50, 24.00, 48, 30, 0.50, 1.00, 'Transfer Galaxy', 'European market focus'],
    ['OFX', 'Digital Money Transfer', 'Exchange Rate Markup', 0.00, 0.00, 0.00, 0.00, 24.00, 48, 190, 0.40, 2.00, 'OFX Transparency', 'No transfer fees charged'],
    ['Paysend', 'Digital Money Transfer', 'Flat Fee', 1.50, 2.99, 0.00, 0.00, 0.25, 24, 100, 2.00, 3.00, 'Paysend Public', 'Card-to-card transfers'],
    ['Azimo', 'Digital Money Transfer', 'Variable by corridor', 0.00, 4.99, 0.50, 2.00, 0.25, 48, 200, 1.00, 2.50, 'Azimo Public', 'Mobile-first approach'],
    ['Skrill', 'Digital Wallet', 'Percentage + Fixed', 1.45, 1.45, 1.45, 1.45, 0.25, 24, 40, 3.99, 3.99, 'Skrill Fees', 'Digital wallet service'],
    ['Payoneer', 'B2B Payment Platform', 'Volume Based', 1.50, 3.00, 0.50, 2.00, 24.00, 72, 200, 1.00, 3.00, 'Payoneer Public', 'Business-focused platform'],
    ['TransferGo', 'Digital Money Transfer', 'Fixed Fee', 0.99, 4.99, 0.00, 0.00, 0.25, 48, 47, 0.60, 2.00, 'TransferGo Public', 'European corridor specialist'],
    ['Currencies Direct', 'FX Specialist', 'Negotiable', 0.00, 0.00, 0.00, 0.00, 24.00, 48, 40, 0.50, 2.50, 'Currencies Direct', 'Large transfer specialist'],
    ['Global Reach', 'Digital Money Transfer', 'Variable', 2.00, 8.00, 0.50, 1.50, 1.00, 48, 40, 1.00, 2.00, 'Global Reach', 'Cash pickup network'],
    ['InstaReM', 'Digital Money Transfer', 'Mid-market focused', 0.00, 15.00, 0.25, 1.00, 1.00, 48, 55, 0.25, 1.00, 'InstaReM Public', 'Business and consumer'],
    ['Pangea', 'Digital Money Transfer', 'Flat Fee', 4.99, 4.99, 0.00, 0.00, 24.00, 72, 21, 1.50, 2.50, 'Pangea Public', 'Latin America specialist'],
    ['Sharemoney', 'Digital Money Transfer', 'Fixed Fee', 3.99, 4.99, 0.00, 0.00, 0.25, 72, 90, 2.00, 4.00, 'Sharemoney Public', 'Cash pickup available']
]

# Column names
columns = [
    'Provider', 'Service_Type', 'Fee_Structure', 'Fixed_Fee_Min_USD', 'Fixed_Fee_Max_USD',
    'Percentage_Fee_Min', 'Percentage_Fee_Max', 'Speed_Min_Hours', 'Speed_Max_Hours',
    'Coverage_Countries', 'Exchange_Rate_Markup_Min', 'Exchange_Rate_Markup_Max',
    'Source', 'Notes'
]


df = pd.DataFrame(payment_data, columns=columns)

df.to_csv('C:/Code/Python/border-opt/dataset/payment.csv', index=False, encoding='utf-8')
print(f"Data shape: {df.shape}")
print(f"Number of payment providers: {len(df)}")

print("\n First 5 rows:")
print(df.head())

test_df = pd.read_csv('C:/Code/Python/border-opt/dataset/payment.csv')
print(f"\n File loads successfully with shape: {test_df.shape}")
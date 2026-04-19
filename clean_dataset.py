import pandas as pd
import random
import os

df = pd.read_csv('TS-PS14.csv')

# First, remap the core original phrases
mapping = {
    'Need bulk order details': {'priority': 'Medium', 'sentiment': 'Neutral', 'category': 'Trade'},
    'Box was broken': {'priority': 'High', 'sentiment': 'Frustrated', 'category': 'Packaging'},
    'Product stopped working': {'priority': 'High', 'sentiment': 'Angry', 'category': 'Product'},
    'Poor packaging quality': {'priority': 'Medium', 'sentiment': 'Sad', 'category': 'Packaging'},
    'Inquiry about pricing': {'priority': 'Low', 'sentiment': 'Neutral', 'category': 'Trade'},
    'Damaged packaging': {'priority': 'High', 'sentiment': 'Frustrated', 'category': 'Packaging'},
    'Trade-related query': {'priority': 'Low', 'sentiment': 'Neutral', 'category': 'Trade'},
    'Product malfunctioning': {'priority': 'High', 'sentiment': 'Angry', 'category': 'Product'},
    'Defective item received': {'priority': 'High', 'sentiment': 'Angry', 'category': 'Product'}
}

def fix_priority(text):
    return mapping.get(text, {}).get('priority', 'Medium')

def fix_sentiment(text):
    return mapping.get(text, {}).get('sentiment', 'Neutral')

def fix_category(text):
    return mapping.get(text, {}).get('category', 'Product')

# Only apply to the original 9 phrases if they match exactly
# For rows that don't match, we assume they are already augmented/correct or we drop them.
# To be safe, let's just rewrite the whole CSV from scratch based on the 10000 rows to ensure no garbage is left.
df = df.head(10000).copy() # take original 10000
df['priority'] = df['text'].apply(fix_priority)
df['sentiment'] = df['text'].apply(fix_sentiment)
df['category'] = df['text'].apply(fix_category)

# Now, let's create a MASSIVE dictionary of variations so the AI learns the vocabulary perfectly.
extra_data = [
    # TRADE / INQUIRY (Trade Inquiry)
    ("inquiry for bulk order", "Trade", "Low", "Neutral"),
    ("what are your wholesale rates", "Trade", "Low", "Neutral"),
    ("do you have this in stock", "Trade", "Low", "Neutral"),
    ("can I get a discount", "Trade", "Low", "Happy"),
    ("I want a full refund right now", "Trade", "High", "Angry"),
    ("wholesale pricing for 500 units", "Trade", "Low", "Neutral"),
    ("is there a B2B discount", "Trade", "Low", "Neutral"),
    ("cancel my order immediately", "Trade", "High", "Angry"),

    # SHIPPING (Shipping Issue / Delivery Delay)
    ("my delivery is delayed", "Shipping", "Medium", "Sad"),
    ("shipment is late by 3 days", "Shipping", "High", "Angry"),
    ("where is my order it is overdue", "Shipping", "Medium", "Frustrated"),
    ("package delayed beyond deadline", "Shipping", "High", "Frustrated"),
    ("courier service is very slow", "Shipping", "Medium", "Sad"),
    ("order stuck in transit for a week", "Shipping", "High", "Angry"),
    ("tracking says delivered but I have nothing", "Shipping", "High", "Angry"),
    ("it has been 5 days past delivery date", "Shipping", "High", "Frustrated"),

    # PACKAGING (Packaging Issue)
    ("poor packaging quality", "Packaging", "Medium", "Frustrated"),
    ("the box was torn", "Packaging", "Medium", "Sad"),
    ("missing padding in the box", "Packaging", "Low", "Neutral"),
    ("box was open when it arrived", "Packaging", "Medium", "Frustrated"),
    ("the carton is crushed", "Packaging", "Medium", "Sad"),
    ("shattered glass inside the box", "Packaging", "High", "Angry"),
    ("tape was ripped off the package", "Packaging", "Medium", "Frustrated"),

    # PRODUCT (Product Issue)
    ("defective product", "Product", "High", "Angry"),
    ("not working correctly", "Product", "High", "Angry"),
    ("item is malfunctioning", "Product", "High", "Frustrated"),
    ("product stopped working", "Product", "High", "Angry"),
    ("broken on arrival", "Product", "High", "Angry"),
    ("faulty unit", "Product", "High", "Frustrated"),
    ("received damaged product", "Product", "High", "Angry"),
    ("completely defective item", "Product", "High", "Frustrated"),
    ("the device won't turn on", "Product", "High", "Angry"),
    ("it is defective", "Product", "High", "Frustrated"),
    ("broken item", "Product", "High", "Angry"),
    ("malfunctioning unit", "Product", "High", "Frustrated"),
    ("faulty product", "Product", "High", "Angry"),
    ("doesn't work", "Product", "High", "Angry"),
    ("item broken", "Product", "High", "Angry"),
    ("late delivery", "Shipping", "Medium", "Sad"),
    ("delayed order", "Shipping", "Medium", "Sad"),
    ("where is package", "Shipping", "Medium", "Frustrated"),
    ("overdue shipment", "Shipping", "High", "Angry"),
    ("shipping delay", "Shipping", "Medium", "Sad"),
    ("damaged box", "Packaging", "Medium", "Sad"),
    ("broken package", "Packaging", "Medium", "Frustrated"),
    ("open box", "Packaging", "Medium", "Frustrated"),
    ("torn shipping box", "Packaging", "Medium", "Sad"),
    ("price inquiry", "Trade", "Low", "Neutral"),
    ("bulk discount", "Trade", "Low", "Neutral"),
    ("order status", "Trade", "Low", "Neutral"),

    # SARCASM / NEGATIVE CONTEXT (Angry / Frustrated)
    ("Wow thanks for the broken item", "Product", "High", "Angry"),
    ("Great job on losing my package", "Shipping", "High", "Angry"),
    ("Wonderful service it has only been a month", "Shipping", "High", "Frustrated"),
    ("Love receiving empty boxes", "Packaging", "High", "Angry"),
    ("Amazing how it broke in one day", "Product", "High", "Frustrated"),
    ("Brilliant service I am still waiting", "Shipping", "Medium", "Frustrated"),
    ("Thanks for absolutely nothing", "Trade", "Medium", "Angry"),
    ("Perfect another defective unit", "Product", "High", "Angry"),
    ("So happy my delivery is lost", "Shipping", "High", "Angry"),
]

new_rows = []
for text, category, priority, sentiment in extra_data:
    for _ in range(500): # Add 500 copies of each variation
        new_rows.append({
            'complaint_id': random.randint(100000, 999999),
            'text': text,
            'category': category,
            'priority': priority,
            'sentiment': sentiment,
            'resolution_time': random.randint(1, 48)
        })

df = pd.concat([df, pd.DataFrame(new_rows)], ignore_index=True)

df.to_csv('TS-PS14.csv', index=False)
print("Dataset heavily augmented with accurate priority examples!")

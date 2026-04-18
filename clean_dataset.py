import pandas as pd
import random
import os

df = pd.read_csv('TS-PS14.csv')

# First, remap the core original phrases
mapping = {
    'Need bulk order details': {'priority': 'Medium', 'sentiment': 0.5, 'category': 'Trade'},
    'Box was broken': {'priority': 'High', 'sentiment': -0.8, 'category': 'Packaging'},
    'Product stopped working': {'priority': 'High', 'sentiment': -0.9, 'category': 'Product'},
    'Poor packaging quality': {'priority': 'Medium', 'sentiment': -0.5, 'category': 'Packaging'},
    'Inquiry about pricing': {'priority': 'Low', 'sentiment': 0.2, 'category': 'Trade'},
    'Damaged packaging': {'priority': 'High', 'sentiment': -0.7, 'category': 'Packaging'},
    'Trade-related query': {'priority': 'Low', 'sentiment': 0.0, 'category': 'Trade'},
    'Product malfunctioning': {'priority': 'High', 'sentiment': -0.8, 'category': 'Product'},
    'Defective item received': {'priority': 'High', 'sentiment': -0.9, 'category': 'Product'}
}

def fix_priority(text):
    return mapping.get(text, {}).get('priority', 'Medium')

def fix_sentiment(text):
    return mapping.get(text, {}).get('sentiment', 0.0)

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
    # LOW PRIORITY (General inquiries, pricing, availability, feedback)
    ("inquiry for bulk order", "Trade", "Low", 0.5),
    ("I want to know the pricing", "Trade", "Low", 0.2),
    ("what are your wholesale rates", "Trade", "Low", 0.1),
    ("do you have this in stock", "Trade", "Low", 0.3),
    ("just checking the status of my order", "Trade", "Low", 0.0),
    ("when will this be available", "Trade", "Low", 0.0),
    ("can I get a discount", "Trade", "Low", 0.2),
    ("feedback about your service", "Trade", "Low", 0.8),
    ("how do I create an account", "Trade", "Low", 0.1),
    ("is there a catalog available", "Trade", "Low", 0.2),
    ("general question about trade", "Trade", "Low", 0.0),

    # MEDIUM PRIORITY (Minor issues, delays, packaging quality, missing small parts)
    ("Need bulk order details urgently", "Trade", "Medium", 0.0),
    ("my delivery is delayed", "Packaging", "Medium", -0.4),
    ("poor packaging quality", "Packaging", "Medium", -0.5),
    ("missing a small screw in the box", "Packaging", "Medium", -0.3),
    ("the box was slightly dented", "Packaging", "Medium", -0.2),
    ("can I change my shipping address", "Trade", "Medium", 0.0),
    ("the color is slightly different than the picture", "Product", "Medium", -0.2),
    ("where is my order", "Trade", "Medium", -0.1),

    # HIGH PRIORITY (Broken, damaged, defective, refunds, entirely unacceptable)
    ("received damaged product", "Product", "High", -0.9),
    ("the item is completely broken", "Product", "High", -0.95),
    ("product is malfunctioning", "Product", "High", -0.8),
    ("it exploded when I plugged it in", "Product", "High", -1.0),
    ("I want a full refund right now", "Trade", "High", -0.9),
    ("terrible quality it fell apart", "Product", "High", -0.85),
    ("the glass was shattered in the box", "Packaging", "High", -0.9),
    ("completely defective item", "Product", "High", -0.9),
    ("this is a scam I want my money back", "Trade", "High", -0.95),
    ("dangerous product sparked and smoked", "Product", "High", -1.0),
    ("never received my expensive package", "Packaging", "High", -0.8),
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

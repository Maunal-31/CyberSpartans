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
    # LOW PRIORITY (General inquiries, pricing, availability, feedback)
    ("inquiry for bulk order", "Trade", "Low", "Neutral"),
    ("I want to know the pricing", "Trade", "Low", "Neutral"),
    ("what are your wholesale rates", "Trade", "Low", "Neutral"),
    ("do you have this in stock", "Trade", "Low", "Neutral"),
    ("just checking the status of my order", "Trade", "Low", "Neutral"),
    ("when will this be available", "Trade", "Low", "Neutral"),
    ("can I get a discount", "Trade", "Low", "Happy"),
    ("feedback about your service", "Trade", "Low", "Happy"),
    ("how do I create an account", "Trade", "Low", "Neutral"),
    ("is there a catalog available", "Trade", "Low", "Neutral"),
    ("general question about trade", "Trade", "Low", "Neutral"),

    # MEDIUM PRIORITY (Minor issues, delays, packaging quality, missing small parts)
    ("Need bulk order details urgently", "Trade", "Medium", "Neutral"),
    ("my delivery is delayed", "Packaging", "Medium", "Sad"),
    ("poor packaging quality", "Packaging", "Medium", "Frustrated"),
    ("missing a small screw in the box", "Packaging", "Medium", "Frustrated"),
    ("the box was slightly dented", "Packaging", "Medium", "Sad"),
    ("can I change my shipping address", "Trade", "Medium", "Neutral"),
    ("the color is slightly different than the picture", "Product", "Medium", "Sad"),
    ("where is my order", "Trade", "Medium", "Frustrated"),

    # HIGH PRIORITY (Broken, damaged, defective, refunds, entirely unacceptable)
    ("received damaged product", "Product", "High", "Angry"),
    ("the item is completely broken", "Product", "High", "Angry"),
    ("product is malfunctioning", "Product", "High", "Angry"),
    ("it exploded when I plugged it in", "Product", "High", "Angry"),
    ("I want a full refund right now", "Trade", "High", "Angry"),
    ("terrible quality it fell apart", "Product", "High", "Frustrated"),
    ("the glass was shattered in the box", "Packaging", "High", "Angry"),
    ("completely defective item", "Product", "High", "Frustrated"),
    ("this is a scam I want my money back", "Trade", "High", "Angry"),
    ("dangerous product sparked and smoked", "Product", "High", "Angry"),
    ("never received my expensive package", "Packaging", "High", "Sad"),
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

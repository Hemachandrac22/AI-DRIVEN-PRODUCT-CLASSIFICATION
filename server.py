from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Initialize the zero-shot classifier
classifier = pipeline("zero-shot-classification", 
                     model="facebook/bart-large-mnli", 
                     token="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")

# Predefined eCommerce categories
categories = [
    "Electronics", "Fashion", "Home & Kitchen", "Sports & Outdoors",
    "Beauty & Personal Care", "Books", "Toys & Games", "Automotive",
    "Health & Wellness", "Grocery"
]

@app.route('/classify', methods=['POST'])
def classify_product():
    data = request.json
    if not data or 'name' not in data or 'description' not in data:
        return jsonify({'error': 'Missing product name or description'}), 400

    text = f"{data['name']} {data['description']}"
    result = classifier(text, candidate_labels=categories)
    
    return jsonify({
        'category': result['labels'][0]  # Return the highest confidence label
    })

if __name__ == '__main__':
    app.run(port=5000)
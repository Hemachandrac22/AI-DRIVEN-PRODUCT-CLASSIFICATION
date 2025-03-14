import React, { useState } from 'react';
import { Send, Loader2, PackageSearch, ArrowRight, AlertCircle } from 'lucide-react';

const categories = [
  "Electronics", "Fashion", "Home & Kitchen", "Sports & Outdoors",
  "Beauty & Personal Care", "Books", "Toys & Games", "Automotive",
  "Health & Wellness", "Grocery"
];

// Simple keyword-based categorization
const categorizeProduct = (name: string, description: string): string => {
  const text = `${name} ${description}`.toLowerCase();
  
  const categoryKeywords: Record<string, string[]> = {
    "Electronics": ["phone", "laptop", "computer", "gadget", "electronic", "digital", "smart", "device"],
    "Fashion": ["shirt", "dress", "pants", "clothing", "wear", "fashion", "apparel", "shoes"],
    "Home & Kitchen": ["kitchen", "home", "furniture", "appliance", "decor", "cook", "bed", "house"],
    "Sports & Outdoors": ["sport", "fitness", "exercise", "outdoor", "gym", "athletic", "bike", "camping"],
    "Beauty & Personal Care": ["beauty", "cosmetic", "skin", "hair", "makeup", "care", "personal"],
    "Books": ["book", "novel", "reading", "literature", "textbook", "magazine", "comic"],
    "Toys & Games": ["toy", "game", "play", "puzzle", "kids", "children", "entertainment"],
    "Automotive": ["car", "vehicle", "auto", "automotive", "motor", "engine", "truck"],
    "Health & Wellness": ["health", "vitamin", "supplement", "wellness", "medical", "fitness"],
    "Grocery": ["food", "drink", "grocery", "snack", "beverage", "fresh", "organic"]
  };

  let maxMatches = 0;
  let bestCategory = categories[0];

  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    const matches = keywords.filter(keyword => text.includes(keyword)).length;
    if (matches > maxMatches) {
      maxMatches = matches;
      bestCategory = category;
    }
  }

  return bestCategory;
};

interface ProductData {
  name: string;
  description: string;
  category: string;
}

function App() {
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [history, setHistory] = useState<ProductData[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API delay for better UX
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const category = categorizeProduct(productName, productDescription);
      setResult(category);
      setHistory(prev => [...prev, {
        name: productName,
        description: productDescription,
        category
      }]);
      setProductName('');
      setProductDescription('');
    } catch (err) {
      setError('Failed to categorize product. Please try again.');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <PackageSearch className="w-10 h-10 text-indigo-600" />
            <h1 className="text-4xl font-bold text-gray-900">HCAC Services</h1>
          </div>
          <p className="text-gray-600">AI-Powered Product Categorization</p>
        </header>

        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-1">
                Product Name
              </label>
              <input
                id="productName"
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter product name"
                required
              />
            </div>

            <div>
              <label htmlFor="productDescription" className="block text-sm font-medium text-gray-700 mb-1">
                Product Description
              </label>
              <textarea
                id="productDescription"
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 h-32"
                placeholder="Enter product description"
                required
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Categorize Product
                </>
              )}
            </button>
          </form>

          {result && (
            <div className="mt-6 p-4 bg-indigo-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Predicted Category:</h3>
              <p className="text-indigo-600 text-xl font-bold">{result}</p>
            </div>
          )}

          {history.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Categorizations</h3>
              <div className="space-y-3">
                {history.map((item, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg flex items-center">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-500 truncate">{item.description}</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 mx-3" />
                    <div className="text-right">
                      <p className="font-medium text-indigo-600">{item.category}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
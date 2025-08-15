'use client';

import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';

export default function TestAPIPage() {
  const [results, setResults] = useState<Record<string, { status: number; data: unknown }>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testAPI = async (endpoint: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`http://localhost:8000${endpoint}`);
      const data = await response.json();
      
      setResults(prev => ({
        ...prev,
        [endpoint]: {
          status: response.status,
          data: data
        }
      }));
    } catch (err) {
      setError(`Error testing ${endpoint}: ${err}`);
      console.error(`API Error for ${endpoint}:`, err);
    } finally {
      setLoading(false);
    }
  };

  const testAllAPIs = async () => {
    const endpoints = [
      '/api/v1/plants/search/advanced?q=monstera',
      '/api/v1/plants/market-data',
      '/api/v1/plants/quick-stats',
      '/api/v1/plants/search/suggestions?q=mon',
      '/api/v1/plants'
    ];

    for (const endpoint of endpoints) {
      await testAPI(endpoint);
      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">🧪 API Test Page</h1>
        
        <div className="mb-6">
          <Button 
            onClick={testAllAPIs} 
            disabled={loading}
            className="mr-4"
          >
            {loading ? 'Testing...' : 'Test All APIs'}
          </Button>
          
          <Button 
            onClick={() => setResults({})} 
            variant="outline"
          >
            Clear Results
          </Button>
        </div>

        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-800">❌ Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-700">{error}</p>
            </CardContent>
          </Card>
        )}

        <div className="space-y-4">
          {Object.entries(results).map(([endpoint, result]: [string, { status: number; data: unknown }]) => (
            <Card key={endpoint}>
              <CardHeader>
                <CardTitle className="text-sm font-mono">
                  {endpoint}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-2">
                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                    result.status === 200 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    Status: {result.status}
                  </span>
                </div>
                
                <div className="bg-gray-100 p-3 rounded text-xs font-mono overflow-auto max-h-40">
                  <pre>{JSON.stringify(result.data, null, 2)}</pre>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {Object.keys(results).length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
                                        <p className="text-gray-500">Click &quot;Test All APIs&quot; to start testing</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
} 
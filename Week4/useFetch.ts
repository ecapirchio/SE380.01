import { useState, useEffect } from 'react';

const API_KEY = 'ce00fc3f460f4e97b1f183122241009'; // Replace with your actual API key

export function useFetchWeather(query: string) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://api.weatherapi.com/v1/${query}&key=${API_KEY}`);
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError('Failed to fetch weather data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [query]);

  return { data, loading, error };
}

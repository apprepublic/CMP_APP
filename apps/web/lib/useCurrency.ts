import { useState, useEffect, useCallback } from 'react';

export type CurrencyCode = 'NGN' | 'USD';

export interface CurrencyData {
  code: CurrencyCode;
  symbol: string;
  ratePerCmp: number; // How much fiat 1 CMP equals
}

const RATES: Record<CurrencyCode, CurrencyData> = {
  NGN: {
    code: 'NGN',
    symbol: '₦',
    ratePerCmp: 0.1,
  },
  USD: {
    code: 'USD',
    symbol: '$',
    ratePerCmp: 0.00006667,
  },
};

export function useCurrency() {
  const [currency, setCurrency] = useState<CurrencyCode>('USD'); // Default to USD
  const [loadingLocation, setLoadingLocation] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only run on client
    if (typeof window === 'undefined' || !navigator.geolocation) {
      setLoadingLocation(false);
      return;
    }

    const handleSuccess = async (position: GeolocationPosition) => {
      try {
        const { latitude, longitude } = position.coords;
        // Free client-side reverse geocoding API (no API key required)
        const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
        if (!res.ok) throw new Error('Failed to fetch location data');
        
        const data = await res.json();
        
        // If countryCode is Nigeria, set NGN, otherwise USD
        if (data.countryCode === 'NG') {
          setCurrency('NGN');
        } else {
          setCurrency('USD');
        }
      } catch (err: any) {
        console.error('Location detection error:', err);
        setError('Failed to detect location, defaulting to USD');
      } finally {
        setLoadingLocation(false);
      }
    };

    const handleError = (err: GeolocationPositionError) => {
      console.warn('Geolocation error:', err.message, '- Defaulting to USD');
      setError('Geolocation access denied or unavailable, defaulting to USD');
      setLoadingLocation(false);
    };

    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
      timeout: 10000,
      maximumAge: 1000 * 60 * 60, // 1 hour
    });
  }, []);

  const activeRate = RATES[currency];

  const getFiatEquivalent = useCallback((coins: number) => {
    return coins * activeRate.ratePerCmp;
  }, [activeRate]);

  const formatFiat = useCallback((coins: number) => {
    const amount = getFiatEquivalent(coins);
    
    let minFractionDigits = 2;
    let maxFractionDigits = currency === 'USD' && amount > 0 && amount < 0.01 ? 4 : 2;

    const formattedAmount = amount.toLocaleString('en-US', {
      minimumFractionDigits: minFractionDigits,
      maximumFractionDigits: maxFractionDigits,
    });

    return `${activeRate.symbol}${formattedAmount} ${activeRate.code}`;
  }, [getFiatEquivalent, activeRate, currency]);

  const getCoinsFromFiat = useCallback((fiatAmount: number) => {
    return fiatAmount / activeRate.ratePerCmp;
  }, [activeRate]);

  return {
    currency,
    activeRate,
    loadingLocation,
    error,
    getFiatEquivalent,
    formatFiat,
    getCoinsFromFiat,
  };
}

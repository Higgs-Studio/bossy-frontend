'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState, useEffect } from 'react';
import { parsePhoneNumber, CountryCode, getCountries, getCountryCallingCode } from 'libphonenumber-js';

// Common countries with their flags
const COUNTRY_OPTIONS = [
  { code: 'HK' as CountryCode, name: 'Hong Kong', flag: '🇭🇰' },
  { code: 'CN' as CountryCode, name: 'China', flag: '🇨🇳' },
  { code: 'US' as CountryCode, name: 'United States', flag: '🇺🇸' },
  { code: 'GB' as CountryCode, name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'CA' as CountryCode, name: 'Canada', flag: '🇨🇦' },
  { code: 'AU' as CountryCode, name: 'Australia', flag: '🇦🇺' },
  { code: 'SG' as CountryCode, name: 'Singapore', flag: '🇸🇬' },
  { code: 'JP' as CountryCode, name: 'Japan', flag: '🇯🇵' },
  { code: 'KR' as CountryCode, name: 'South Korea', flag: '🇰🇷' },
  { code: 'TW' as CountryCode, name: 'Taiwan', flag: '🇹🇼' },
  { code: 'MY' as CountryCode, name: 'Malaysia', flag: '🇲🇾' },
  { code: 'IN' as CountryCode, name: 'India', flag: '🇮🇳' },
  { code: 'PH' as CountryCode, name: 'Philippines', flag: '🇵🇭' },
  { code: 'TH' as CountryCode, name: 'Thailand', flag: '🇹🇭' },
  { code: 'VN' as CountryCode, name: 'Vietnam', flag: '🇻🇳' },
];

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  className?: string;
}

export function PhoneInput({
  value,
  onChange,
  label = 'Mobile Phone',
  placeholder = '9542 7840',
  error,
  className = '',
}: PhoneInputProps) {
  const [countryCode, setCountryCode] = useState<CountryCode>('HK');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isValid, setIsValid] = useState(true);

  // Parse the initial value to extract country code and phone number
  useEffect(() => {
    if (value) {
      try {
        // Try to parse with + prefix
        const parsed = parsePhoneNumber(value.startsWith('+') ? value : `+${value}`);
        if (parsed) {
          setCountryCode(parsed.country || 'HK');
          setPhoneNumber(parsed.nationalNumber);
        } else {
          // If parsing fails, assume it's just the number
          setPhoneNumber(value.replace(/^\+/, ''));
        }
      } catch (e) {
        // If parsing fails, just use the value as is
        setPhoneNumber(value.replace(/^\+/, ''));
      }
    }
  }, []);

  // Validate phone number for the selected country
  const validatePhoneNumber = (country: CountryCode, number: string) => {
    if (!number) return true; // Allow empty
    
    try {
      const callingCode = getCountryCallingCode(country);
      const fullNumber = `+${callingCode}${number}`;
      const parsed = parsePhoneNumber(fullNumber, country);
      return parsed ? parsed.isValid() : false;
    } catch (e) {
      return false;
    }
  };

  // Handle country code change
  const handleCountryChange = (newCountry: CountryCode) => {
    setCountryCode(newCountry);
    const callingCode = getCountryCallingCode(newCountry);
    const fullNumber = phoneNumber ? `${callingCode}${phoneNumber}` : '';
    onChange(fullNumber);
    
    // Validate with new country
    const valid = validatePhoneNumber(newCountry, phoneNumber);
    setIsValid(valid);
  };

  // Handle phone number change
  const handlePhoneChange = (newPhone: string) => {
    // Remove any non-digit characters except spaces and dashes
    const cleaned = newPhone.replace(/[^\d\s-]/g, '');
    setPhoneNumber(cleaned);
    
    const callingCode = getCountryCallingCode(countryCode);
    const fullNumber = cleaned ? `${callingCode}${cleaned.replace(/[\s-]/g, '')}` : '';
    onChange(fullNumber);
    
    // Validate
    const valid = validatePhoneNumber(countryCode, cleaned.replace(/[\s-]/g, ''));
    setIsValid(valid);
  };

  const selectedCountry = COUNTRY_OPTIONS.find(c => c.code === countryCode) || COUNTRY_OPTIONS[0];
  const callingCode = getCountryCallingCode(countryCode);

  return (
    <div className={`space-y-2 ${className}`}>
      {label && <Label>{label}</Label>}
      <div className="flex gap-2">
        {/* Country Code Dropdown */}
        <div className="relative w-40">
          <select
            value={countryCode}
            onChange={(e) => handleCountryChange(e.target.value as CountryCode)}
            className="w-full h-10 px-3 py-2 text-sm rounded-md border border-input bg-background appearance-none cursor-pointer hover:bg-accent/50 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            {COUNTRY_OPTIONS.map((country) => {
              const code = getCountryCallingCode(country.code);
              return (
                <option key={country.code} value={country.code}>
                  {country.flag} +{code}
                </option>
              );
            })}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
        </div>

        {/* Phone Number Input */}
        <div className="flex-1">
          <Input
            type="tel"
            placeholder={placeholder}
            value={phoneNumber}
            onChange={(e) => handlePhoneChange(e.target.value)}
            className={`${!isValid && phoneNumber ? 'border-red-500' : ''}`}
          />
        </div>
      </div>
      
      {!isValid && phoneNumber && (
        <p className="text-sm text-red-500">
          Please enter a valid phone number for {selectedCountry.name}
        </p>
      )}
      
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
      
      <p className="text-xs text-muted-foreground">
        Enter phone number without country code (e.g., {placeholder})
      </p>
    </div>
  );
}

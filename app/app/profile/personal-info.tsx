'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Lock } from 'lucide-react';
import { useTranslation } from '@/contexts/translation-context';
import { parsePhoneNumber } from 'libphonenumber-js';

interface PersonalInfoProps {
  initialPhone?: string | null;
}

export function PersonalInfo({ initialPhone }: PersonalInfoProps) {
  const { t } = useTranslation();
  
  // Format phone number for display
  const formatPhoneNumber = (phone: string | null | undefined) => {
    if (!phone) return t.profile.notSet;
    
    try {
      // Add '+' if not present
      const phoneWithPlus = phone.startsWith('+') ? phone : `+${phone}`;
      const parsed = parsePhoneNumber(phoneWithPlus);
      
      if (parsed) {
        // Format as international format
        return parsed.formatInternational();
      }
    } catch (e) {
      // If parsing fails, just display with '+'
      return phone.startsWith('+') ? phone : `+${phone}`;
    }
    
    return phone.startsWith('+') ? phone : `+${phone}`;
  };

  return (
    <Card className="border border-border hover:border-border/80 hover:shadow-lg transition-all duration-200">
      <CardHeader>
        <div className="flex items-center gap-2">
          <User className="h-5 w-5 text-muted-foreground" />
          <CardTitle>{t.profile.personalInfo}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-medium text-muted-foreground">
              {t.profile.phoneNumber}
            </Label>
            <div className="relative">
              <Input
                id="phone"
                type="text"
                value={formatPhoneNumber(initialPhone)}
                readOnly
                disabled
                className="bg-muted/50 cursor-not-allowed pr-10"
              />
              <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
              <Lock className="h-3 w-3" />
              {t.profile.phoneReadOnly}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

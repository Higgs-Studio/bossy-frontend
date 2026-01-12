'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { User, Phone, Save, Loader2 } from 'lucide-react';
import { useTranslation } from '@/contexts/translation-context';
import { useState, useEffect } from 'react';
import { updatePhoneNumber } from './actions';

interface PersonalInfoProps {
  initialPhone?: string | null;
}

export function PersonalInfo({ initialPhone }: PersonalInfoProps) {
  const { t } = useTranslation();
  const [phone, setPhone] = useState(initialPhone || '');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setHasChanges(phone !== (initialPhone || ''));
  }, [phone, initialPhone]);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage(null);

    try {
      const result = await updatePhoneNumber(phone || null);
      
      if (result.success) {
        setSaveMessage({
          type: 'success',
          text: t.profile?.phoneSaved || 'Phone number saved successfully',
        });
        setHasChanges(false);
        
        // Clear success message after 3 seconds
        setTimeout(() => setSaveMessage(null), 3000);
      } else {
        setSaveMessage({
          type: 'error',
          text: result.error || (t.profile?.phoneSaveError || 'Failed to save phone number'),
        });
      }
    } catch (error) {
      setSaveMessage({
        type: 'error',
        text: t.profile?.phoneSaveError || 'Failed to save phone number',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const validatePhone = (value: string) => {
    // Allow empty string, or validate format
    if (!value) return true;
    // Basic phone validation - allows international formats
    const phoneRegex = /^[\d\s+()-]{10,20}$/;
    return phoneRegex.test(value);
  };

  const isPhoneValid = validatePhone(phone);

  return (
    <Card className="border border-border hover:border-border/80 hover:shadow-lg transition-all duration-200">
      <CardHeader>
        <div className="flex items-center gap-2">
          <User className="h-5 w-5 text-muted-foreground" />
          <CardTitle>{t.profile?.personalInfo || 'Personal Information'}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              {t.profile?.phoneNumber || 'Mobile Phone'}
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder={t.profile?.phonePlaceholder || '+1 (555) 123-4567'}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={`${!isPhoneValid && phone ? 'border-red-500' : ''}`}
            />
            {!isPhoneValid && phone && (
              <p className="text-sm text-red-500">
                {t.profile?.phoneInvalid || 'Please enter a valid phone number'}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              {t.profile?.phoneDescription || 'Optional. Used for account recovery and notifications.'}
            </p>
          </div>

          {hasChanges && (
            <div className="flex items-center gap-2">
              <Button
                onClick={handleSave}
                disabled={isSaving || !isPhoneValid}
                className="w-full sm:w-auto"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t.profile?.saving || 'Saving...'}
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {t.profile?.saveChanges || 'Save Changes'}
                  </>
                )}
              </Button>
            </div>
          )}

          {saveMessage && (
            <div
              className={`p-3 rounded-lg text-sm ${
                saveMessage.type === 'success'
                  ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20'
                  : 'bg-red-500/10 text-red-700 dark:text-red-400 border border-red-500/20'
              }`}
            >
              {saveMessage.text}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

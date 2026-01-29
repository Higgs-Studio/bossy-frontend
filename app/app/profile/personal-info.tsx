'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PhoneInput } from '@/components/ui/phone-input';
import { User, Save, Loader2 } from 'lucide-react';
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

  // Phone validation is handled by PhoneInput component
  const isPhoneValid = true; // Always true as PhoneInput handles validation

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
          <PhoneInput
            value={phone}
            onChange={setPhone}
            label={t.profile?.phoneNumber || 'Mobile Phone'}
            placeholder="9542 7840"
          />

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

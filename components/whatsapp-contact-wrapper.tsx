'use client';

import { WhatsAppContact } from './whatsapp-contact';
import { useEffect, useState } from 'react';
import { getUserPhoneAction } from '@/app/app/profile/actions';

interface WhatsAppContactWrapperProps {
  closable?: boolean;
  userPhone?: string | null;
}

export function WhatsAppContactWrapper({ closable = false, userPhone }: WhatsAppContactWrapperProps) {
  const [phone, setPhone] = useState<string | null>(userPhone || null);
  const [loading, setLoading] = useState(!userPhone);

  useEffect(() => {
    if (!userPhone) {
      getUserPhoneAction().then((result) => {
        setPhone(result);
        setLoading(false);
      });
    }
  }, [userPhone]);

  if (loading) {
    return null; // Don't show anything while loading
  }

  return <WhatsAppContact userPhone={phone} closable={closable} />;
}

'use client';

import { WhatsAppContact } from './whatsapp-contact';
import { useWhatsAppContact } from '@/lib/hooks/use-whatsapp-contact';

interface WhatsAppContactWrapperProps {
  closable?: boolean;
  userPhone?: string | null;
}

export function WhatsAppContactWrapper({ closable = false, userPhone: initialPhone }: WhatsAppContactWrapperProps) {
  const { userPhone, loading } = useWhatsAppContact(initialPhone);

  if (loading) return null;

  return <WhatsAppContact userPhone={userPhone} closable={closable} />;
}

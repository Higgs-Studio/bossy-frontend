import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUserPhoneAction } from '@/app/app/profile/actions';

export const WHATSAPP_NUMBER_CLEAN = '85295427840';
export const WHATSAPP_NUMBER_DISPLAY = '+852 9542 7840';

export function useWhatsAppContact(initialPhone?: string | null) {
  const router = useRouter();
  const [userPhone, setUserPhone] = useState<string | null>(initialPhone ?? null);
  const [loading, setLoading] = useState(initialPhone === undefined);

  useEffect(() => {
    if (initialPhone === undefined) {
      getUserPhoneAction().then((phone) => {
        setUserPhone(phone);
        setLoading(false);
      });
    }
  }, [initialPhone]);

  const openWhatsApp = () => {
    if (userPhone) {
      window.open(`https://wa.me/${WHATSAPP_NUMBER_CLEAN}`, '_blank');
    } else {
      router.push('/app/profile');
    }
  };

  const hasPhone = !!userPhone;

  return { userPhone, loading, hasPhone, openWhatsApp };
}

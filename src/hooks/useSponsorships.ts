import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Sponsorship {
  id?: string;
  camp_id: string;
  sponsor_name: string;
  amount: number;
  sponsor_email?: string;
  sponsor_phone?: string;
  message?: string;
}

export const useSponsorships = () => {
  const [loading, setLoading] = useState(false);

  const createSponsorship = async (sponsorshipData: Omit<Sponsorship, 'id'>) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('sponsorships')
        .insert([sponsorshipData])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to create sponsorship');
    } finally {
      setLoading(false);
    }
  };

  return {
    createSponsorship,
    loading
  };
};
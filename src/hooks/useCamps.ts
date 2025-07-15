import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Camp {
  id: string;
  title: string;
  description: string;
  date: string;
  time?: string;
  location: string;
  doctor_name: string;
  contact_email?: string;
  contact_phone?: string;
  sponsorship_goal: number;
  current_sponsorship: number;
  status: 'pending' | 'approved' | 'active' | 'completed' | 'cancelled';
  created_at?: string;
}

export const useCamps = () => {
  const [camps, setCamps] = useState<Camp[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCamps = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('camps')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCamps((data || []) as Camp[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const createCamp = async (campData: Omit<Camp, 'id' | 'current_sponsorship' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('camps')
        .insert([{
          ...campData,
          created_by: (await supabase.auth.getUser()).data.user?.id
        }])
        .select()
        .single();

      if (error) throw error;
      await fetchCamps(); // Refresh the list
      return data;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to create camp');
    }
  };

  useEffect(() => {
    fetchCamps();
  }, []);

  return {
    camps,
    loading,
    error,
    refetch: fetchCamps,
    createCamp
  };
};
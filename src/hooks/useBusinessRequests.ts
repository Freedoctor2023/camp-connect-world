import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface BusinessRequest {
  id?: string;
  business_name: string;
  camp_type: string;
  preferred_date?: string;
  contact_email: string;
  contact_phone?: string;
  address?: string;
  notes?: string;
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
  created_at?: string;
}

export const useBusinessRequests = () => {
  const [requests, setRequests] = useState<BusinessRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('business_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests((data || []) as BusinessRequest[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const createRequest = async (requestData: Omit<BusinessRequest, 'id' | 'status' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('business_requests')
        .insert([requestData])
        .select()
        .single();

      if (error) throw error;
      await fetchRequests(); // Refresh the list
      return data;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to create business request');
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return {
    requests,
    loading,
    error,
    refetch: fetchRequests,
    createRequest
  };
};
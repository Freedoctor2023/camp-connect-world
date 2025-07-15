-- Add new fields to camps table for enhanced functionality
ALTER TABLE public.camps 
ADD COLUMN camp_type TEXT NOT NULL DEFAULT 'free' CHECK (camp_type IN ('free', 'paid')),
ADD COLUMN requires_sponsorship BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN fee_amount NUMERIC DEFAULT 0;
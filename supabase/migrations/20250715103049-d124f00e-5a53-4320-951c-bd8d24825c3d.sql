-- Fix security warnings by setting search_path for functions

-- Update the update_updated_at_column function with secure search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Update the update_camp_sponsorship function with secure search_path
CREATE OR REPLACE FUNCTION public.update_camp_sponsorship()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  UPDATE public.camps 
  SET current_sponsorship = (
    SELECT COALESCE(SUM(amount), 0) 
    FROM public.sponsorships 
    WHERE camp_id = NEW.camp_id
  )
  WHERE id = NEW.camp_id;
  RETURN NEW;
END;
$$;
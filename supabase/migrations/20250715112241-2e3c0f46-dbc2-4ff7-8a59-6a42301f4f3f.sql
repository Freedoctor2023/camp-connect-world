-- Update business_requests to track who created them
ALTER TABLE public.business_requests 
ADD COLUMN created_by UUID REFERENCES auth.users(id);

-- Update RLS policies to require authentication for creation
DROP POLICY IF EXISTS "Authenticated users can create camps" ON public.camps;
CREATE POLICY "Authenticated users can create camps" 
ON public.camps 
FOR INSERT 
WITH CHECK (auth.uid() = created_by AND auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Anyone can create business requests" ON public.business_requests;
CREATE POLICY "Authenticated users can create business requests" 
ON public.business_requests 
FOR INSERT 
WITH CHECK (auth.uid() = created_by AND auth.uid() IS NOT NULL);
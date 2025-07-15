-- Create user roles system for admin approval
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Create RLS policies for user_roles
CREATE POLICY "Users can view their own roles" 
ON public.user_roles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles" 
ON public.user_roles 
FOR ALL 
USING (public.has_role(auth.uid(), 'admin'));

-- Update camps RLS policies for admin approval
DROP POLICY IF EXISTS "Anyone can view approved camps" ON public.camps;
CREATE POLICY "Anyone can view approved camps" 
ON public.camps 
FOR SELECT 
USING (status IN ('approved', 'active', 'completed') OR auth.uid() = created_by OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage all camps" 
ON public.camps 
FOR UPDATE 
USING (public.has_role(auth.uid(), 'admin'));

-- Update business_requests RLS policies for admin approval  
DROP POLICY IF EXISTS "Anyone can view business requests" ON public.business_requests;
CREATE POLICY "Anyone can view their own business requests" 
ON public.business_requests 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage all business requests" 
ON public.business_requests 
FOR UPDATE 
USING (public.has_role(auth.uid(), 'admin'));
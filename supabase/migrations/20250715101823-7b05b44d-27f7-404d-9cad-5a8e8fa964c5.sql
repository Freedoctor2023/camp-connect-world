-- Create camps table for medical camp information
CREATE TABLE public.camps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  time TIME,
  location TEXT NOT NULL,
  doctor_name TEXT NOT NULL,
  contact_email TEXT,
  contact_phone TEXT,
  sponsorship_goal DECIMAL(10,2) NOT NULL DEFAULT 0,
  current_sponsorship DECIMAL(10,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'active', 'completed', 'cancelled')),
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create sponsorships table for camp funding
CREATE TABLE public.sponsorships (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  camp_id UUID NOT NULL REFERENCES public.camps(id) ON DELETE CASCADE,
  sponsor_name TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  sponsor_email TEXT,
  sponsor_phone TEXT,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create business_requests table for corporate camp requests
CREATE TABLE public.business_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_name TEXT NOT NULL,
  camp_type TEXT NOT NULL,
  preferred_date DATE,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  address TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create proposals table for responding to business requests
CREATE TABLE public.proposals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_request_id UUID NOT NULL REFERENCES public.business_requests(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  estimated_cost DECIMAL(10,2),
  duration_days INTEGER,
  proposed_date DATE,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'accepted', 'rejected')),
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create profiles table for user management
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin', 'moderator')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.camps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sponsorships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for camps
CREATE POLICY "Anyone can view approved camps" 
ON public.camps 
FOR SELECT 
USING (status = 'approved' OR status = 'active' OR status = 'completed');

CREATE POLICY "Authenticated users can create camps" 
ON public.camps 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own camps" 
ON public.camps 
FOR UPDATE 
TO authenticated
USING (auth.uid() = created_by);

-- RLS Policies for sponsorships
CREATE POLICY "Anyone can view sponsorships" 
ON public.sponsorships 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create sponsorships" 
ON public.sponsorships 
FOR INSERT 
WITH CHECK (true);

-- RLS Policies for business_requests
CREATE POLICY "Anyone can create business requests" 
ON public.business_requests 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can view business requests" 
ON public.business_requests 
FOR SELECT 
USING (true);

-- RLS Policies for proposals
CREATE POLICY "Anyone can view proposals" 
ON public.proposals 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can create proposals" 
ON public.proposals 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own proposals" 
ON public.proposals 
FOR UPDATE 
TO authenticated
USING (auth.uid() = created_by);

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (true);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for automatic timestamp updates
CREATE TRIGGER update_camps_updated_at
  BEFORE UPDATE ON public.camps
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_business_requests_updated_at
  BEFORE UPDATE ON public.business_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_proposals_updated_at
  BEFORE UPDATE ON public.proposals
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'full_name');
  RETURN NEW;
END;
$$;

-- Trigger for automatic profile creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update camp sponsorship total
CREATE OR REPLACE FUNCTION public.update_camp_sponsorship()
RETURNS TRIGGER
LANGUAGE plpgsql
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

-- Trigger to update camp sponsorship total when new sponsorship is added
CREATE TRIGGER update_camp_sponsorship_trigger
  AFTER INSERT ON public.sponsorships
  FOR EACH ROW
  EXECUTE FUNCTION public.update_camp_sponsorship();
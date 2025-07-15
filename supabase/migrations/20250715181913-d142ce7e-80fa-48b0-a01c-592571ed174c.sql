-- Create device_tokens table for push notifications
CREATE TABLE public.device_tokens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  token TEXT NOT NULL,
  platform TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, token)
);

-- Enable RLS
ALTER TABLE public.device_tokens ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their own device tokens" 
ON public.device_tokens 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create push notifications log table
CREATE TABLE public.push_notifications_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  data JSONB,
  status TEXT NOT NULL DEFAULT 'pending',
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for push notifications log
ALTER TABLE public.push_notifications_log ENABLE ROW LEVEL SECURITY;

-- Create policies for push notifications log
CREATE POLICY "Users can view their own push notifications" 
ON public.push_notifications_log 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "System can manage push notifications" 
ON public.push_notifications_log 
FOR ALL 
USING (true);

-- Create trigger for updating device_tokens updated_at
CREATE TRIGGER update_device_tokens_updated_at
  BEFORE UPDATE ON public.device_tokens
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
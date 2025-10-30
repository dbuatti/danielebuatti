"use client";

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import DynamicImage from '@/components/DynamicImage';
import { useTheme } from 'next-themes';
import { Loader2 } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { theme } = useTheme();

  const brandSymbolSrc = theme === "dark" ? "/logo-pinkwhite.png" : "/blue-pink-ontrans.png";
  const textLogoSrc = theme === "dark" ? "/logo-white-trans-45.png" : "/logo-dark-blue-transparent-25.png";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const loadingToastId = toast.loading("Attempting to log in...");

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        throw error;
      }

      toast.success("Logged in successfully!", { id: loadingToastId });
      navigate('/admin');
    } catch (error: any) {
      console.error('Login error:', error.message);
      toast.error("Login failed.", {
        id: loadingToastId,
        description: error.message || "Please check your credentials and try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-light dark:bg-brand-dark p-4">
      <Card className="w-full max-w-md bg-brand-light dark:bg-brand-dark-alt shadow-lg border-brand-secondary/50">
        <CardHeader className="text-center">
          <div className="flex flex-col items-center mb-4">
            <DynamicImage
              src={brandSymbolSrc}
              alt="Daniele Buatti Brand Symbol"
              className="h-10 w-auto mb-2"
              width={40}
              height={40}
            />
            <DynamicImage
              src={textLogoSrc}
              alt="Daniele Buatti Logo"
              className="h-14 w-auto"
              width={220}
              height={56}
            />
          </div>
          <CardTitle className="text-3xl font-bold text-brand-primary">Admin Login</CardTitle>
          <CardDescription className="text-brand-dark/70 dark:text-brand-light/70">
            Enter your credentials to authorise access to the admin panel. {/* Changed 'authorize' to 'authorise' */}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-brand-dark dark:text-brand-light">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-brand-background border-brand-border/50 text-brand-dark dark:text-brand-light placeholder:text-brand-dark/60 dark:placeholder:text-brand-light/60"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-brand-dark dark:text-brand-light">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-brand-background border-brand-border/50 text-brand-dark dark:text-brand-light placeholder:text-brand-dark/60 dark:placeholder:text-brand-light/60"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-brand-primary hover:bg-brand-primary/90 text-brand-darker text-lg py-3 rounded-full"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
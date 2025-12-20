"use client";

import React from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';
import { useTheme } from 'next-themes';
import DynamicImage from '@/components/DynamicImage';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const Login: React.FC = () => {
  const { theme } = useTheme();

  const brandSymbolSrc = theme === "dark" ? "/logo-pinkwhite.png" : "/blue-pink-ontrans.png";
  const textLogoSrc = theme === "dark" ? "/logo-white-trans-45.png" : "/logo-dark-blue-transparent-25.png";
  
  // Use window.location.protocol and window.location.host to explicitly construct the origin,
  // ensuring the redirect points to the current environment (e.g., localhost:32127).
  const currentOrigin = window.location.protocol + '//' + window.location.host;
  const redirectUrl = currentOrigin + '/admin';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-brand-light dark:bg-brand-dark text-brand-dark dark:text-brand-light p-4">
      <div className="absolute top-4 left-4">
        <Button asChild variant="ghost" className="text-brand-dark dark:text-brand-light hover:text-brand-primary transition-colors duration-200 px-0 py-0 h-auto">
          <Link to="/">
            <span className="flex items-center text-base md:text-lg font-semibold">
              <ArrowLeft className="h-5 w-5 mr-2" /> <span>Back to Home</span>
            </span>
          </Link>
        </Button>
      </div>
      <div className="flex flex-col items-center mb-8">
        <DynamicImage
          src={brandSymbolSrc}
          alt="Daniele Buatti Brand Symbol"
          className="h-12 w-auto mb-2"
          width={48}
          height={48}
        />
        <DynamicImage
          src={textLogoSrc}
          alt="Daniele Buatti Logo"
          className="h-16 w-auto"
          width={220}
          height={64}
        />
      </div>
      <div className="w-full max-w-md p-8 bg-brand-light dark:bg-brand-dark-alt rounded-lg shadow-xl border border-brand-secondary/50">
        <h2 className="text-3xl font-bold text-center text-brand-primary mb-6">Admin Login</h2>
        <Auth
          supabaseClient={supabase}
          providers={['google']}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: 'hsl(var(--brand-primary))',
                  brandAccent: 'hsl(var(--brand-primary))',
                  inputBackground: 'hsl(var(--background))',
                  inputBorder: 'hsl(var(--border))',
                  inputPlaceholder: 'hsl(var(--muted-foreground))',
                  inputText: 'hsl(var(--foreground))',
                  defaultButtonBackground: 'hsl(var(--brand-primary))',
                  defaultButtonBackgroundHover: 'hsl(var(--brand-primary)/90%)',
                  defaultButtonBorder: 'hsl(var(--brand-primary))',
                  defaultButtonText: 'hsl(var(--brand-light))',
                  dividerBackground: 'hsl(var(--brand-secondary))',
                  anchorTextColor: 'hsl(var(--brand-primary))',
                  anchorTextHoverColor: 'hsl(var(--brand-primary)/90%)',
                },
              },
              dark: {
                colors: {
                  brand: 'hsl(var(--brand-primary))',
                  brandAccent: 'hsl(var(--brand-primary))',
                  inputBackground: 'hsl(var(--brand-dark))',
                  inputBorder: 'hsl(var(--brand-secondary))',
                  inputPlaceholder: 'hsl(var(--muted-foreground))',
                  inputText: 'hsl(var(--brand-light))',
                  defaultButtonBackground: 'hsl(var(--brand-primary))',
                  defaultButtonBackgroundHover: 'hsl(var(--brand-primary)/90%)',
                  defaultButtonBorder: 'hsl(var(--brand-primary))',
                  defaultButtonText: 'hsl(var(--brand-light))',
                  dividerBackground: 'hsl(var(--brand-secondary))',
                  anchorTextColor: 'hsl(var(--brand-primary))',
                  anchorTextHoverColor: 'hsl(var(--brand-primary)/90%)',
                },
              },
            },
          }}
          theme={theme === 'dark' ? 'dark' : 'light'}
          redirectTo={redirectUrl}
        />
      </div>
    </div>
  );
};

export default Login;
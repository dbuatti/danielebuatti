"use client";

import React, { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { CheckCircle2, ArrowRight, Mail, Download } from 'lucide-react';
import { useCart } from '@/components/store/CartProvider';

const StoreSuccessPage: React.FC = () => {
  const { clearCart } = useCart();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    // Clear the cart on successful purchase
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-screen bg-brand-light dark:bg-brand-dark text-brand-dark dark:text-brand-light flex flex-col">
      <Navbar />

      <main className="flex-grow flex items-center justify-center px-4 py-16">
        <div className="max-w-3xl w-full mx-auto text-center bg-white dark:bg-brand-dark-alt p-10 md:p-16 rounded-[2.5rem] shadow-2xl border border-brand-primary/20 space-y-8">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-brand-primary/20 blur-2xl rounded-full animate-pulse" />
            <CheckCircle2 className="h-24 w-24 text-brand-primary mx-auto relative z-10" />
          </div>
          
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-brand-primary leading-tight">
              Your Music is Ready!
            </h2>
            <p className="text-xl text-brand-dark/70 dark:text-brand-light/70 max-w-xl mx-auto">
              Thank you for your purchase. Your professional arrangements have been processed and are on their way to your inbox.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 pt-4">
            <div className="p-6 rounded-2xl bg-brand-secondary/10 dark:bg-brand-dark/50 border border-brand-secondary/20 text-left space-y-3">
              <div className="flex items-center gap-2 text-brand-primary font-bold uppercase tracking-widest text-xs">
                <Mail className="h-4 w-4" /> Check Your Email
              </div>
              <p className="text-sm text-brand-dark/80 dark:text-brand-light/80">
                We've sent a secure download link to your email address. The link will remain active for 7 days.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-brand-secondary/10 dark:bg-brand-dark/50 border border-brand-secondary/20 text-left space-y-3">
              <div className="flex items-center gap-2 text-brand-primary font-bold uppercase tracking-widest text-xs">
                <Download className="h-4 w-4" /> Instant Access
              </div>
              <p className="text-sm text-brand-dark/80 dark:text-brand-light/80">
                If you don't see the email within a few minutes, please check your spam folder or contact support.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <Button asChild size="lg" className="w-full sm:w-auto bg-brand-primary hover:bg-brand-primary/90 text-white rounded-full px-10 py-7 text-lg shadow-lg transition-all hover:scale-105">
              <Link to="/store">Continue Shopping</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto border-brand-secondary rounded-full px-10 py-7 text-lg hover:bg-brand-secondary/10">
              <Link to="/" className="flex items-center gap-2">
                Back to Home <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>

          {sessionId && (
            <p className="text-[10px] text-brand-dark/30 dark:text-brand-light/30 uppercase tracking-widest">
              Order Reference: {sessionId.substring(0, 12)}...
            </p>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default StoreSuccessPage;
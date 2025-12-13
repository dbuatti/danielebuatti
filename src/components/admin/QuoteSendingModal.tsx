import React, { useState, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { showError, showSuccess, showLoading, dismissToast } from '@/utils/toast';
import { Quote, QuoteTheme } from '@/types/quote'; // Fixed: QuoteTheme is now exported
import { ScrollArea } from '@/components/ui/scroll-area';
// ... rest of the component
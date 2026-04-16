import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Loader2, Upload, Wand2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { processPDF } from '@/lib/pdf-utils';
import { toast } from 'sonner';

const arrangementSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  composer: z.string().optional(),
  instrumentation: z.string().optional(),
  difficulty: z.string().optional(),
  key: z.string().optional(),
  genre: z.string().optional(),
  lyrics: z.string().optional(),
  duration: z.string().optional(),
  style: z.string().optional(),
  price: z.string().optional(),
  is_purchasable: z.boolean().default(false),
});

type ArrangementFormValues = z.infer<typeof arrangementSchema>;

interface ArrangementFormProps {
  initialData?: any;
  onSuccess: () => void;
}

export const ArrangementForm: React.FC<ArrangementFormProps> = ({ initialData, onSuccess }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    initialData?.preview_image_path 
      ? supabase.storage.from('arrangement-previews').getPublicUrl(initialData.preview_image_path).data.publicUrl 
      : null
  );

  const form = useForm<ArrangementFormValues>({
    resolver: zodResolver(arrangementSchema),
    defaultValues: initialData ? {
      ...initialData,
      price: initialData.price?.toString() || '0',
    } : {
      title: '',
      composer: '',
      instrumentation: '',
      difficulty: '',
      key: '',
      genre: '',
      lyrics: '',
      duration: '',
      style: '',
      price: '0',
      is_purchasable: false,
    },
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPdfFile(file);
      toast.info('PDF uploaded. Click "Analyze with AI" to extract metadata.');
      
      // Automatically generate preview when file is selected
      try {
        const { previewUrl: generatedPreview } = await processPDF(file);
        setPreviewUrl(generatedPreview);
      } catch (err) {
        console.error('Preview generation error:', err);
      }
    }
  };

  const handleAnalyze = async () => {
    if (!pdfFile) {
      toast.error('Please upload a PDF first');
      return;
    }

    setIsAnalyzing(true);
    try {
      const { text } = await processPDF(pdfFile);

      const { data, error } = await supabase.functions.invoke('analyze-score-pdf', {
        body: { text },
      });

      if (error) throw error;

      // Update form fields with AI results
      Object.keys(data).forEach((key) => {
        if (key in arrangementSchema.shape) {
          form.setValue(key as any, data[key]);
        }
      });
      
      toast.success('Metadata extracted successfully!');
    } catch (error: any) {
      console.error('Analysis error:', error);
      toast.error('Failed to analyze PDF: ' + error.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const onSubmit = async (values: ArrangementFormValues) => {
    setIsSubmitting(true);
    try {
      let pdfPath = initialData?.pdf_file_path;
      let previewPath = initialData?.preview_image_path;

      if (pdfFile) {
        const fileName = `${Date.now()}-${pdfFile.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
        const { data: pdfData, error: pdfError } = await supabase.storage
          .from('arrangements')
          .upload(fileName, pdfFile);
        if (pdfError) throw pdfError;
        pdfPath = pdfData.path;

        if (previewUrl && previewUrl.startsWith('data:')) {
          const response = await fetch(previewUrl);
          const blob = await response.blob();
          const previewFileName = `${Date.now()}-preview.jpg`;
          const { data: previewData, error: previewError } = await supabase.storage
            .from('arrangement-previews')
            .upload(previewFileName, blob);
          if (previewError) throw previewError;
          previewPath = previewData.path;
        }
      }

      const arrangementData = {
        ...values,
        price: parseFloat(values.price || '0'),
        pdf_file_path: pdfPath,
        preview_image_path: previewPath,
        updated_at: new Date().toISOString(),
      };

      if (initialData?.id) {
        const { error } = await supabase
          .from('arrangements')
          .update(arrangementData)
          .eq('id', initialData.id);
        if (error) throw error;
        toast.success('Arrangement updated!');
      } else {
        const { error } = await supabase
          .from('arrangements')
          .insert([arrangementData]);
        if (error) throw error;
        toast.success('Arrangement added!');
      }

      onSuccess();
    } catch (error: any) {
      console.error('Submit error:', error);
      toast.error('Error saving arrangement: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="border-2 border-dashed border-brand-secondary/30 rounded-lg p-6 text-center space-y-4 bg-brand-light/50 dark:bg-brand-dark/50">
              {previewUrl ? (
                <div className="relative group">
                  <img src={previewUrl} alt="Preview" className="max-h-64 mx-auto rounded shadow-md" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded">
                    <p className="text-white text-sm font-medium">Click Change PDF to update</p>
                  </div>
                </div>
              ) : (
                <Upload className="h-12 w-12 mx-auto text-brand-secondary/50" />
              )}
              <div>
                <Input type="file" accept=".pdf" onChange={handleFileChange} className="hidden" id="pdf-upload" />
                <label htmlFor="pdf-upload">
                  <Button type="button" variant="outline" asChild className="cursor-pointer">
                    <span>{pdfFile || initialData ? 'Change PDF' : 'Upload PDF'}</span>
                  </Button>
                </label>
              </div>
              {pdfFile && (
                <Button type="button" onClick={handleAnalyze} disabled={isAnalyzing} className="w-full bg-brand-primary hover:bg-brand-primary/90">
                  {isAnalyzing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                  Analyze with AI
                </Button>
              )}
            </div>

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title *</FormLabel>
                  <FormControl>
                    <Input placeholder="Arrangement Title" {...field} className="bg-white dark:bg-brand-dark" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="composer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Composer</FormLabel>
                  <FormControl>
                    <Input placeholder="Original Composer" {...field} className="bg-white dark:bg-brand-dark" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="instrumentation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instrumentation</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Piano/Vocal" {...field} className="bg-white dark:bg-brand-dark" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="difficulty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Difficulty</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Intermediate" {...field} className="bg-white dark:bg-brand-dark" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="key"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Key</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. C Major" {...field} className="bg-white dark:bg-brand-dark" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="genre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Genre</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Jazz" {...field} className="bg-white dark:bg-brand-dark" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="lyrics"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lyrics Snippet</FormLabel>
                  <FormControl>
                    <Textarea placeholder="First few lines..." {...field} className="bg-white dark:bg-brand-dark min-h-[80px]" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 3:30" {...field} className="bg-white dark:bg-brand-dark" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="style"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Style</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Swing" {...field} className="bg-white dark:bg-brand-dark" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 items-end">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (AUD)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} className="bg-white dark:bg-brand-dark" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="is_purchasable"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm bg-white dark:bg-brand-dark">
                    <div className="space-y-0.5">
                      <FormLabel>Purchasable</FormLabel>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        <Button type="submit" className="w-full bg-brand-primary hover:bg-brand-primary/90 text-white" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData ? 'Update Arrangement' : 'Add Arrangement'}
        </Button>
      </form>
    </Form>
  );
};

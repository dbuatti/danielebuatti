import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Loader2, Upload, Wand2, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { processPDF } from '@/lib/pdf-utils';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

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
  const [isDragging, setIsDragging] = useState(false);
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

  const handleFile = async (file: File) => {
    if (file.type !== 'application/pdf') {
      toast.error('Please upload a PDF file');
      return;
    }
    setPdfFile(file);
    toast.info('PDF uploaded. Click "Analyze with AI" to extract metadata.');
    
    try {
      const { previewUrl: generatedPreview } = await processPDF(file);
      setPreviewUrl(generatedPreview);
    } catch (err) {
      console.error('Preview generation error:', err);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
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
            <div 
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              className={cn(
                "border-2 border-dashed rounded-2xl p-8 text-center space-y-4 transition-all duration-200 min-h-[300px] flex flex-col items-center justify-center",
                isDragging 
                  ? "border-brand-primary bg-brand-primary/5 scale-[1.02]" 
                  : "border-brand-secondary/30 bg-brand-light/50 dark:bg-brand-dark/50",
                pdfFile || initialData ? "border-solid" : ""
              )}
            >
              {previewUrl ? (
                <div className="relative group w-full">
                  <img src={previewUrl} alt="Preview" className="max-h-64 mx-auto rounded-lg shadow-xl border border-brand-secondary/20" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                    <p className="text-white text-sm font-medium">Drop new PDF to replace</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="h-20 w-20 bg-brand-secondary/10 rounded-full flex items-center justify-center mx-auto">
                    <Upload className={cn("h-10 w-10 transition-colors", isDragging ? "text-brand-primary" : "text-brand-secondary/50")} />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-brand-dark dark:text-brand-light">
                      {isDragging ? "Drop it here" : "Drag & drop your PDF"}
                    </p>
                    <p className="text-sm text-brand-dark/60 dark:text-brand-light/60">
                      or click to browse files
                    </p>
                  </div>
                </div>
              )}
              
              <div className="pt-2">
                <Input type="file" accept=".pdf" onChange={handleFileChange} className="hidden" id="pdf-upload" />
                <label htmlFor="pdf-upload">
                  <Button type="button" variant="outline" asChild className="cursor-pointer rounded-full px-6">
                    <span>{pdfFile || initialData ? 'Change PDF' : 'Select PDF'}</span>
                  </Button>
                </label>
              </div>

              {pdfFile && (
                <div className="w-full space-y-3 pt-4">
                  <div className="flex items-center gap-2 justify-center text-sm text-brand-primary font-medium">
                    <FileText className="h-4 w-4" />
                    <span className="truncate max-w-[200px]">{pdfFile.name}</span>
                  </div>
                  <Button 
                    type="button" 
                    onClick={handleAnalyze} 
                    disabled={isAnalyzing} 
                    className="w-full bg-brand-primary hover:bg-brand-primary/90 text-white rounded-full shadow-lg shadow-brand-primary/20"
                  >
                    {isAnalyzing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                    Analyze with AI
                  </Button>
                </div>
              )}
            </div>

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs uppercase tracking-widest font-bold text-brand-dark/60 dark:text-brand-light/60">Title *</FormLabel>
                  <FormControl>
                    <Input placeholder="Arrangement Title" {...field} className="bg-white dark:bg-brand-dark h-12 rounded-xl border-brand-secondary/30" />
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
                  <FormLabel className="text-xs uppercase tracking-widest font-bold text-brand-dark/60 dark:text-brand-light/60">Composer</FormLabel>
                  <FormControl>
                    <Input placeholder="Original Composer" {...field} className="bg-white dark:bg-brand-dark h-12 rounded-xl border-brand-secondary/30" />
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
                    <FormLabel className="text-xs uppercase tracking-widest font-bold text-brand-dark/60 dark:text-brand-light/60">Instrumentation</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Piano/Vocal" {...field} className="bg-white dark:bg-brand-dark h-12 rounded-xl border-brand-secondary/30" />
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
                    <FormLabel className="text-xs uppercase tracking-widest font-bold text-brand-dark/60 dark:text-brand-light/60">Difficulty</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Intermediate" {...field} className="bg-white dark:bg-brand-dark h-12 rounded-xl border-brand-secondary/30" />
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
                    <FormLabel className="text-xs uppercase tracking-widest font-bold text-brand-dark/60 dark:text-brand-light/60">Key</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. C Major" {...field} className="bg-white dark:bg-brand-dark h-12 rounded-xl border-brand-secondary/30" />
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
                    <FormLabel className="text-xs uppercase tracking-widest font-bold text-brand-dark/60 dark:text-brand-light/60">Genre</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Jazz" {...field} className="bg-white dark:bg-brand-dark h-12 rounded-xl border-brand-secondary/30" />
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
                  <FormLabel className="text-xs uppercase tracking-widest font-bold text-brand-dark/60 dark:text-brand-light/60">Lyrics Snippet</FormLabel>
                  <FormControl>
                    <Textarea placeholder="First few lines..." {...field} className="bg-white dark:bg-brand-dark min-h-[100px] rounded-xl border-brand-secondary/30 resize-none" />
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
                    <FormLabel className="text-xs uppercase tracking-widest font-bold text-brand-dark/60 dark:text-brand-light/60">Duration</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 3:30" {...field} className="bg-white dark:bg-brand-dark h-12 rounded-xl border-brand-secondary/30" />
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
                    <FormLabel className="text-xs uppercase tracking-widest font-bold text-brand-dark/60 dark:text-brand-light/60">Style</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Swing" {...field} className="bg-white dark:bg-brand-dark h-12 rounded-xl border-brand-secondary/30" />
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
                    <FormLabel className="text-xs uppercase tracking-widest font-bold text-brand-dark/60 dark:text-brand-light/60">Price (AUD)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} className="bg-white dark:bg-brand-dark h-12 rounded-xl border-brand-secondary/30" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="is_purchasable"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-xl border border-brand-secondary/30 p-3 shadow-sm bg-white dark:bg-brand-dark h-12">
                    <div className="space-y-0.5">
                      <FormLabel className="text-xs font-bold uppercase tracking-widest text-brand-dark/60 dark:text-brand-light/60">Purchasable</FormLabel>
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

        <Button type="submit" className="w-full bg-brand-primary hover:bg-brand-primary/90 text-white h-14 text-lg font-bold rounded-full shadow-xl shadow-brand-primary/20 transition-all hover:scale-[1.01]" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
          {initialData ? 'Update Arrangement' : 'Add Arrangement to Store'}
        </Button>
      </form>
    </Form>
  );
};
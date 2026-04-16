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
  secondary_file_name: z.string().optional(),
});

type ArrangementFormValues = z.infer<typeof arrangementSchema>;

interface ArrangementFormProps {
  initialData?: any;
  onSuccess: () => void;
}

export const ArrangementForm: React.FC<ArrangementFormProps> = ({ initialData, onSuccess }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDraggingMain, setIsDraggingMain] = useState(false);
  const [isDraggingSecondary, setIsDraggingSecondary] = useState(false);
  
  const [mainFile, setMainFile] = useState<File | null>(null);
  const [secondaryFile, setSecondaryFile] = useState<File | null>(null);
  
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
      secondary_file_name: initialData.secondary_file_name || '',
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
      secondary_file_name: '',
    },
  });

  const handleMainFile = async (file: File) => {
    if (file.type !== 'application/pdf') {
      toast.error('Please upload a PDF file for the main score');
      return;
    }
    setMainFile(file);
    toast.info('Main PDF uploaded. Click "Analyze with AI" to extract metadata.');
    
    try {
      const { previewUrl: generatedPreview } = await processPDF(file);
      setPreviewUrl(generatedPreview);
    } catch (err) {
      console.error('Preview generation error:', err);
    }
  };

  const handleSecondaryFile = (file: File) => {
    setSecondaryFile(file);
    if (!form.getValues('secondary_file_name')) {
      form.setValue('secondary_file_name', file.name);
    }
    toast.success('Secondary file attached');
  };

  const handleAnalyze = async () => {
    if (!mainFile) {
      toast.error('Please upload a main PDF first');
      return;
    }

    setIsAnalyzing(true);
    try {
      const { text } = await processPDF(mainFile);

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
      let mainPath = initialData?.pdf_file_path;
      let secondaryPath = initialData?.secondary_file_path;
      let previewPath = initialData?.preview_image_path;

      // Upload Main File
      if (mainFile) {
        const fileName = `${Date.now()}-main-${mainFile.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
        const { data: pdfData, error: pdfError } = await supabase.storage
          .from('arrangements')
          .upload(fileName, mainFile);
        if (pdfError) throw pdfError;
        mainPath = pdfData.path;

        // Upload Preview if generated
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

      // Upload Secondary File
      if (secondaryFile) {
        const fileName = `${Date.now()}-secondary-${secondaryFile.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
        const { data: secData, error: secError } = await supabase.storage
          .from('arrangements')
          .upload(fileName, secondaryFile);
        if (secError) throw secError;
        secondaryPath = secData.path;
      }

      const arrangementData = {
        ...values,
        price: parseFloat(values.price || '0'),
        pdf_file_path: mainPath,
        secondary_file_path: secondaryPath,
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column: Files & Core Info */}
          <div className="space-y-6">
            {/* Main File Upload */}
            <div className="space-y-2">
              <FormLabel className="text-xs uppercase tracking-widest font-bold text-brand-dark/60 dark:text-brand-light/60">Main Score (PDF) *</FormLabel>
              <div 
                onDragOver={(e) => { e.preventDefault(); setIsDraggingMain(true); }}
                onDragLeave={() => setIsDraggingMain(false)}
                onDrop={(e) => { e.preventDefault(); setIsDraggingMain(false); const file = e.dataTransfer.files?.[0]; if (file) handleMainFile(file); }}
                className={cn(
                  "border-2 border-dashed rounded-2xl p-6 text-center space-y-3 transition-all duration-200 min-h-[200px] flex flex-col items-center justify-center",
                  isDraggingMain 
                    ? "border-brand-primary bg-brand-primary/5 scale-[1.02]" 
                    : "border-brand-secondary/30 bg-brand-light/50 dark:bg-brand-dark/50",
                  mainFile || initialData?.pdf_file_path ? "border-solid" : ""
                )}
              >
                {previewUrl ? (
                  <div className="relative group w-full">
                    <img src={previewUrl} alt="Preview" className="max-h-40 mx-auto rounded-lg shadow-md border border-brand-secondary/20" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                      <p className="text-white text-xs font-medium">Drop new PDF to replace</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className={cn("h-8 w-8 mx-auto", isDraggingMain ? "text-brand-primary" : "text-brand-secondary/50")} />
                    <p className="text-sm font-medium">Main Score PDF</p>
                  </div>
                )}
                
                <Input type="file" accept=".pdf" onChange={(e) => { const file = e.target.files?.[0]; if (file) handleMainFile(file); }} className="hidden" id="main-pdf-upload" />
                <label htmlFor="main-pdf-upload">
                  <Button type="button" variant="outline" size="sm" asChild className="cursor-pointer rounded-full">
                    <span>{mainFile || initialData?.pdf_file_path ? 'Change PDF' : 'Select PDF'}</span>
                  </Button>
                </label>

                {mainFile && (
                  <div className="w-full space-y-2 pt-2">
                    <div className="flex items-center gap-2 justify-center text-xs text-brand-primary font-medium">
                      <FileText className="h-3 w-3" />
                      <span className="truncate max-w-[150px]">{mainFile.name}</span>
                    </div>
                    <Button 
                      type="button" 
                      size="sm"
                      onClick={handleAnalyze} 
                      disabled={isAnalyzing} 
                      className="w-full bg-brand-primary hover:bg-brand-primary/90 text-white rounded-full"
                    >
                      {isAnalyzing ? <Loader2 className="h-3 w-3 animate-spin mr-2" /> : <Wand2 className="h-3 w-3 mr-2" />}
                      AI Extract
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Secondary File Upload */}
            <div className="space-y-2">
              <FormLabel className="text-xs uppercase tracking-widest font-bold text-brand-dark/60 dark:text-brand-light/60">Secondary File (Parts, Audio, etc.)</FormLabel>
              <div 
                onDragOver={(e) => { e.preventDefault(); setIsDraggingSecondary(true); }}
                onDragLeave={() => setIsDraggingSecondary(false)}
                onDrop={(e) => { e.preventDefault(); setIsDraggingSecondary(false); const file = e.dataTransfer.files?.[0]; if (file) handleSecondaryFile(file); }}
                className={cn(
                  "border-2 border-dashed rounded-2xl p-6 text-center space-y-3 transition-all duration-200 min-h-[150px] flex flex-col items-center justify-center",
                  isDraggingSecondary 
                    ? "border-brand-primary bg-brand-primary/5 scale-[1.02]" 
                    : "border-brand-secondary/30 bg-brand-light/50 dark:bg-brand-dark/50",
                  secondaryFile || initialData?.secondary_file_path ? "border-solid" : ""
                )}
              >
                {secondaryFile || initialData?.secondary_file_path ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="h-10 w-10 bg-brand-primary/10 rounded-full flex items-center justify-center">
                      <FileText className="h-5 w-5 text-brand-primary" />
                    </div>
                    <p className="text-xs font-medium truncate max-w-[200px]">
                      {secondaryFile ? secondaryFile.name : (initialData?.secondary_file_name || 'Existing File')}
                    </p>
                    <div className="flex gap-2">
                      <Input type="file" onChange={(e) => { const file = e.target.files?.[0]; if (file) handleSecondaryFile(file); }} className="hidden" id="sec-file-upload" />
                      <label htmlFor="sec-file-upload">
                        <Button type="button" variant="outline" size="sm" asChild className="cursor-pointer rounded-full h-7 px-3 text-[10px]">
                          <span>Replace</span>
                        </Button>
                      </label>
                      <Button type="button" variant="ghost" size="sm" onClick={() => { setSecondaryFile(null); form.setValue('secondary_file_name', ''); }} className="h-7 px-3 text-[10px] text-red-500">
                        Remove
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className={cn("h-6 w-6 mx-auto", isDraggingSecondary ? "text-brand-primary" : "text-brand-secondary/50")} />
                    <p className="text-xs font-medium">Drag & Drop Secondary File</p>
                    <Input type="file" onChange={(e) => { const file = e.target.files?.[0]; if (file) handleSecondaryFile(file); }} className="hidden" id="sec-file-upload-init" />
                    <label htmlFor="sec-file-upload-init">
                      <Button type="button" variant="outline" size="sm" asChild className="cursor-pointer rounded-full h-7 px-3 text-[10px]">
                        <span>Select File</span>
                      </Button>
                    </label>
                  </div>
                )}
              </div>
            </div>

            <FormField
              control={form.control}
              name="secondary_file_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs uppercase tracking-widest font-bold text-brand-dark/60 dark:text-brand-light/60">Secondary File Label</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Instrumental Parts, Backing Track" {...field} className="bg-white dark:bg-brand-dark h-10 rounded-xl border-brand-secondary/30" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
          </div>

          {/* Right Column: Metadata */}
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="composer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs uppercase tracking-widest font-bold text-brand-dark/60 dark:text-brand-light/60">Composer</FormLabel>
                  <FormControl>
                    <Input placeholder="Original Composer" {...field} className="bg-white dark:bg-brand-dark h-10 rounded-xl border-brand-secondary/30" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="instrumentation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs uppercase tracking-widest font-bold text-brand-dark/60 dark:text-brand-light/60">Instrumentation</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Piano/Vocal" {...field} className="bg-white dark:bg-brand-dark h-10 rounded-xl border-brand-secondary/30" />
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
                      <Input placeholder="e.g. Intermediate" {...field} className="bg-white dark:bg-brand-dark h-10 rounded-xl border-brand-secondary/30" />
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
                      <Input placeholder="e.g. C Major" {...field} className="bg-white dark:bg-brand-dark h-10 rounded-xl border-brand-secondary/30" />
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
                      <Input placeholder="e.g. Jazz" {...field} className="bg-white dark:bg-brand-dark h-10 rounded-xl border-brand-secondary/30" />
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
                    <Textarea placeholder="First few lines..." {...field} className="bg-white dark:bg-brand-dark min-h-[80px] rounded-xl border-brand-secondary/30 resize-none" />
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
                      <Input placeholder="e.g. 3:30" {...field} className="bg-white dark:bg-brand-dark h-10 rounded-xl border-brand-secondary/30" />
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
                      <Input placeholder="e.g. Swing" {...field} className="bg-white dark:bg-brand-dark h-10 rounded-xl border-brand-secondary/30" />
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
                      <Input type="number" step="0.01" {...field} className="bg-white dark:bg-brand-dark h-10 rounded-xl border-brand-secondary/30" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="is_purchasable"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-xl border border-brand-secondary/30 p-2 shadow-sm bg-white dark:bg-brand-dark h-10">
                    <div className="space-y-0.5">
                      <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-brand-dark/60 dark:text-brand-light/60">Purchasable</FormLabel>
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
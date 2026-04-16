import React, { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Loader2, Wand2, FileText, Image as ImageIcon, X, Layers } from 'lucide-react';
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
  const [isDraggingMaster, setIsDraggingMaster] = useState(false);
  
  const [mainFile, setMainFile] = useState<File | null>(null);
  const [secondaryFile, setSecondaryFile] = useState<File | null>(null);
  const [manualPreviewFile, setManualPreviewFile] = useState<File | null>(null);
  
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

  const handleFiles = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const pdfs = fileArray.filter(f => f.type === 'application/pdf');
    const images = fileArray.filter(f => f.type.startsWith('image/'));

    if (pdfs.length > 0) {
      // Set first PDF as main
      const firstPdf = pdfs[0];
      setMainFile(firstPdf);
      
      // Auto-generate preview from first PDF (unless an image was also dropped)
      if (images.length === 0) {
        try {
          const { previewUrl: generatedPreview } = await processPDF(firstPdf);
          setPreviewUrl(generatedPreview);
        } catch (err) {
          console.error('Preview generation error:', err);
        }
      }

      // Set second PDF as secondary if it exists
      if (pdfs.length > 1) {
        setSecondaryFile(pdfs[1]);
        if (!form.getValues('secondary_file_name')) {
          form.setValue('secondary_file_name', pdfs[1].name);
        }
      }
    }

    if (images.length > 0) {
      const firstImage = images[0];
      setManualPreviewFile(firstImage);
      setPreviewUrl(URL.createObjectURL(firstImage));
    }

    if (pdfs.length > 0 || images.length > 0) {
      toast.success(`Processed ${pdfs.length} PDF(s) and ${images.length} image(s)`);
    }
  }, [form]);

  const handleAnalyze = async () => {
    if (!mainFile) {
      toast.error('Please upload a main PDF first');
      return;
    }

    setIsAnalyzing(true);
    try {
      const { text: mainText } = await processPDF(mainFile);
      let combinedText = `MAIN FILE CONTENT:\n${mainText}`;

      if (secondaryFile && secondaryFile.type === 'application/pdf') {
        const { text: secondaryText } = await processPDF(secondaryFile);
        combinedText += `\n\nSECONDARY FILE CONTENT:\n${secondaryText}`;
      }

      const { data, error } = await supabase.functions.invoke('analyze-score-pdf', {
        body: { text: combinedText },
      });

      if (error) throw error;

      Object.keys(data).forEach((key) => {
        if (key in arrangementSchema.shape && data[key]) {
          form.setValue(key as any, data[key]);
        }
      });
      
      toast.success('Metadata extracted using AI!');
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

      // Upload Main PDF
      if (mainFile) {
        const fileName = `${Date.now()}-main-${mainFile.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
        const { data: pdfData, error: pdfError } = await supabase.storage
          .from('arrangements')
          .upload(fileName, mainFile);
        if (pdfError) throw pdfError;
        mainPath = pdfData.path;
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

      // Upload Preview Image (Manual or Auto-generated)
      if (manualPreviewFile) {
        const fileName = `${Date.now()}-preview-${manualPreviewFile.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
        const { data: imgData, error: imgError } = await supabase.storage
          .from('arrangement-previews')
          .upload(fileName, manualPreviewFile);
        if (imgError) throw imgError;
        previewPath = imgData.path;
      } else if (mainFile && previewUrl && previewUrl.startsWith('data:')) {
        // Only upload auto-generated if we don't have a manual one and we just uploaded a new main PDF
        const response = await fetch(previewUrl);
        const blob = await response.blob();
        const previewFileName = `${Date.now()}-preview-auto.jpg`;
        const { data: previewData, error: previewError } = await supabase.storage
          .from('arrangement-previews')
          .upload(previewFileName, blob);
        if (previewError) throw previewError;
        previewPath = previewData.path;
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        
        {/* Master Drop Zone */}
        <div 
          onDragOver={(e) => { e.preventDefault(); setIsDraggingMaster(true); }}
          onDragLeave={() => setIsDraggingMaster(false)}
          onDrop={(e) => { e.preventDefault(); setIsDraggingMaster(false); handleFiles(e.dataTransfer.files); }}
          className={cn(
            "relative border-2 border-dashed rounded-[2rem] p-10 text-center transition-all duration-300 group",
            isDraggingMaster 
              ? "border-brand-primary bg-brand-primary/5 scale-[1.01] shadow-2xl" 
              : "border-brand-secondary/30 bg-brand-secondary/5 hover:bg-brand-secondary/10",
            (mainFile || secondaryFile || manualPreviewFile) ? "border-brand-primary/40" : ""
          )}
        >
          <div className="space-y-4">
            <div className="w-20 h-20 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-500">
              <Layers className="h-10 w-10 text-brand-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-brand-dark dark:text-brand-light">Master Drop Zone</h3>
              <p className="text-sm text-brand-dark/60 dark:text-brand-light/60 mt-1">
                Drag & drop multiple PDFs and an Image here to auto-populate the form.
              </p>
            </div>
            <div className="flex justify-center gap-4 pt-2">
              <Badge variant="outline" className="bg-white/50 dark:bg-black/50">PDF 1: Main Score</Badge>
              <Badge variant="outline" className="bg-white/50 dark:bg-black/50">PDF 2: Secondary</Badge>
              <Badge variant="outline" className="bg-white/50 dark:bg-black/50">Image: Preview</Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left Column: File Management */}
          <div className="space-y-8">
            
            {/* Main Score PDF */}
            <div className="space-y-3">
              <FormLabel className="text-xs uppercase tracking-[0.2em] font-bold text-brand-primary">1. Main Score (PDF) *</FormLabel>
              <div className={cn(
                "p-4 rounded-2xl border bg-white dark:bg-brand-dark flex items-center justify-between gap-4 shadow-sm",
                mainFile ? "border-brand-primary/30" : "border-brand-secondary/30"
              )}>
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-10 h-10 rounded-lg bg-brand-primary/10 flex items-center justify-center shrink-0">
                    <FileText className="h-5 w-5 text-brand-primary" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-sm font-bold truncate">{mainFile ? mainFile.name : (initialData?.pdf_file_path ? 'Existing Score' : 'No file selected')}</p>
                    {mainFile && <p className="text-[10px] text-brand-dark/40 uppercase tracking-widest">Ready to upload</p>}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Input type="file" accept=".pdf" onChange={(e) => { const file = e.target.files?.[0]; if (file) handleFiles([file]); }} className="hidden" id="main-pdf-input" />
                  <Button type="button" variant="outline" size="sm" asChild className="rounded-full h-8 px-4 cursor-pointer">
                    <label htmlFor="main-pdf-input">Change</label>
                  </Button>
                  {mainFile && (
                    <Button 
                      type="button" 
                      size="sm" 
                      onClick={handleAnalyze} 
                      disabled={isAnalyzing}
                      className="bg-brand-primary hover:bg-brand-primary/90 text-white rounded-full h-8 px-4"
                    >
                      {isAnalyzing ? <Loader2 className="h-3 w-3 animate-spin" /> : <Wand2 className="h-3 w-3 mr-2" />}
                      AI Extract
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Secondary File */}
            <div className="space-y-3">
              <FormLabel className="text-xs uppercase tracking-[0.2em] font-bold text-brand-primary">2. Secondary File (Parts/Audio)</FormLabel>
              <div className={cn(
                "p-4 rounded-2xl border bg-white dark:bg-brand-dark flex items-center justify-between gap-4 shadow-sm",
                secondaryFile ? "border-brand-primary/30" : "border-brand-secondary/30"
              )}>
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-10 h-10 rounded-lg bg-brand-secondary/10 flex items-center justify-center shrink-0">
                    <Layers className="h-5 w-5 text-brand-dark/40" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-sm font-bold truncate">{secondaryFile ? secondaryFile.name : (initialData?.secondary_file_path ? 'Existing Secondary File' : 'Optional')}</p>
                    {secondaryFile && <p className="text-[10px] text-brand-dark/40 uppercase tracking-widest">Ready to upload</p>}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Input type="file" onChange={(e) => { const file = e.target.files?.[0]; if (file) handleFiles([file]); }} className="hidden" id="sec-file-input" />
                  <Button type="button" variant="outline" size="sm" asChild className="rounded-full h-8 px-4 cursor-pointer">
                    <label htmlFor="sec-file-input">{secondaryFile ? 'Change' : 'Select'}</label>
                  </Button>
                  {secondaryFile && (
                    <Button type="button" variant="ghost" size="sm" onClick={() => setSecondaryFile(null)} className="h-8 w-8 p-0 rounded-full text-red-500">
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
              <FormField
                control={form.control}
                name="secondary_file_name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Label (e.g. Instrumental Parts)" {...field} className="bg-white dark:bg-brand-dark h-10 rounded-xl border-brand-secondary/30 text-xs" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Preview Image Area */}
            <div className="space-y-3">
              <FormLabel className="text-xs uppercase tracking-[0.2em] font-bold text-brand-primary">3. Store Preview Image</FormLabel>
              <div 
                onDragOver={(e) => { e.preventDefault(); }}
                onDrop={(e) => { e.preventDefault(); const file = e.dataTransfer.files?.[0]; if (file && file.type.startsWith('image/')) handleFiles([file]); }}
                className={cn(
                  "relative aspect-[3/4] rounded-3xl overflow-hidden border-2 border-dashed transition-all duration-300 group",
                  manualPreviewFile ? "border-brand-primary/50" : "border-brand-secondary/30 bg-brand-secondary/5"
                )}
              >
                {previewUrl ? (
                  <>
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
                      <p className="text-white text-xs font-bold uppercase tracking-widest">Drop new image to replace</p>
                      <div className="flex gap-2">
                        <Input type="file" accept="image/*" onChange={(e) => { const file = e.target.files?.[0]; if (file) handleFiles([file]); }} className="hidden" id="preview-img-input" />
                        <Button type="button" variant="secondary" size="sm" asChild className="rounded-full cursor-pointer">
                          <label htmlFor="preview-img-input">Upload Manually</label>
                        </Button>
                      </div>
                    </div>
                    {manualPreviewFile && (
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-brand-primary text-white">Custom Upload</Badge>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                    <ImageIcon className="h-12 w-12 text-brand-secondary/40" />
                    <div className="text-center">
                      <p className="text-sm font-bold">No Preview Image</p>
                      <p className="text-[10px] text-brand-dark/40 uppercase tracking-widest mt-1">Drop image or auto-generate from PDF</p>
                    </div>
                    <Input type="file" accept="image/*" onChange={(e) => { const file = e.target.files?.[0]; if (file) handleFiles([file]); }} className="hidden" id="preview-img-input-init" />
                    <Button type="button" variant="outline" size="sm" asChild className="rounded-full cursor-pointer">
                      <label htmlFor="preview-img-input-init">Select Image</label>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Metadata Form */}
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs uppercase tracking-widest font-bold text-brand-dark/60 dark:text-brand-light/60">Arrangement Title *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Fly Me To The Moon" {...field} className="bg-white dark:bg-brand-dark h-12 rounded-xl border-brand-secondary/30 font-bold text-lg" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="composer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs uppercase tracking-widest font-bold text-brand-dark/60 dark:text-brand-light/60">Composer / Arranger</FormLabel>
                    <FormControl>
                      <Input placeholder="Bart Howard" {...field} className="bg-white dark:bg-brand-dark h-10 rounded-xl border-brand-secondary/30" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
            </div>

            <div className="grid grid-cols-2 gap-4">
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
            </div>

            <div className="grid grid-cols-2 gap-4">
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

            <div className="grid grid-cols-2 gap-4 items-end">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs uppercase tracking-widest font-bold text-brand-dark/60 dark:text-brand-light/60">Price (AUD)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-dark/40 font-bold">$</span>
                        <Input type="number" step="0.01" {...field} className="bg-white dark:bg-brand-dark h-10 pl-8 rounded-xl border-brand-secondary/30 font-bold" />
                      </div>
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

        <Button type="submit" className="w-full bg-brand-primary hover:bg-brand-primary/90 text-white h-16 text-xl font-bold rounded-full shadow-xl shadow-brand-primary/20 transition-all hover:scale-[1.01]" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-6 w-6 animate-spin" />}
          {initialData ? 'Update Arrangement' : 'Add Arrangement to Store'}
        </Button>
      </form>
    </Form>
  );
};
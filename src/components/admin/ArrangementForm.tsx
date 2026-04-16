import React, { useState, useCallback } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Wand2, FileText, Image as ImageIcon, Layers, Save, CheckCircle, Plus, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { processPDF } from '@/lib/pdf-utils';
import { toast } from 'sonner';
import { cn, createSlug } from '@/lib/utils';

const variantSchema = z.object({
  key: z.string().min(1, 'Key name is required'),
  file_path: z.string().min(1, 'File is required'),
  file_name: z.string().optional(),
});

const arrangementSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'), // NEW
  composer: z.string().optional(),
  instrumentation: z.string().optional(),
  difficulty: z.string().optional(),
  key: z.string().optional(),
  genre: z.string().optional(),
  lyrics: z.string().optional(),
  duration: z.string().optional(),
  style: z.string().optional(),
  description: z.string().optional(),
  price: z.string().optional(),
  additional_key_price: z.string().optional(),
  is_purchasable: z.boolean().default(false),
  status: z.enum(['draft', 'published']).default('published'),
  secondary_file_name: z.string().optional(),
  key_variants: z.array(variantSchema).default([]),
});

type ArrangementFormValues = z.infer<typeof arrangementSchema>;

interface ArrangementFormProps {
  initialData?: any;
  onSuccess: (shouldClose?: boolean, updatedArrangement?: any) => void;
}

export const ArrangementForm: React.FC<ArrangementFormProps> = ({ initialData, onSuccess }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDraggingMaster, setIsDraggingMaster] = useState(false);
  
  const [mainFile, setMainFile] = useState<File | null>(null);
  const [secondaryFile, setSecondaryFile] = useState<File | null>(null);
  const [manualPreviewFile, setManualPreviewFile] = useState<File | null>(null);
  const [variantFiles, setVariantFiles] = useState<Record<number, File>>({});

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
      additional_key_price: initialData.additional_key_price?.toString() || '0',
      secondary_file_name: initialData.secondary_file_name || '',
      status: initialData.status || 'published',
      key_variants: initialData.key_variants || [],
      description: initialData.description || '',
    } : {
      title: '',
      slug: '',
      composer: '',
      instrumentation: '',
      difficulty: '',
      key: '',
      genre: '',
      lyrics: '',
      duration: '',
      style: '',
      description: '',
      price: '0',
      additional_key_price: '0',
      is_purchasable: false,
      status: 'published',
      secondary_file_name: '',
      key_variants: [],
    },
  });

  const { fields: variantFields, append: appendVariant, remove: removeVariant } = useFieldArray({
    control: form.control,
    name: 'key_variants',
  });

  // Auto-generate slug from title and composer
  const watchedTitle = form.watch('title');
  const watchedComposer = form.watch('composer');

  React.useEffect(() => {
    if (watchedTitle && !initialData) {
      const base = watchedComposer ? `${watchedTitle}-${watchedComposer}` : watchedTitle;
      form.setValue('slug', createSlug(base), { shouldValidate: true });
    }
  }, [watchedTitle, watchedComposer, form, initialData]);

  const handleFiles = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const pdfs = fileArray.filter(f => f.type === 'application/pdf');
    const images = fileArray.filter(f => f.type.startsWith('image/'));

    if (pdfs.length > 0) {
      const firstPdf = pdfs[0];
      setMainFile(firstPdf);
      
      if (images.length === 0) {
        try {
          const { previewUrl: generatedPreview } = await processPDF(firstPdf);
          setPreviewUrl(generatedPreview);
        } catch (err) {
          console.error('Preview generation error:', err);
        }
      }

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

  const handleVariantFile = (index: number, file: File) => {
    setVariantFiles(prev => ({ ...prev, [index]: file }));
    form.setValue(`key_variants.${index}.file_name`, file.name);
    form.setValue(`key_variants.${index}.file_path`, 'pending_upload');
  };

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
      
      toast.success('Metadata and description extracted using AI!');
    } catch (error: any) {
      console.error('Analysis error:', error);
      toast.error('Failed to analyze PDF: ' + error.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSave = async (shouldClose: boolean) => {
    const isValid = await form.trigger();
    if (!isValid) return;

    const values = form.getValues();
    setIsSubmitting(true);
    const toastId = toast.loading(shouldClose ? 'Saving arrangement...' : 'Saving progress...');

    try {
      let mainPath = initialData?.pdf_file_path;
      let secondaryPath = initialData?.secondary_file_path;
      let previewPath = initialData?.preview_image_path;

      if (mainFile) {
        const fileName = `${Date.now()}-main-${mainFile.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
        const { data: pdfData, error: pdfError } = await supabase.storage.from('arrangements').upload(fileName, mainFile);
        if (pdfError) throw pdfError;
        mainPath = pdfData.path;
      }

      if (secondaryFile) {
        const fileName = `${Date.now()}-secondary-${secondaryFile.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
        const { data: secData, error: secError } = await supabase.storage.from('arrangements').upload(fileName, secondaryFile);
        if (secError) throw secError;
        secondaryPath = secData.path;
      }

      if (manualPreviewFile) {
        const fileName = `${Date.now()}-preview-${manualPreviewFile.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
        const { data: imgData, error: imgError } = await supabase.storage.from('arrangement-previews').upload(fileName, manualPreviewFile);
        if (imgError) throw imgError;
        previewPath = imgData.path;
      } else if (mainFile && previewUrl && previewUrl.startsWith('data:')) {
        const response = await fetch(previewUrl);
        const blob = await response.blob();
        const previewFileName = `${Date.now()}-preview-auto.jpg`;
        const { data: previewData, error: previewError } = await supabase.storage.from('arrangement-previews').upload(previewFileName, blob);
        if (previewError) throw previewError;
        previewPath = previewData.path;
      }

      const updatedVariants = [...values.key_variants];
      for (let i = 0; i < updatedVariants.length; i++) {
        const file = variantFiles[i];
        if (file) {
          const fileName = `${Date.now()}-variant-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
          const { data: varData, error: varError } = await supabase.storage.from('arrangements').upload(fileName, file);
          if (varError) throw varError;
          updatedVariants[i].file_path = varData.path;
        }
      }

      const arrangementData = {
        ...values,
        price: parseFloat(values.price || '0'),
        additional_key_price: parseFloat(values.additional_key_price || '0'),
        pdf_file_path: mainPath,
        secondary_file_path: secondaryPath,
        preview_image_path: previewPath,
        key_variants: updatedVariants,
        updated_at: new Date().toISOString(),
      };

      let result;
      if (initialData?.id) {
        result = await supabase.from('arrangements').update(arrangementData).eq('id', initialData.id).select().single();
      } else {
        result = await supabase.from('arrangements').insert([arrangementData]).select().single();
      }

      if (result.error) throw result.error;

      toast.success(shouldClose ? 'Arrangement saved!' : 'Progress saved!', { id: toastId });
      onSuccess(shouldClose, result.data);
    } catch (error: any) {
      console.error('Submit error:', error);
      toast.error('Error saving arrangement: ' + error.message, { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
        <div 
          onDragOver={(e) => { e.preventDefault(); setIsDraggingMaster(true); }}
          onDragLeave={() => setIsDraggingMaster(false)}
          onDrop={(e) => { e.preventDefault(); setIsDraggingMaster(false); handleFiles(e.dataTransfer.files); }}
          className={cn(
            "relative border-2 border-dashed rounded-[2rem] p-10 text-center transition-all duration-300 group",
            isDraggingMaster ? "border-brand-primary bg-brand-primary/5 scale-[1.01] shadow-2xl" : "border-brand-secondary/30 bg-brand-secondary/5 hover:bg-brand-secondary/10"
          )}
        >
          <div className="space-y-4">
            <div className="w-20 h-20 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-500">
              <Layers className="h-10 w-10 text-brand-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-brand-dark dark:text-brand-light">Master Drop Zone</h3>
              <p className="text-sm text-brand-dark/60 dark:text-brand-light/60 mt-1">Drag & drop multiple PDFs and an Image here to auto-populate the form.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-8">
            <div className="space-y-3">
              <FormLabel className="text-xs uppercase tracking-[0.2em] font-bold text-brand-primary">1. Main Score (PDF) *</FormLabel>
              <div className="p-4 rounded-2xl border bg-white dark:bg-brand-dark flex items-center justify-between gap-4 shadow-sm border-brand-secondary/30">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-10 h-10 rounded-lg bg-brand-primary/10 flex items-center justify-center shrink-0">
                    <FileText className="h-5 w-5 text-brand-primary" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-sm font-bold truncate">{mainFile ? mainFile.name : (initialData?.pdf_file_path ? 'Existing Score' : 'No file selected')}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Input type="file" accept=".pdf" onChange={(e) => { const file = e.target.files?.[0]; if (file) handleFiles([file]); }} className="hidden" id="main-pdf-input" />
                  <Button type="button" variant="outline" size="sm" asChild className="rounded-full h-8 px-4 cursor-pointer">
                    <label htmlFor="main-pdf-input">Change</label>
                  </Button>
                  {mainFile && (
                    <Button type="button" size="sm" onClick={handleAnalyze} disabled={isAnalyzing} className="bg-brand-primary hover:bg-brand-primary/90 text-white rounded-full h-8 px-4">
                      {isAnalyzing ? <Loader2 className="h-3 w-3 animate-spin" /> : <Wand2 className="h-3 w-3 mr-2" />}
                      AI Extract
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4 p-6 rounded-3xl border border-brand-secondary/30 bg-brand-secondary/5">
              <div className="flex items-center justify-between">
                <FormLabel className="text-xs uppercase tracking-[0.2em] font-bold text-brand-primary">Additional Key Variants</FormLabel>
                <Button type="button" variant="outline" size="sm" onClick={() => appendVariant({ key: '', file_path: '', file_name: '' })} className="rounded-full h-8">
                  <Plus className="h-4 w-4 mr-2" /> Add Key
                </Button>
              </div>
              <div className="space-y-4">
                {variantFields.map((field, index) => (
                  <div key={field.id} className="p-4 bg-white dark:bg-brand-dark rounded-2xl border border-brand-secondary/20 space-y-3 shadow-sm">
                    <div className="flex items-center gap-3">
                      <FormField control={form.control} name={`key_variants.${index}.key`} render={({ field }) => (
                        <FormItem className="flex-grow">
                          <FormControl><Input placeholder="e.g. D Major" {...field} className="h-9 text-sm rounded-xl" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <Button type="button" variant="ghost" size="icon" onClick={() => removeVariant(index)} className="text-red-500 h-9 w-9"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-grow overflow-hidden">
                        <p className="text-[10px] font-bold truncate text-brand-dark/60">{variantFiles[index] ? variantFiles[index].name : (field.file_name || 'No file selected')}</p>
                      </div>
                      <Input type="file" accept=".pdf" onChange={(e) => { const file = e.target.files?.[0]; if (file) handleVariantFile(index, file); }} className="hidden" id={`variant-file-${index}`} />
                      <Button type="button" variant="outline" size="sm" asChild className="rounded-full h-7 px-3 text-[10px] cursor-pointer"><label htmlFor={`variant-file-${index}`}>Select PDF</label></Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <FormLabel className="text-xs uppercase tracking-[0.2em] font-bold text-brand-primary">Store Preview Image</FormLabel>
              <div className="relative aspect-[3/4] rounded-3xl overflow-hidden border-2 border-dashed border-brand-secondary/30 bg-brand-secondary/5">
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                    <ImageIcon className="h-12 w-12 text-brand-secondary/40" />
                    <Input type="file" accept="image/*" onChange={(e) => { const file = e.target.files?.[0]; if (file) handleFiles([file]); }} className="hidden" id="preview-img-input-init" />
                    <Button type="button" variant="outline" size="sm" asChild className="rounded-full cursor-pointer"><label htmlFor="preview-img-input-init">Select Image</label></Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <FormField control={form.control} name="title" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs uppercase tracking-widest font-bold text-brand-dark/60 dark:text-brand-light/60">Arrangement Title *</FormLabel>
                <FormControl><Input placeholder="e.g. Fly Me To The Moon" {...field} className="bg-white dark:bg-brand-dark h-12 rounded-xl border-brand-secondary/30 font-bold text-lg" /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="slug" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs uppercase tracking-widest font-bold text-brand-dark/60 dark:text-brand-light/60">URL Slug (SEO) *</FormLabel>
                <FormControl><Input placeholder="fly-me-to-the-moon" {...field} className="bg-brand-secondary/5 dark:bg-brand-dark h-10 rounded-xl border-brand-secondary/30 text-xs font-mono" /></FormControl>
                <FormDescription className="text-[10px]">This defines the URL: danielebuatti.com/store/arrangements/<strong>slug</strong></FormDescription>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs uppercase tracking-widest font-bold text-brand-dark/60 dark:text-brand-light/60">Store Description</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Describe the arrangement, its style, and performance suitability..." 
                    {...field} 
                    className="bg-white dark:bg-brand-dark min-h-[120px] rounded-xl border-brand-secondary/30 resize-none leading-relaxed" 
                  />
                </FormControl>
                <FormDescription className="text-[10px]">AI will generate this if you use 'AI Extract' on a PDF.</FormDescription>
                <FormMessage />
              </FormItem>
            )} />

            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="composer" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs uppercase tracking-widest font-bold text-brand-dark/60 dark:text-brand-light/60">Composer / Arranger</FormLabel>
                  <FormControl><Input placeholder="Bart Howard" {...field} className="bg-white dark:bg-brand-dark h-10 rounded-xl border-brand-secondary/30" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="instrumentation" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs uppercase tracking-widest font-bold text-brand-dark/60 dark:text-brand-light/60">Instrumentation</FormLabel>
                  <FormControl><Input placeholder="e.g. Piano/Vocal" {...field} className="bg-white dark:bg-brand-dark h-10 rounded-xl border-brand-secondary/30" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="difficulty" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs uppercase tracking-widest font-bold text-brand-dark/60 dark:text-brand-light/60">Difficulty</FormLabel>
                  <FormControl><Input placeholder="e.g. Intermediate" {...field} className="bg-white dark:bg-brand-dark h-10 rounded-xl border-brand-secondary/30" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="key" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs uppercase tracking-widest font-bold text-brand-dark/60 dark:text-brand-light/60">Default Key</FormLabel>
                  <FormControl><Input placeholder="e.g. C Major" {...field} className="bg-white dark:bg-brand-dark h-10 rounded-xl border-brand-secondary/30" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="price" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs uppercase tracking-widest font-bold text-brand-dark/60 dark:text-brand-light/60">Base Price</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-dark/40 font-bold">$</span>
                      <Input type="number" step="0.01" {...field} className="bg-white dark:bg-brand-dark h-10 pl-8 rounded-xl border-brand-secondary/30 font-bold" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="status" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs uppercase tracking-widest font-bold text-brand-dark/60 dark:text-brand-light/60">Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger className="bg-white dark:bg-brand-dark h-10 rounded-xl border-brand-secondary/30"><SelectValue placeholder="Status" /></SelectTrigger></FormControl>
                    <SelectContent><SelectItem value="draft">Draft</SelectItem><SelectItem value="published">Published</SelectItem></SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <FormField control={form.control} name="is_purchasable" render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-xl border border-brand-secondary/30 p-4 shadow-sm bg-white dark:bg-brand-dark">
                <div className="space-y-0.5">
                  <FormLabel className="text-xs font-bold uppercase tracking-widest text-brand-dark/60 dark:text-brand-light/60">Purchasable</FormLabel>
                  <p className="text-[10px] text-muted-foreground">Enable instant digital checkout via Stripe.</p>
                </div>
                <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
              </FormItem>
            )} />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Button type="button" variant="outline" className="flex-1 h-16 text-lg font-bold rounded-full border-brand-secondary/50 hover:bg-brand-secondary/10 transition-all" onClick={() => handleSave(false)} disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Save className="mr-2 h-5 w-5" />}
            Save Progress
          </Button>
          <Button type="button" className="flex-[2] bg-brand-primary hover:bg-brand-primary/90 text-white h-16 text-xl font-bold rounded-full shadow-xl shadow-brand-primary/20 transition-all hover:scale-[1.01]" onClick={() => handleSave(true)} disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="mr-2 h-6 w-6 animate-spin" /> : <CheckCircle className="mr-2 h-6 w-6" />}
            {initialData ? 'Update & Close' : 'Add to Store & Close'}
          </Button>
        </div>
      </form>
    </Form>
  );
};
// ... (lines 375-379)
        <CardContent>
          <QuoteForm 
            form={form}
            onCreateAndSend={handleCreateAndSend}
            isSubmitting={isSubmitting} 
            onPreview={handlePreviewQuote} 
            onSaveDraft={async (values: QuoteFormValues) => { await handleSaveCreateQuote(values, 'Draft'); }} // Fixed TS7006 by adding type annotation
            isQuoteCreated={!!currentQuote} // Pass state to enable 'Send' button logic
          />
        </CardContent>
// ... (lines 386-417)
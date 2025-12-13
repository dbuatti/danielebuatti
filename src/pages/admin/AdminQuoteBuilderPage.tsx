// ... imports

// Removed explicit status type casting (Error 6)
const mapFormValuesToQuote = (values: QuoteFormValues, id?: string, slug?: string, status: Quote['status'] = 'Created'): Quote => {
    const compulsoryTotal = values.compulsoryItems.reduce((sum, item) => sum + (item.price ?? 0), 0);
    const addOnTotal = values.addOns.reduce((sum, item) => sum + (item.price ?? 0) * (item.quantity ?? 0), 0);
    const totalAmount = compulsoryTotal + addOnTotal;

    return {
      id: id || `temp-${Date.now()}`,
      client_name: values.clientName,
      client_email: values.clientEmail,
      invoice_type: values.documentType,
      event_title: values.eventTitle,
      event_date: values.eventDate,
      event_location: values.eventLocation,
      prepared_by: values.preparedBy,
      slug: slug || generateSlug(values.eventTitle, values.clientName, values.eventDate),
      status: status,
      total_amount: totalAmount,
      accepted_at: null, // Fixed: null is now allowed (Error 7, 10)
      rejected_at: null, // Fixed: null is now allowed (Error 8, 11)
      created_at: new Date().toISOString(),
      details: {
        // ... details mapping
      },
    };
};

// ... rest of the component

// Fixed: Argument 'Created' is now valid (Error 9)
const finalQuote = await handleSaveCreateQuote(values, 'Created'); 

// ... rest of the component
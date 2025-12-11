// ... (lines 410-430, after the Dialog component)
          </ScrollArea>
        </DialogContent>
      </Dialog>
      
      {currentQuote && (
        <QuoteSendingModal
          isOpen={isSendingModalOpen}
          onClose={() => setIsSendingModal(false)}
          quote={currentQuote}
          onQuoteSent={handleQuoteSent}
        />
      )}
    </div>
  );
};

export default AdminQuoteBuilderPage;
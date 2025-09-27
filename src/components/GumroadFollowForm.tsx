"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const GumroadFollowForm: React.FC = () => {
  return (
    <form
      action="https://gumroad.com/follow_from_embed_form"
      method="post"
      className="flex flex-col sm:flex-row gap-4 max-w-sm mx-auto mt-6"
    >
      <input type="hidden" name="seller_id" value="4950783041708" />
      <Input
        id="gumroad-follow-form-embed-input"
        type="email"
        placeholder="Your email address"
        name="email"
        className="flex-grow bg-brand-light dark:bg-brand-dark border-brand-secondary text-brand-dark dark:text-brand-light placeholder:text-brand-dark/50 dark:placeholder:text-brand-light/50 focus-visible:ring-brand-primary"
      />
      <Button
        type="submit"
        className="bg-brand-primary hover:bg-brand-primary/90 text-brand-light shadow-md"
      >
        Follow
      </Button>
    </form>
  );
};

export default GumroadFollowForm;
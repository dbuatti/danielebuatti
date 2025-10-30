declare namespace Deno {
  namespace env {
    function get(key: string): string | undefined;
  }
}

// Declare modules for remote imports
declare module "https://deno.land/std@0.190.0/http/server.ts" {
  export function serve(handler: (req: Request) => Response | Promise<Response>): Promise<void>;
}

declare module "https://esm.sh/@supabase/supabase-js@2.45.0" {
  import { SupabaseClient, createClient as originalCreateClient } from '@supabase/supabase-js';
  export { SupabaseClient };
  export const createClient: typeof originalCreateClient;
}
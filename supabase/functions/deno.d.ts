// deno.d.ts
declare namespace Deno {
  namespace env {
    function get(key: string): string | undefined;
  }
}
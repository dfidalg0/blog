/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

declare module 'virtual:creation-times' {
  export const creationTimes: Record<string, Date>;
}

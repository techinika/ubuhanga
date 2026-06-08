/// <reference types="astro/client" />

declare namespace App {
  interface Locals {
    adminUser?: { uid: string; email: string } | null;
  }
}

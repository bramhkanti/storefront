import type { Cart } from '@/lib/api/contracts/domain';

export interface CartActionResult {
  success: boolean;
  cart?: Cart | undefined;
  error?: string | undefined;
}

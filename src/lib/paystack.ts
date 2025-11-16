/**
 * Paystack payment utility
 * Handles Paystack inline popup integration
 */

declare global {
  interface Window {
    PaystackPop: {
      setup: (options: PaystackOptions) => {
        openIframe: () => void;
      };
    };
  }
}

export interface PaystackOptions {
  key: string;
  email: string;
  amount: number; // Amount in kobo (smallest currency unit)
  ref: string; // Unique transaction reference
  metadata?: {
    custom_fields: Array<{
      display_name: string;
      variable_name: string;
      value: string;
    }>;
  };
  callback?: (response: PaystackResponse) => void;
  onClose?: () => void;
}

export interface PaystackResponse {
  message: string;
  reference: string;
  status: string;
  trans: string;
  transaction: string;
  trxref: string;
}

/**
 * Load Paystack script dynamically
 */
export const loadPaystackScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Check if script is already loaded
    if (window.PaystackPop) {
      resolve();
      return;
    }

    // Check if script tag already exists
    const existingScript = document.querySelector('script[src*="paystack"]');
    if (existingScript) {
      // Wait for script to load
      existingScript.addEventListener("load", () => resolve());
      existingScript.addEventListener("error", reject);
      return;
    }

    // Create and append script tag
    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

/**
 * Initialize Paystack payment
 */
export const initializePaystack = async (
  options: PaystackOptions
): Promise<PaystackResponse> => {
  // Load Paystack script if not already loaded
  await loadPaystackScript();

  return new Promise((resolve, reject) => {
    const handler = window.PaystackPop.setup({
      ...options,
      callback: (response: PaystackResponse) => {
        if (options.callback) {
          options.callback(response);
        }
        resolve(response);
      },
      onClose: () => {
        if (options.onClose) {
          options.onClose();
        }
        reject(new Error("Payment cancelled by user"));
      },
    });

    handler.openIframe();
  });
};

/**
 * Generate unique transaction reference
 */
export const generateReference = (): string => {
  return `TXN_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
};

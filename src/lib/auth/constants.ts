/** httpOnly cookie holding the customer's Medusa JWT. Never readable by JS. */
export const CUSTOMER_TOKEN_COOKIE = 'bramhkanti_customer_token';
/** Short-lived cookie between OTP verification and profile completion. */
export const REGISTRATION_TOKEN_COOKIE = 'bramhkanti_registration_token';

export const CUSTOMER_TOKEN_MAX_AGE_SECONDS = 60 * 60 * 24; // matches Medusa's default JWT expiry (1d)
export const REGISTRATION_TOKEN_MAX_AGE_SECONDS = 60 * 15;

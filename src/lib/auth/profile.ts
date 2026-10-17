import type { Address, Customer } from '@/lib/api/contracts/domain';

/**
 * Client-facing shapes for the account UI, derived from the domain Customer.
 * Pure functions: safe on server and client.
 */

export interface SavedAddress {
  id: string;
  tag: 'home' | 'work' | 'other';
  label: string;
  name: string;
  phone: string;
  street: string;
  landmark?: string | undefined;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  /** Display form, e.g. '+91 98765 43210'. */
  phone: string;
  initials: string;
  email?: string | undefined;
  addressSummary?: string | undefined;
  addresses: SavedAddress[];
}

export function formatIndianPhone(e164: string | undefined): string {
  const digits = (e164 ?? '').replace(/\D/g, '').slice(-10);
  return digits.length === 10
    ? `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`
    : (e164 ?? '');
}

/** Splits 'Asha Rani Verma' into first 'Asha Rani' / last 'Verma'. */
export function splitName(fullName: string): { firstName: string; lastName: string } {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length <= 1) return { firstName: parts[0] ?? '', lastName: '' };
  return {
    firstName: parts.slice(0, -1).join(' '),
    lastName: parts[parts.length - 1] ?? '',
  };
}

function tagFromLabel(label: string | undefined): SavedAddress['tag'] {
  const value = (label ?? '').toLowerCase();
  if (value === 'home') return 'home';
  if (value === 'work' || value === 'office') return 'work';
  return 'other';
}

export function toSavedAddress(address: Address): SavedAddress {
  return {
    id: address.id ?? '',
    tag: tagFromLabel(address.label),
    label: address.label || 'Address',
    name: [address.firstName, address.lastName].filter(Boolean).join(' '),
    phone: address.phone,
    street: address.address1,
    landmark: address.address2,
    city: address.city,
    state: address.province,
    pincode: address.postalCode,
    isDefault: Boolean(address.isDefault),
  };
}

export function fromSavedAddress(saved: Omit<SavedAddress, 'id'>): Address {
  const { firstName, lastName } = splitName(saved.name);
  return {
    firstName,
    lastName,
    phone: saved.phone,
    address1: saved.street,
    address2: saved.landmark,
    city: saved.city,
    province: saved.state,
    postalCode: saved.pincode,
    countryCode: 'in',
    label: saved.label,
    isDefault: saved.isDefault,
  };
}

export function summarizeAddress(address: SavedAddress | undefined): string | undefined {
  return address
    ? `${address.street}, ${address.city}, ${address.state} ${address.pincode}`
    : undefined;
}

export function customerToProfile(customer: Customer): UserProfile {
  const name = [customer.firstName, customer.lastName].filter(Boolean).join(' ');
  const addresses = customer.addresses.map(toSavedAddress);
  const initials =
    name
      .split(/\s+/)
      .map((part) => part[0] ?? '')
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'BK';

  return {
    id: customer.id,
    firstName: customer.firstName,
    lastName: customer.lastName,
    name: name || 'Bramhkanti customer',
    phone: formatIndianPhone(customer.phone),
    initials,
    email: customer.email,
    addressSummary: summarizeAddress(addresses.find((a) => a.isDefault) ?? addresses[0]),
    addresses,
  };
}

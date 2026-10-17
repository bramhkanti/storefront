'use client';

import * as React from 'react';
import {
  MapPin,
  Plus,
  Home,
  Briefcase,
  Building,
  Check,
  Edit2,
  Trash2,
  Navigation,
  Loader2,
  ArrowLeft,
  User,
  Phone,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useAuth, useToast, type SavedAddress } from '@/lib/store';

export interface AddressesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddressesModal({
  isOpen,
  onClose,
}: AddressesModalProps): React.JSX.Element {
  const { user, addAddress, updateAddress, deleteAddress, setDefaultAddress } = useAuth();
  const { addToast } = useToast();

  const [view, setView] = React.useState<'list' | 'form'>('list');
  const [editingId, setEditingId] = React.useState<string | null>(null);

  // Form Fields
  const [tag, setTag] = React.useState<'home' | 'work' | 'other'>('home');
  const [name, setName] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [street, setStreet] = React.useState('');
  const [city, setCity] = React.useState('');
  const [state, setState] = React.useState('');
  const [pincode, setPincode] = React.useState('');
  const [isDefault, setIsDefault] = React.useState(false);
  const [isLocating, setIsLocating] = React.useState(false);
  const [formError, setFormError] = React.useState('');
  const [isSaving, setIsSaving] = React.useState(false);
  const [busyId, setBusyId] = React.useState<string | null>(null);

  const addresses = user?.addresses ?? [];

  const resetForm = React.useCallback(() => {
    setTag('home');
    setName(user?.name === 'Bramhkanti customer' ? '' : (user?.name ?? ''));
    setPhone(user?.phone.replace(/\D/g, '').slice(-10) ?? '');
    setStreet('');
    setCity('');
    setState('');
    setPincode('');
    setIsDefault(false);
    setFormError('');
    setEditingId(null);
  }, [user]);

  const handleOpenAdd = () => {
    resetForm();
    setIsDefault(addresses.length === 0);
    setView('form');
  };

  const handleOpenEdit = (addr: SavedAddress) => {
    setEditingId(addr.id);
    setTag(addr.tag);
    setName(addr.name);
    setPhone(addr.phone.replace('+91 ', '').replace('+91', '').trim());
    setStreet(addr.street);
    setCity(addr.city);
    setState(addr.state);
    setPincode(addr.pincode);
    setIsDefault(addr.isDefault);
    setFormError('');
    setView('form');
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !name.trim() ||
      !phone.trim() ||
      !street.trim() ||
      !city.trim() ||
      !pincode.trim()
    ) {
      setFormError('Please fill in all address details');
      return;
    }

    const cleanPincode = pincode.replace(/\D/g, '');
    if (cleanPincode.length !== 6) {
      setFormError('Please enter a valid 6-digit Indian PIN code');
      return;
    }

    const cleanPhoneDigits = phone.replace(/\D/g, '').slice(-10);
    if (cleanPhoneDigits.length !== 10) {
      setFormError('Please enter a valid 10-digit mobile number');
      return;
    }

    const label = tag === 'home' ? 'Home' : tag === 'work' ? 'Work' : 'Other';

    const addressPayload = {
      tag,
      label,
      name: name.trim(),
      phone: `+91 ${cleanPhoneDigits}`,
      street: street.trim(),
      city: city.trim(),
      state: state.trim(),
      pincode: cleanPincode,
      isDefault,
    };

    setIsSaving(true);
    const result = editingId
      ? await updateAddress(editingId, addressPayload)
      : await addAddress(addressPayload);
    setIsSaving(false);
    if (!result.ok) {
      setFormError(result.error);
      return;
    }
    addToast({
      type: 'success',
      message: editingId ? 'Address updated' : 'Address saved',
    });

    setView('list');
    resetForm();
  };

  // Fetch Current Address via Browser GPS Geolocation + Reverse Geocode
  const handleFetchCurrentLocation = () => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      setFormError('Geolocation is not supported by your current browser.');
      return;
    }

    setIsLocating(true);
    setFormError('');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          // Reverse geocode using OpenStreetMap Nominatim API
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
            {
              headers: {
                'Accept-Language': 'en',
              },
            },
          );

          if (response.ok) {
            const data = await response.json();
            const addr = data.address || {};

            const detectedStreet = [
              addr.house_number,
              addr.building,
              addr.road,
              addr.suburb || addr.neighbourhood,
            ]
              .filter(Boolean)
              .join(', ');

            const detectedCity =
              addr.city ||
              addr.town ||
              addr.village ||
              addr.city_district ||
              addr.county ||
              '';
            const detectedState = addr.state || '';
            const detectedPincode = addr.postcode
              ? addr.postcode.replace(/\D/g, '').slice(0, 6)
              : '';

            if (detectedStreet) setStreet(detectedStreet);
            if (detectedCity) setCity(detectedCity);
            if (detectedState) setState(detectedState);
            if (detectedPincode) setPincode(detectedPincode);

            addToast({
              type: 'success',
              message: `Location detected (${detectedCity}, ${detectedState})! Address details pre-filled.`,
            });
          } else {
            // Fallback gracefully
            addToast({
              type: 'info',
              message:
                'Location coordinates captured. Please review and complete your street address.',
            });
          }
        } catch {
          // If network / sandbox is blocked, provide helpful feedback
          addToast({
            type: 'info',
            message:
              'GPS coordinates detected. Please confirm your street address and PIN code.',
          });
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        setIsLocating(false);
        let errorMsg = 'Could not access location.';
        if (error.code === error.PERMISSION_DENIED) {
          errorMsg = 'Location permission was denied. Please enter address manually.';
        } else if (error.code === error.TIMEOUT) {
          errorMsg = 'Location request timed out. Please enter address manually.';
        }
        setFormError(errorMsg);
        addToast({
          type: 'error',
          message: errorMsg,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      },
    );
  };

  const handleDelete = async (id: string, label: string) => {
    setBusyId(id);
    const result = await deleteAddress(id);
    setBusyId(null);
    addToast(
      result.ok
        ? { type: 'info', message: `${label} address removed` }
        : { type: 'error', message: result.error },
    );
  };

  const handleSetDefault = async (id: string, label: string) => {
    setBusyId(id);
    const result = await setDefaultAddress(id);
    setBusyId(null);
    addToast(
      result.ok
        ? { type: 'success', message: `${label} is now your default address` }
        : { type: 'error', message: result.error },
    );
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          setView('list');
          resetForm();
          onClose();
        }
      }}
    >
      <DialogContent className="border-heritage-border bg-heritage-cream max-h-[90vh] max-w-lg overflow-y-auto p-6 sm:p-7 dark:border-neutral-800 dark:bg-[#1c1917]">
        <DialogHeader className="text-left">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="bg-heritage-maroon-light dark:bg-heritage-maroon/20 text-heritage-maroon flex h-9 w-9 shrink-0 items-center justify-center rounded-full">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-heritage-maroon font-serif text-xl font-bold dark:text-red-400">
                  {view === 'form'
                    ? editingId
                      ? 'Edit Delivery Address'
                      : 'Add New Delivery Address'
                    : 'Saved Addresses'}
                </DialogTitle>
                <DialogDescription className="text-heritage-muted text-xs dark:text-neutral-400">
                  {view === 'form'
                    ? 'Enter delivery destination or use GPS location.'
                    : 'Manage saved delivery addresses for swift checkout.'}
                </DialogDescription>
              </div>
            </div>

            {view === 'form' && (
              <button
                type="button"
                onClick={() => {
                  setView('list');
                  resetForm();
                }}
                className="inline-flex items-center gap-1 text-xs font-semibold text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back</span>
              </button>
            )}
          </div>
        </DialogHeader>

        {view === 'list' ? (
          /* =========================================================
             1. SAVED ADDRESSES LIST VIEW
             ========================================================= */
          <div className="mt-4 space-y-3">
            {addresses.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-neutral-300 bg-white px-4 py-8 text-center dark:border-neutral-800 dark:bg-[#201d1a]">
                <MapPin className="mx-auto mb-2 h-8 w-8 text-neutral-300 dark:text-neutral-600" />
                <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                  No saved addresses yet
                </p>
                <p className="mx-auto mt-1 max-w-xs text-xs text-neutral-500 dark:text-neutral-400">
                  Save an address for faster checkout.
                </p>
              </div>
            ) : (
              addresses.map((addr) => {
                const TagIcon =
                  addr.tag === 'home' ? Home : addr.tag === 'work' ? Briefcase : Building;

                return (
                  <div
                    key={addr.id}
                    className={`rounded-2xl border p-4 transition-all ${
                      addr.isDefault
                        ? 'border-heritage-maroon/40 ring-heritage-maroon/20 bg-white ring-1 dark:border-red-500/40 dark:bg-[#25211d]'
                        : 'border-neutral-200/80 bg-white hover:border-neutral-300 dark:border-neutral-800 dark:bg-[#201d1a] dark:hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <TagIcon className="text-heritage-maroon h-4 w-4 shrink-0 dark:text-red-400" />
                        <span className="text-heritage-charcoal text-xs font-bold tracking-wider uppercase dark:text-neutral-200">
                          {addr.label || `${addr.tag} address`}
                        </span>
                      </div>

                      <div className="flex shrink-0 items-center gap-1.5">
                        {addr.isDefault && (
                          <Badge variant="maroon" className="text-[10px]">
                            Default
                          </Badge>
                        )}
                      </div>
                    </div>

                    <p className="text-heritage-charcoal mt-2.5 text-sm font-semibold dark:text-neutral-100">
                      {addr.name}
                    </p>
                    <p className="text-heritage-muted mt-0.5 text-xs leading-relaxed dark:text-neutral-400">
                      {addr.street}, {addr.city}, {addr.state} –{' '}
                      <span className="font-mono font-medium">{addr.pincode}</span>
                    </p>
                    <p className="text-heritage-muted mt-1.5 text-xs dark:text-neutral-400">
                      Contact: <span className="font-mono">{addr.phone}</span>
                    </p>

                    <div className="mt-3.5 flex items-center justify-between border-t border-neutral-100 pt-3 text-xs dark:border-neutral-800">
                      <div>
                        {!addr.isDefault && (
                          <button
                            type="button"
                            onClick={() => handleSetDefault(addr.id, addr.label)}
                            disabled={busyId === addr.id}
                            className="text-heritage-maroon font-semibold hover:underline dark:text-red-400"
                          >
                            Set as Default
                          </button>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(addr)}
                          className="inline-flex items-center gap-1 font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200"
                        >
                          <Edit2 className="h-3 w-3" />
                          <span>Edit</span>
                        </button>

                        {
                          <button
                            type="button"
                            disabled={busyId === addr.id}
                            onClick={() => handleDelete(addr.id, addr.label)}
                            className="inline-flex items-center gap-1 font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                          >
                            <Trash2 className="h-3 w-3" />
                            <span>Delete</span>
                          </button>
                        }
                      </div>
                    </div>
                  </div>
                );
              })
            )}

            <div className="pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleOpenAdd}
                className="border-heritage-maroon/40 text-heritage-maroon hover:bg-heritage-maroon-light w-full gap-2 rounded-2xl border-dashed py-2.5 dark:text-red-400 dark:hover:bg-red-950/30"
              >
                <Plus className="h-4 w-4" />
                <span>Add New Delivery Address</span>
              </Button>
            </div>
          </div>
        ) : (
          /* =========================================================
             2. ADD / EDIT ADDRESS FORM
             ========================================================= */
          <form onSubmit={handleFormSubmit} className="mt-4 space-y-4">
            {/* GPS Fetch Button */}
            <div className="rounded-2xl border border-amber-200/80 bg-gradient-to-r from-amber-50 to-orange-50 p-3.5 dark:border-amber-800/60 dark:from-amber-950/30 dark:to-orange-950/20">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                    Auto-Fill Current Address
                  </p>
                  <p className="mt-0.5 text-[11px] text-neutral-600 dark:text-neutral-400">
                    Fetch your GPS location to instantly populate city, state, &amp; PIN.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={handleFetchCurrentLocation}
                  disabled={isLocating}
                  className="shrink-0 gap-1.5 rounded-xl text-xs shadow-xs"
                >
                  {isLocating ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Detecting...</span>
                    </>
                  ) : (
                    <>
                      <Navigation className="h-3.5 w-3.5" />
                      <span>Use Current Location</span>
                    </>
                  )}
                </Button>
              </div>
            </div>

            {formError && (
              <p className="rounded-xl border border-red-200 bg-red-50 p-2.5 text-xs font-semibold text-red-600 dark:border-red-900/60 dark:bg-red-950/50">
                {formError}
              </p>
            )}

            {/* Address Tag Selector */}
            <div>
              <label className="text-heritage-charcoal mb-1.5 block text-xs font-semibold tracking-wider uppercase dark:text-neutral-200">
                Address Tag
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['home', 'work', 'other'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTag(t)}
                    className={`rounded-xl border px-3 py-2 text-xs font-semibold capitalize transition-all ${
                      tag === t
                        ? 'bg-heritage-maroon border-heritage-maroon text-white shadow-xs'
                        : 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-[#201d1a] dark:text-neutral-300 dark:hover:bg-[#25211d]'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Recipient Name */}
            <div>
              <label
                htmlFor="addr-name"
                className="text-heritage-charcoal block text-xs font-semibold tracking-wider uppercase dark:text-neutral-200"
              >
                Recipient Full Name
              </label>
              <div className="relative mt-1">
                <User className="text-heritage-muted pointer-events-none absolute top-3 left-3 h-4 w-4 dark:text-neutral-400" />
                <input
                  id="addr-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="border-heritage-border text-heritage-charcoal focus:border-heritage-maroon w-full rounded-xl border bg-white py-2.5 pr-3 pl-10 text-sm shadow-xs transition-colors dark:border-neutral-700 dark:bg-[#25211d] dark:text-neutral-100"
                  placeholder="Aditya Sharma"
                />
              </div>
            </div>

            {/* Contact Phone */}
            <div>
              <label
                htmlFor="addr-phone"
                className="text-heritage-charcoal block text-xs font-semibold tracking-wider uppercase dark:text-neutral-200"
              >
                Delivery Contact Phone
              </label>
              <div className="border-heritage-border focus-within:border-heritage-maroon relative mt-1 flex overflow-hidden rounded-xl border bg-white shadow-xs transition-colors dark:border-neutral-700 dark:bg-[#25211d]">
                <span className="text-heritage-muted border-heritage-border inline-flex items-center gap-1.5 border-r bg-neutral-50 px-3 text-xs font-semibold select-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400">
                  <Phone className="h-3.5 w-3.5 text-neutral-400" />
                  <span>+91</span>
                </span>
                <input
                  id="addr-phone"
                  type="tel"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  required
                  className="text-heritage-charcoal block w-full flex-1 border-0 px-3 py-2.5 font-mono text-sm tracking-wider placeholder:text-neutral-400 focus:ring-0 focus:outline-none dark:text-neutral-100 dark:placeholder:text-neutral-500"
                  placeholder="9876543210"
                />
              </div>
            </div>

            {/* Street / Flat / Landmark */}
            <div>
              <label
                htmlFor="addr-street"
                className="text-heritage-charcoal block text-xs font-semibold tracking-wider uppercase dark:text-neutral-200"
              >
                House / Flat / Street / Landmark
              </label>
              <div className="relative mt-1">
                <MapPin className="text-heritage-muted pointer-events-none absolute top-3 left-3 h-4 w-4 dark:text-neutral-400" />
                <input
                  id="addr-street"
                  type="text"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  required
                  className="border-heritage-border text-heritage-charcoal focus:border-heritage-maroon w-full rounded-xl border bg-white py-2.5 pr-3 pl-10 text-sm shadow-xs transition-colors dark:border-neutral-700 dark:bg-[#25211d] dark:text-neutral-100"
                  placeholder="Bramhkanti Heritage Works, Ghat Road"
                />
              </div>
            </div>

            {/* City & State Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="addr-city"
                  className="text-heritage-charcoal block text-xs font-semibold tracking-wider uppercase dark:text-neutral-200"
                >
                  City
                </label>
                <input
                  id="addr-city"
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                  className="border-heritage-border text-heritage-charcoal focus:border-heritage-maroon mt-1 w-full rounded-xl border bg-white px-3 py-2.5 text-sm shadow-xs transition-colors dark:border-neutral-700 dark:bg-[#25211d] dark:text-neutral-100"
                  placeholder="Varanasi"
                />
              </div>

              <div>
                <label
                  htmlFor="addr-state"
                  className="text-heritage-charcoal block text-xs font-semibold tracking-wider uppercase dark:text-neutral-200"
                >
                  State
                </label>
                <input
                  id="addr-state"
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  required
                  className="border-heritage-border text-heritage-charcoal focus:border-heritage-maroon mt-1 w-full rounded-xl border bg-white px-3 py-2.5 text-sm shadow-xs transition-colors dark:border-neutral-700 dark:bg-[#25211d] dark:text-neutral-100"
                  placeholder="Uttar Pradesh"
                />
              </div>
            </div>

            {/* PIN Code */}
            <div>
              <label
                htmlFor="addr-pincode"
                className="text-heritage-charcoal block text-xs font-semibold tracking-wider uppercase dark:text-neutral-200"
              >
                PIN Code
              </label>
              <input
                id="addr-pincode"
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                required
                className="border-heritage-border text-heritage-charcoal focus:border-heritage-maroon mt-1 w-full rounded-xl border bg-white px-3 py-2.5 font-mono text-sm tracking-wider shadow-xs transition-colors dark:border-neutral-700 dark:bg-[#25211d] dark:text-neutral-100"
                placeholder="221001"
              />
            </div>

            {/* Set as Default Checkbox */}
            <div className="pt-1">
              <label className="flex cursor-pointer items-center gap-2.5 text-xs text-neutral-800 dark:text-neutral-200">
                <input
                  type="checkbox"
                  checked={isDefault}
                  onChange={(e) => setIsDefault(e.target.checked)}
                  className="text-heritage-maroon focus:ring-heritage-maroon h-4 w-4 rounded-md border-neutral-300 dark:border-neutral-700"
                />
                <span className="font-medium">
                  Set as default delivery address for all orders
                </span>
              </label>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setView('list');
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                className="gap-1.5"
                isLoading={isSaving}
              >
                <Check className="h-4 w-4" />
                <span>{editingId ? 'Update Address' : 'Save Address'}</span>
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

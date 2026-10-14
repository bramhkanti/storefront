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

export function AddressesModal({ isOpen, onClose }: AddressesModalProps): React.JSX.Element {
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

  const addresses = user?.addresses || [
    {
      id: 'addr_default',
      tag: 'home' as const,
      label: 'Home (Primary Delivery)',
      name: user?.name || 'Aditya Sharma',
      phone: user?.phone || '+91 98765 43210',
      street: 'Bramhkanti Heritage Works, Ghat Road',
      city: 'Varanasi',
      state: 'Uttar Pradesh',
      pincode: '221001',
      isDefault: true,
    },
  ];

  const resetForm = React.useCallback(() => {
    setTag('home');
    setName(user?.name || '');
    setPhone(user?.phone.replace('+91 ', '').replace('+91', '').trim() || '');
    setStreet('');
    setCity('Varanasi');
    setState('Uttar Pradesh');
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

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !street.trim() || !city.trim() || !pincode.trim()) {
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

    const label =
      tag === 'home'
        ? 'Home (Primary Delivery)'
        : tag === 'work'
          ? 'Work / Office'
          : 'Other Delivery Address';

    const addressPayload = {
      tag,
      label,
      name: name.trim(),
      phone: `+91 ${cleanPhoneDigits}`,
      street: street.trim(),
      city: city.trim(),
      state: state.trim() || 'Uttar Pradesh',
      pincode: cleanPincode,
      isDefault,
    };

    if (editingId) {
      updateAddress(editingId, addressPayload);
      addToast({
        type: 'success',
        message: 'Delivery address updated successfully.',
      });
    } else {
      addAddress(addressPayload);
      addToast({
        type: 'success',
        message: 'New delivery address added successfully.',
      });
    }

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
              addr.city || addr.town || addr.village || addr.city_district || addr.county || 'Varanasi';
            const detectedState = addr.state || 'Uttar Pradesh';
            const detectedPincode = addr.postcode ? addr.postcode.replace(/\D/g, '').slice(0, 6) : '';

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
            setCity('Varanasi');
            setState('Uttar Pradesh');
            addToast({
              type: 'info',
              message: 'Location coordinates captured. Please review and complete your street address.',
            });
          }
        } catch {
          // If network / sandbox is blocked, provide helpful feedback
          setCity('Varanasi');
          setState('Uttar Pradesh');
          addToast({
            type: 'info',
            message: 'GPS coordinates detected. Please confirm your street address and PIN code.',
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

  const handleDelete = (id: string, label: string) => {
    deleteAddress(id);
    addToast({
      type: 'info',
      message: `${label} has been removed.`,
    });
  };

  const handleSetDefault = (id: string, label: string) => {
    setDefaultAddress(id);
    addToast({
      type: 'success',
      message: `${label} is now your default delivery address.`,
    });
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
      <DialogContent className="border-heritage-border bg-heritage-cream dark:bg-[#1c1917] dark:border-neutral-800 max-h-[90vh] max-w-lg overflow-y-auto p-6 sm:p-7">
        <DialogHeader className="text-left">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="bg-heritage-maroon-light dark:bg-heritage-maroon/20 text-heritage-maroon flex h-9 w-9 items-center justify-center rounded-full shrink-0">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-heritage-maroon dark:text-red-400 font-serif text-xl font-bold">
                  {view === 'form'
                    ? editingId
                    ? 'Edit Delivery Address'
                    : 'Add New Delivery Address'
                    : 'Saved Addresses'}
                </DialogTitle>
                <DialogDescription className="text-heritage-muted dark:text-neutral-400 text-xs">
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
                className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 inline-flex items-center gap-1"
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
              <div className="text-center py-8 px-4 bg-white dark:bg-[#201d1a] rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-800">
                <MapPin className="h-8 w-8 text-neutral-300 dark:text-neutral-600 mx-auto mb-2" />
                <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">No saved addresses yet</p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-xs mx-auto">
                  Add your delivery address below for swift dispatch and tracking from Varanasi.
                </p>
              </div>
            ) : (
              addresses.map((addr) => {
                const TagIcon =
                  addr.tag === 'home'
                    ? Home
                    : addr.tag === 'work'
                      ? Briefcase
                      : Building;

              return (
                <div
                  key={addr.id}
                  className={`rounded-2xl border p-4 transition-all ${
                    addr.isDefault
                      ? 'border-heritage-maroon/40 dark:border-red-500/40 bg-white dark:bg-[#25211d] ring-1 ring-heritage-maroon/20'
                      : 'border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-[#201d1a] hover:border-neutral-300 dark:hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <TagIcon className="h-4 w-4 text-heritage-maroon dark:text-red-400 shrink-0" />
                      <span className="text-heritage-charcoal dark:text-neutral-200 text-xs font-bold uppercase tracking-wider">
                        {addr.label || `${addr.tag} address`}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {addr.isDefault && (
                        <Badge variant="maroon" className="text-[10px]">
                          Default
                        </Badge>
                      )}
                    </div>
                  </div>

                  <p className="text-heritage-charcoal dark:text-neutral-100 mt-2.5 text-sm font-semibold">
                    {addr.name}
                  </p>
                  <p className="text-heritage-muted dark:text-neutral-400 text-xs leading-relaxed mt-0.5">
                    {addr.street}, {addr.city}, {addr.state} – <span className="font-mono font-medium">{addr.pincode}</span>
                  </p>
                  <p className="text-heritage-muted dark:text-neutral-400 mt-1.5 text-xs">
                    Contact: <span className="font-mono">{addr.phone}</span>
                  </p>

                  <div className="mt-3.5 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs">
                    <div>
                      {!addr.isDefault && (
                        <button
                          type="button"
                          onClick={() => handleSetDefault(addr.id, addr.label)}
                          className="font-semibold text-heritage-maroon dark:text-red-400 hover:underline"
                        >
                          Set as Default
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(addr)}
                        className="inline-flex items-center gap-1 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 font-medium"
                      >
                        <Edit2 className="h-3 w-3" />
                        <span>Edit</span>
                      </button>

                      {addresses.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleDelete(addr.id, addr.label)}
                          className="inline-flex items-center gap-1 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium"
                        >
                          <Trash2 className="h-3 w-3" />
                          <span>Delete</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            }))}

            <div className="pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleOpenAdd}
                className="w-full gap-2 border-dashed border-heritage-maroon/40 text-heritage-maroon dark:text-red-400 hover:bg-heritage-maroon-light dark:hover:bg-red-950/30 py-2.5 rounded-2xl"
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
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/20 border border-amber-200/80 dark:border-amber-800/60 rounded-2xl p-3.5">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                    Auto-Fill Current Address
                  </p>
                  <p className="text-[11px] text-neutral-600 dark:text-neutral-400 mt-0.5">
                    Fetch your GPS location to instantly populate city, state, &amp; PIN.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={handleFetchCurrentLocation}
                  disabled={isLocating}
                  className="shrink-0 gap-1.5 text-xs rounded-xl shadow-xs"
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
              <p className="text-red-600 text-xs font-semibold bg-red-50 dark:bg-red-950/50 p-2.5 rounded-xl border border-red-200 dark:border-red-900/60">
                {formError}
              </p>
            )}

            {/* Address Tag Selector */}
            <div>
              <label className="text-heritage-charcoal dark:text-neutral-200 block text-xs font-semibold tracking-wider uppercase mb-1.5">
                Address Tag
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['home', 'work', 'other'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTag(t)}
                    className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all capitalize ${
                      tag === t
                        ? 'bg-heritage-maroon border-heritage-maroon text-white shadow-xs'
                        : 'bg-white dark:bg-[#201d1a] border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-[#25211d]'
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
                className="text-heritage-charcoal dark:text-neutral-200 block text-xs font-semibold tracking-wider uppercase"
              >
                Recipient Full Name
              </label>
              <div className="relative mt-1">
                <User className="text-heritage-muted dark:text-neutral-400 pointer-events-none absolute top-3 left-3 h-4 w-4" />
                <input
                  id="addr-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="border-heritage-border dark:border-neutral-700 bg-white dark:bg-[#25211d] text-heritage-charcoal dark:text-neutral-100 focus:border-heritage-maroon w-full rounded-xl border py-2.5 pr-3 pl-10 text-sm shadow-xs transition-colors"
                  placeholder="Aditya Sharma"
                />
              </div>
            </div>

            {/* Contact Phone */}
            <div>
              <label
                htmlFor="addr-phone"
                className="text-heritage-charcoal dark:text-neutral-200 block text-xs font-semibold tracking-wider uppercase"
              >
                Delivery Contact Phone
              </label>
              <div className="relative mt-1 flex rounded-xl shadow-xs overflow-hidden border border-heritage-border dark:border-neutral-700 bg-white dark:bg-[#25211d] focus-within:border-heritage-maroon transition-colors">
                <span className="bg-neutral-50 dark:bg-neutral-800 text-heritage-muted dark:text-neutral-400 inline-flex items-center gap-1.5 border-r border-heritage-border dark:border-neutral-700 px-3 text-xs font-semibold select-none">
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
                  className="text-heritage-charcoal dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 block w-full flex-1 border-0 px-3 py-2.5 text-sm font-mono tracking-wider focus:ring-0 focus:outline-none"
                  placeholder="9876543210"
                />
              </div>
            </div>

            {/* Street / Flat / Landmark */}
            <div>
              <label
                htmlFor="addr-street"
                className="text-heritage-charcoal dark:text-neutral-200 block text-xs font-semibold tracking-wider uppercase"
              >
                House / Flat / Street / Landmark
              </label>
              <div className="relative mt-1">
                <MapPin className="text-heritage-muted dark:text-neutral-400 pointer-events-none absolute top-3 left-3 h-4 w-4" />
                <input
                  id="addr-street"
                  type="text"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  required
                  className="border-heritage-border dark:border-neutral-700 bg-white dark:bg-[#25211d] text-heritage-charcoal dark:text-neutral-100 focus:border-heritage-maroon w-full rounded-xl border py-2.5 pr-3 pl-10 text-sm shadow-xs transition-colors"
                  placeholder="Bramhkanti Heritage Works, Ghat Road"
                />
              </div>
            </div>

            {/* City & State Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="addr-city"
                  className="text-heritage-charcoal dark:text-neutral-200 block text-xs font-semibold tracking-wider uppercase"
                >
                  City
                </label>
                <input
                  id="addr-city"
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                  className="border-heritage-border dark:border-neutral-700 bg-white dark:bg-[#25211d] text-heritage-charcoal dark:text-neutral-100 focus:border-heritage-maroon mt-1 w-full rounded-xl border py-2.5 px-3 text-sm shadow-xs transition-colors"
                  placeholder="Varanasi"
                />
              </div>

              <div>
                <label
                  htmlFor="addr-state"
                  className="text-heritage-charcoal dark:text-neutral-200 block text-xs font-semibold tracking-wider uppercase"
                >
                  State
                </label>
                <input
                  id="addr-state"
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  required
                  className="border-heritage-border dark:border-neutral-700 bg-white dark:bg-[#25211d] text-heritage-charcoal dark:text-neutral-100 focus:border-heritage-maroon mt-1 w-full rounded-xl border py-2.5 px-3 text-sm shadow-xs transition-colors"
                  placeholder="Uttar Pradesh"
                />
              </div>
            </div>

            {/* PIN Code */}
            <div>
              <label
                htmlFor="addr-pincode"
                className="text-heritage-charcoal dark:text-neutral-200 block text-xs font-semibold tracking-wider uppercase"
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
                className="border-heritage-border dark:border-neutral-700 bg-white dark:bg-[#25211d] text-heritage-charcoal dark:text-neutral-100 focus:border-heritage-maroon mt-1 w-full rounded-xl border py-2.5 px-3 text-sm font-mono tracking-wider shadow-xs transition-colors"
                placeholder="221001"
              />
            </div>

            {/* Set as Default Checkbox */}
            <div className="pt-1">
              <label className="flex items-center gap-2.5 text-xs text-neutral-800 dark:text-neutral-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isDefault}
                  onChange={(e) => setIsDefault(e.target.checked)}
                  className="h-4 w-4 rounded-md text-heritage-maroon focus:ring-heritage-maroon border-neutral-300 dark:border-neutral-700"
                />
                <span className="font-medium">Set as default delivery address for all orders</span>
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
              <Button type="submit" variant="primary" size="sm" className="gap-1.5">
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

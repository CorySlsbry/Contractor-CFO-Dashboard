'use client';

import { useState, useEffect, useCallback } from 'react';
import { MapPin, Plus, Pencil, Trash2, X, Check, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Location {
  id: string;
  name: string;
  address: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  phone: string | null;
  notes: string | null;
  is_active: boolean;
  created_at: string;
}

interface LocationForm {
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  notes: string;
}

const emptyForm: LocationForm = {
  name: '',
  address: '',
  city: '',
  state: '',
  zip: '',
  phone: '',
  notes: '',
};

export default function LocationsPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<LocationForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchLocations = useCallback(async () => {
    try {
      const res = await fetch('/api/locations');
      const json = await res.json();
      if (json.success) {
        setLocations(json.data);
      } else {
        setError(json.error || 'Failed to load locations');
      }
    } catch {
      setError('Failed to load locations');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
    setError(null);
  };

  const openEdit = (loc: Location) => {
    setEditingId(loc.id);
    setForm({
      name: loc.name,
      address: loc.address ?? '',
      city: loc.city ?? '',
      state: loc.state ?? '',
      zip: loc.zip ?? '',
      phone: loc.phone ?? '',
      notes: loc.notes ?? '',
    });
    setShowForm(true);
    setError(null);
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
    setError(null);
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      setError('Location name is required');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const url = editingId ? `/api/locations/${editingId}` : '/api/locations';
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (json.success) {
        cancelForm();
        await fetchLocations();
      } else {
        setError(json.error || 'Failed to save location');
      }
    } catch {
      setError('Failed to save location');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    setError(null);
    try {
      const res = await fetch(`/api/locations/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        setConfirmDeleteId(null);
        await fetchLocations();
      } else {
        setError(json.error || 'Failed to delete location');
      }
    } catch {
      setError('Failed to delete location');
    } finally {
      setDeletingId(null);
    }
  };

  const formatAddress = (loc: Location) => {
    const parts = [loc.address, loc.city, loc.state, loc.zip].filter(Boolean);
    return parts.join(', ') || null;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-1">Locations</h1>
          <p className="text-[#8888a0]">Manage your business locations and job sites</p>
        </div>
        {!showForm && (
          <Button variant="primary" size="sm" onClick={openCreate} className="flex items-center gap-2">
            <Plus size={16} />
            Add Location
          </Button>
        )}
      </div>

      {error && !showForm && (
        <div className="bg-red-900/20 border border-red-700/50 rounded-lg px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Create / Edit Form */}
      {showForm && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">{editingId ? 'Edit Location' : 'New Location'}</h2>

          {error && (
            <div className="bg-red-900/20 border border-red-700/50 rounded-lg px-4 py-2 text-sm text-red-400 mb-4">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-[#e8e8f0] mb-1">
                Location Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Main Office, Warehouse, Job Site A"
                className="w-full px-3 py-2 rounded-lg bg-[#1a1a26] border border-[#2a2a3d] text-[#e8e8f0] placeholder-[#8888a0] focus:outline-none focus:border-[#6366f1] text-sm"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-[#e8e8f0] mb-1">Street Address</label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="123 Main St"
                className="w-full px-3 py-2 rounded-lg bg-[#1a1a26] border border-[#2a2a3d] text-[#e8e8f0] placeholder-[#8888a0] focus:outline-none focus:border-[#6366f1] text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#e8e8f0] mb-1">City</label>
              <input
                type="text"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                placeholder="City"
                className="w-full px-3 py-2 rounded-lg bg-[#1a1a26] border border-[#2a2a3d] text-[#e8e8f0] placeholder-[#8888a0] focus:outline-none focus:border-[#6366f1] text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-[#e8e8f0] mb-1">State</label>
                <input
                  type="text"
                  value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value })}
                  placeholder="TX"
                  maxLength={2}
                  className="w-full px-3 py-2 rounded-lg bg-[#1a1a26] border border-[#2a2a3d] text-[#e8e8f0] placeholder-[#8888a0] focus:outline-none focus:border-[#6366f1] text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#e8e8f0] mb-1">ZIP</label>
                <input
                  type="text"
                  value={form.zip}
                  onChange={(e) => setForm({ ...form, zip: e.target.value })}
                  placeholder="78701"
                  className="w-full px-3 py-2 rounded-lg bg-[#1a1a26] border border-[#2a2a3d] text-[#e8e8f0] placeholder-[#8888a0] focus:outline-none focus:border-[#6366f1] text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#e8e8f0] mb-1">Phone</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="(512) 555-0100"
                className="w-full px-3 py-2 rounded-lg bg-[#1a1a26] border border-[#2a2a3d] text-[#e8e8f0] placeholder-[#8888a0] focus:outline-none focus:border-[#6366f1] text-sm"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-[#e8e8f0] mb-1">Notes</label>
              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Any additional notes about this location..."
                rows={2}
                className="w-full px-3 py-2 rounded-lg bg-[#1a1a26] border border-[#2a2a3d] text-[#e8e8f0] placeholder-[#8888a0] focus:outline-none focus:border-[#6366f1] text-sm resize-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 mt-5">
            <Button variant="primary" size="sm" onClick={handleSave} disabled={saving} className="flex items-center gap-2">
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
              {saving ? 'Saving...' : editingId ? 'Save Changes' : 'Create Location'}
            </Button>
            <Button variant="secondary" size="sm" onClick={cancelForm} disabled={saving} className="flex items-center gap-2">
              <X size={14} />
              Cancel
            </Button>
          </div>
        </Card>
      )}

      {/* Locations List */}
      {loading ? (
        <div className="flex items-center justify-center py-16 text-[#8888a0]">
          <Loader2 size={24} className="animate-spin mr-3" />
          Loading locations...
        </div>
      ) : locations.length === 0 && !showForm ? (
        <Card className="p-12 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-[#6366f1]/10 flex items-center justify-center mb-4">
            <MapPin size={28} className="text-[#6366f1]" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No locations yet</h3>
          <p className="text-[#8888a0] text-sm max-w-xs mb-5">
            Add your first location to start tracking financials by office, warehouse, or job site.
          </p>
          <Button variant="primary" size="sm" onClick={openCreate} className="flex items-center gap-2">
            <Plus size={16} />
            Add Your First Location
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {locations.map((loc) => {
            const address = formatAddress(loc);
            return (
              <Card key={loc.id} className="p-5 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-[#6366f1]/15 flex items-center justify-center flex-shrink-0">
                      <MapPin size={16} className="text-[#6366f1]" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-[#e8e8f0] truncate">{loc.name}</h3>
                      {address && (
                        <p className="text-xs text-[#8888a0] mt-0.5 truncate">{address}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => openEdit(loc)}
                      className="p-1.5 rounded-lg hover:bg-[#2a2a3d] text-[#8888a0] hover:text-[#e8e8f0] transition-colors"
                      title="Edit location"
                    >
                      <Pencil size={14} />
                    </button>
                    {confirmDeleteId === loc.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleDelete(loc.id)}
                          disabled={deletingId === loc.id}
                          className="p-1.5 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-400 transition-colors"
                          title="Confirm delete"
                        >
                          {deletingId === loc.id
                            ? <Loader2 size={14} className="animate-spin" />
                            : <Check size={14} />}
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(null)}
                          className="p-1.5 rounded-lg hover:bg-[#2a2a3d] text-[#8888a0] transition-colors"
                          title="Cancel"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmDeleteId(loc.id)}
                        className="p-1.5 rounded-lg hover:bg-[#2a2a3d] text-[#8888a0] hover:text-red-400 transition-colors"
                        title="Delete location"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>

                {(loc.phone || loc.notes) && (
                  <div className="space-y-1 text-xs text-[#8888a0] border-t border-[#2a2a3d] pt-3">
                    {loc.phone && (
                      <div className="flex items-center gap-1.5">
                        <span className="text-[#6366f1]">Phone:</span>
                        <span>{loc.phone}</span>
                      </div>
                    )}
                    {loc.notes && (
                      <p className="line-clamp-2">{loc.notes}</p>
                    )}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Customer, CreateCustomer, UpdateCustomer } from '@/shared/types';
import { X } from 'lucide-react';

interface CustomerFormProps {
  customer?: Customer;
  onSubmit: (data: CreateCustomer | UpdateCustomer) => Promise<void>;
  onClose: () => void;
  isOpen: boolean;
}

export default function CustomerForm({ customer, onSubmit, onClose, isOpen }: CustomerFormProps) {
  const [formData, setFormData] = useState({
    station_id: '',
    name: '',
    phone_number: '',
    address: '',
    latitude: '',
    longitude: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (customer) {
      setFormData({
        station_id: customer.station_id || '',
        name: customer.name || '',
        phone_number: customer.phone_number || '',
        address: customer.address || '',
        latitude: customer.latitude?.toString() || '',
        longitude: customer.longitude?.toString() || '',
      });
    } else {
      setFormData({
        station_id: '',
        name: '',
        phone_number: '',
        address: '',
        latitude: '',
        longitude: '',
      });
    }
    setError(null);
  }, [customer, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const submitData = {
        ...formData,
        latitude: formData.latitude ? parseFloat(formData.latitude) : undefined,
        longitude: formData.longitude ? parseFloat(formData.longitude) : undefined,
        ...(customer ? { id: customer.id! } : {}),
      };
      
      await onSubmit(submitData);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {customer ? 'Edit Customer' : 'Add New Customer'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="station_id" className="block text-sm font-medium text-gray-700 mb-1">
              Station ID *
            </label>
            <input
              type="text"
              id="station_id"
              required
              value={formData.station_id}
              onChange={(e) => setFormData(prev => ({ ...prev, station_id: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter station ID"
            />
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Customer Name *
            </label>
            <input
              type="text"
              id="name"
              required
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter customer name"
            />
          </div>

          <div>
            <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone_number"
              value={formData.phone_number}
              onChange={(e) => setFormData(prev => ({ ...prev, phone_number: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter phone number"
            />
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <textarea
              id="address"
              rows={3}
              value={formData.address}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Enter customer address"
            />
          </div>

          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">WhatsApp Location (GPS Coordinates)</h3>
            <p className="text-xs text-gray-500 mb-3">
              If you received location via WhatsApp, paste the coordinates here. Example: -25.7461, -49.3370
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="latitude" className="block text-sm font-medium text-gray-700 mb-1">
                  Latitude
                </label>
                <input
                  type="number"
                  id="latitude"
                  step="any"
                  value={formData.latitude}
                  onChange={(e) => setFormData(prev => ({ ...prev, latitude: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="-25.7461"
                />
              </div>
              <div>
                <label htmlFor="longitude" className="block text-sm font-medium text-gray-700 mb-1">
                  Longitude
                </label>
                <input
                  type="number"
                  id="longitude"
                  step="any"
                  value={formData.longitude}
                  onChange={(e) => setFormData(prev => ({ ...prev, longitude: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="-49.3370"
                />
              </div>
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Saving...' : customer ? 'Update Customer' : 'Add Customer'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

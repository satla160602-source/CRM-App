import { useState } from 'react';
import { Customer } from '@/shared/types';
import { Phone, MapPin, Edit2, Trash2, Navigation, ExternalLink } from 'lucide-react';

interface CustomerCardProps {
  customer: Customer;
  onEdit: (customer: Customer) => void;
  onDelete: (id: number) => void;
}

export default function CustomerCard({ customer, onEdit, onDelete }: CustomerCardProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleGetDirections = (service: 'google' | 'waze') => {
    let destination = '';
    
    // Prefer GPS coordinates if available
    if (customer.latitude && customer.longitude) {
      destination = `${customer.latitude},${customer.longitude}`;
    } else if (customer.address) {
      destination = encodeURIComponent(customer.address);
    } else {
      return; // No location data available
    }
    
    if (service === 'google') {
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${destination}`, '_blank');
    } else {
      window.open(`https://waze.com/ul?q=${destination}&navigate=yes`, '_blank');
    }
  };

  const handleDelete = () => {
    onDelete(customer.id!);
    setShowDeleteConfirm(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{customer.name}</h3>
          <p className="text-sm text-gray-500">Station ID: {customer.station_id}</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(customer)}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {customer.phone_number && (
        <div className="flex items-center text-gray-600 mb-3">
          <Phone className="w-4 h-4 mr-2" />
          <a 
            href={`tel:${customer.phone_number}`}
            className="hover:text-blue-600 transition-colors"
          >
            {customer.phone_number}
          </a>
        </div>
      )}

      {(customer.address || (customer.latitude && customer.longitude)) && (
        <div className="space-y-3">
          <div className="flex items-start text-gray-600">
            <MapPin className="w-4 h-4 mr-2 mt-1 flex-shrink-0" />
            <div className="text-sm">
              {customer.address && <p className="mb-1">{customer.address}</p>}
              {customer.latitude && customer.longitude && (
                <p className="text-xs text-gray-500 font-mono">
                  📍 {customer.latitude.toFixed(6)}, {customer.longitude.toFixed(6)}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => handleGetDirections('google')}
              className="flex items-center px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Navigation className="w-4 h-4 mr-1" />
              Google Maps
              <ExternalLink className="w-3 h-3 ml-1" />
            </button>
            <button
              onClick={() => handleGetDirections('waze')}
              className="flex items-center px-3 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Navigation className="w-4 h-4 mr-1" />
              Waze
              <ExternalLink className="w-3 h-3 ml-1" />
            </button>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Customer</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete {customer.name}? This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={handleDelete}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

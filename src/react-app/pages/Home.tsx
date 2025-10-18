import { useState } from 'react';
import { Plus, Users, Search, Loader2 } from 'lucide-react';
import { useCustomers } from '@/react-app/hooks/useCustomers';
import CustomerCard from '@/react-app/components/CustomerCard';
import CustomerForm from '@/react-app/components/CustomerForm';
import { Customer } from '@/shared/types';

export default function Home() {
  const { customers, loading, error, createCustomer, updateCustomer, deleteCustomer } = useCustomers();
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | undefined>();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.station_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (customer.phone_number && customer.phone_number.includes(searchTerm))
  );

  const handleAddCustomer = () => {
    setEditingCustomer(undefined);
    setShowForm(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingCustomer(undefined);
  };

  const handleSubmitForm = async (data: any) => {
    if (editingCustomer) {
      await updateCustomer(data);
    } else {
      await createCustomer(data);
    }
  };

  const handleDeleteCustomer = async (id: number) => {
    await deleteCustomer(id);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading customers...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
            <p className="font-medium">Error loading customers</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">CustomerLink CRM</h1>
                  <p className="text-sm text-gray-500">Manage your customer relationships</p>
                </div>
              </div>
            </div>
            <button
              onClick={handleAddCustomer}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Customer
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search customers by name, station ID, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {filteredCustomers.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'No customers found' : 'No customers yet'}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm 
                ? 'Try adjusting your search terms'
                : 'Get started by adding your first customer'
              }
            </p>
            {!searchTerm && (
              <button
                onClick={handleAddCustomer}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Your First Customer
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCustomers.map((customer) => (
              <CustomerCard
                key={customer.id}
                customer={customer}
                onEdit={handleEditCustomer}
                onDelete={handleDeleteCustomer}
              />
            ))}
          </div>
        )}
      </main>

      <CustomerForm
        customer={editingCustomer}
        onSubmit={handleSubmitForm}
        onClose={handleCloseForm}
        isOpen={showForm}
      />
    </div>
  );
}

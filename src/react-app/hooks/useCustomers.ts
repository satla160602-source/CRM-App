import { useState, useEffect } from 'react';
import { Customer, CreateCustomer, UpdateCustomer } from '@/shared/types';

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/customers');
      if (!response.ok) {
        throw new Error('Failed to fetch customers');
      }
      const data = await response.json();
      setCustomers(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const createCustomer = async (customerData: CreateCustomer) => {
    try {
      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(customerData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create customer');
      }
      
      const newCustomer = await response.json();
      setCustomers(prev => [...prev, newCustomer]);
      return newCustomer;
    } catch (err) {
      throw err;
    }
  };

  const updateCustomer = async (customerData: UpdateCustomer) => {
    try {
      const response = await fetch(`/api/customers/${customerData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(customerData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update customer');
      }
      
      const updatedCustomer = await response.json();
      setCustomers(prev => prev.map(c => c.id === updatedCustomer.id ? updatedCustomer : c));
      return updatedCustomer;
    } catch (err) {
      throw err;
    }
  };

  const deleteCustomer = async (id: number) => {
    try {
      const response = await fetch(`/api/customers/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete customer');
      }
      
      setCustomers(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return {
    customers,
    loading,
    error,
    fetchCustomers,
    createCustomer,
    updateCustomer,
    deleteCustomer,
  };
}

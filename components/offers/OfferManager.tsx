'use client';

import { useState } from 'react';
import { INITIAL_OFFERS } from '@/constants/offers';
import EditOfferModal from './EditOfferModal';
import useSWR, { mutate } from 'swr';
import { Loader } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import isEqual from "lodash/isEqual"

export default function OfferManager() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [newOffer, setNewOffer] = useState<Offer>({
    id: '',
    code: '',
    description: '',
    discountType: 'percentage',
    discountValue: null,
    startDate: '',
    validUntil: '',
    status: 'inactive',
    usedCount: 0,
    maxUses: 10
  });

  const fetcher = (url: string) => fetch(url).then(res => res.json());
  //fetching offer data from the backend using swr
  const { data: offers = [], isLoading } = useSWR(
    '/api/offers',
    fetcher,
    { revalidateOnFocus: false }
  );

  const handleAddOffer = async () => {
    if (newOffer.code.trim() && newOffer.description.trim() && newOffer.discountValue !== null) {
      const addNewOffer: Offer = {
        id: String(offers.length + 1),
        code: newOffer.code.toUpperCase().replace(/\s+/g, '_'),
        description: newOffer.description,
        discountType: newOffer.discountType,
        discountValue: newOffer.discountValue,
        startDate: new Date().toISOString().split('T')[0],
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: newOffer.status,
        usedCount: newOffer.usedCount,
        maxUses: newOffer.maxUses
      };
      const response = await fetch(
        '/api/offers',
        {
          method: 'POST', headers: { 'Content-type': 'application/json' },
          body: JSON.stringify(addNewOffer)
        }
      )
      if (response.status !== 201) {
        alert('Failed to add offer. Please try again.');
        console.log(response.statusText)
        return;
      }
      mutate('/api/offers');
      setNewOffer({
        id: '',
        code: '',
        description: '',
        discountType: 'percentage',
        discountValue: null,
        startDate: '',
        validUntil: '',
        status: 'inactive',
        usedCount: 0,
        maxUses: 10
      });
      setShowAddModal(false);
    }
  };

  const handleUpdateOffer = async (updatedOffer: Offer) => {
    const updatedOffers = offers.find((offer: Offer) => (offer._id === updatedOffer._id));
    if (!updatedOffers) return;
    if (isEqual(updatedOffers, updatedOffer)) {
      alert('No changes made to the offer.');
      return;
    }
    const response = await fetch(
      `/api/offers/${updatedOffer._id}`,
      {
        method: 'PUT', headers: { 'Content-type': 'application/json' },
        body: JSON.stringify(updatedOffer)
      }
    )
    if (response.status !== 200) {
      alert('Failed to update offer. Please try again.');
      console.log(response.statusText)
      return;
    }
    mutate('/api/offers');
    setEditingOffer(null);
  };

  const handleToggleActive = async (id: string) => {
    let offer = offers.find((offer: Offer) => offer._id === id);
    if (!offer) return;
    offer.status = offer.status === 'active' ? 'inactive' : 'active';
    const response = await fetch(
      `/api/offers/${id}`,
      {
        method: 'PUT', headers: { 'Content-type': 'application/json' },
        body: JSON.stringify(offer)
      }
    )
    if (response.status !== 200) {
      alert('Failed to update offer status. Please try again.');
      console.log(response.statusText)
      return;
    }
    mutate('/api/offers');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Offers & Coupons</h1>
          <p className="text-gray-600 mt-1">Manage promotional offers and coupons</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
        >
          + Add Offer
        </button>
      </div>

      {/* Add Offer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Add New Offer</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Offer Title</label>
                <input
                  type="text"
                  value={newOffer.code.toUpperCase()}
                  onChange={(e) => setNewOffer({ ...newOffer, code: e.target.value })}
                  placeholder="E.g., Summer Sale"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  value={newOffer.description}
                  onChange={(e) => setNewOffer({ ...newOffer, description: e.target.value })}
                  placeholder="Offer description"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type</label>
                  <select
                    value={newOffer.discountType}
                    onChange={(e) => setNewOffer({ ...newOffer, discountType: e.target.value as 'flat' | 'percentage' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    <option value="percentage">Percentage</option>
                    <option value="flat">Flat Amount</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
                  <input
                    type="number"
                    value={newOffer.discountValue || ''}
                    onChange={(e) => setNewOffer({ ...newOffer, discountValue: Number(e.target.value) })}
                    placeholder="E.g., 20"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddOffer}
                  className="flex-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Offers Table */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader className="w-full h-full animate-spin text-primary" />
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Title</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Discount</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Valid Until</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Usage</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Max Usages</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {offers.map((offer: Offer) => (
                  <tr key={offer._id || offer.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{offer.code}</p>
                        <p className="text-xs text-gray-500">{offer.description.length > 20 ? offer.description.substring(0, 20) + '...' : offer.description}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900">
                        {offer.discountType === 'percentage'
                          ? `${offer.discountValue}%`
                          : `₹${offer.discountValue}`}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div>
                        <p className="font-medium text-gray-900">{formatDate(offer.validUntil)}</p>
                        <p className="text-xs text-red-500 font-bold">{formatDate(offer.validUntil) < formatDate('') ? 'Expired' : null}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{offer.usedCount}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{offer.maxUses || 0}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleActive(offer._id || '')}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${offer.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-600'
                          }`}
                      >
                        {offer.status === 'active' ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setEditingOffer(offer)}
                        className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Edit Offer Modal */}
      {editingOffer && (
        <EditOfferModal
          offer={editingOffer}
          onClose={() => setEditingOffer(null)}
          onSave={handleUpdateOffer}
        />
      )}
    </div>
  );
}

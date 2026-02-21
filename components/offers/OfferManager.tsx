'use client';

import { useState } from 'react';
import { INITIAL_OFFERS, Offer } from '@/constants/offers';
import EditOfferModal from './EditOfferModal';

export default function OfferManager() {
  const [offers, setOffers] = useState<Offer[]>(INITIAL_OFFERS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [newOfferTitle, setNewOfferTitle] = useState('');
  const [newOfferDescription, setNewOfferDescription] = useState('');
  const [newDiscountType, setNewDiscountType] = useState<'flat' | 'percentage'>('percentage');
  const [newDiscountValue, setNewDiscountValue] = useState('');

  const handleAddOffer = () => {
    if (newOfferTitle.trim() && newDiscountValue) {
      const newOffer: Offer = {
        id: String(offers.length + 1),
        title: newOfferTitle,
        description: newOfferDescription,
        discountType: newDiscountType,
        discountValue: Number(newDiscountValue),
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        active: true,
        usageCount: 0,
      };
      setOffers([...offers, newOffer]);
      setNewOfferTitle('');
      setNewOfferDescription('');
      setNewDiscountValue('');
      setShowAddModal(false);
    }
  };

  const handleUpdateOffer = (updatedOffer: Offer) => {
    setOffers(offers.map((offer) => (offer.id === updatedOffer.id ? updatedOffer : offer)));
    setEditingOffer(null);
  };

  const handleToggleActive = (id: string) => {
    setOffers(
      offers.map((offer) =>
        offer.id === id ? { ...offer, active: !offer.active } : offer
      )
    );
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
                  value={newOfferTitle}
                  onChange={(e) => setNewOfferTitle(e.target.value)}
                  placeholder="E.g., Summer Sale"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  value={newOfferDescription}
                  onChange={(e) => setNewOfferDescription(e.target.value)}
                  placeholder="Offer description"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type</label>
                  <select
                    value={newDiscountType}
                    onChange={(e) => setNewDiscountType(e.target.value as 'flat' | 'percentage')}
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
                    value={newDiscountValue}
                    onChange={(e) => setNewDiscountValue(e.target.value)}
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
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Title</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Discount</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Valid Until</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Usage</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {offers.map((offer) => (
                <tr key={offer.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{offer.title}</p>
                      <p className="text-xs text-gray-500">{offer.description}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-900">
                      {offer.discountType === 'percentage'
                        ? `${offer.discountValue}%`
                        : `₹${offer.discountValue}`}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{offer.endDate}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{offer.usageCount}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleToggleActive(offer.id)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        offer.active
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {offer.active ? 'Active' : 'Inactive'}
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

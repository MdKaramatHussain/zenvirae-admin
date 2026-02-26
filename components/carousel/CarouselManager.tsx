'use client';

import { useEffect, useState } from 'react';
import { Loader } from 'lucide-react';
import { DeleteAlert } from '../common/deleteAlter';

export default function CarouselManager() {
  const [carouselImages, setCarouselImages] = useState<CarouselImage[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true)
  const [newCarouselImage, setNewCarouselImage] = useState<CarouselImage>({
    id: "",
    title: "",
    image: '🎯',
    active: false,
    createdAt: "",
    order: 0,
  });

  const handleAddImage = async () => {
    try {
      if (newCarouselImage.title.trim()) {
        const newImage: CarouselImage = {
          id: String(carouselImages.length + 1),
          title: newCarouselImage.title,
          image: newCarouselImage.image,
          active: newCarouselImage.active,
          createdAt: new Date().toISOString().split('T')[0],
          order: carouselImages.length + 1,
        };
        setNewCarouselImage({
          id: "",
          title: "",
          image: '🎯',
          active: false,
          createdAt: "",
          order: carouselImages.length + 1,
        })
        const response = await fetch('/api/carousel', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newImage),
        })
        const statusCode = response.status
        if (statusCode === 201) {
          setCarouselImages([...carouselImages, newImage]);
        }
        else {
          console.log("Failed to add carousel :(")
        }
      }
    } catch (error) {
      console.log('Error adding carousel image:', error)
    } finally {
      setShowAddModal(false);
    }
  };

  const handleToggleActive = async (id: string | undefined) => {
    let updatecarousel = carouselImages.find((img) => img._id === id)
    if (updatecarousel) {
      updatecarousel = { ...updatecarousel, active: !updatecarousel.active }
    }
    try {
      const response = await fetch('/api/carousel', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatecarousel),
      })
      if (response.status === 200) {
        setCarouselImages(
          carouselImages.map((img) =>
            img._id === id ? { ...img, active: !img.active } : img
          )
        );
      } else {
        console.log("Failed to update carousel :(", response.status)
      }
    } catch (error) {
      console.log('Error updating carousel image:', error)
    }
  };

  const handleDeleteImage = async (id: string | undefined) => {
    try {
      const response = await fetch(`/api/carousel/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (response.status === 200) {
        setCarouselImages(carouselImages.filter((img) => img._id !== id));
      } else {
        console.log("Failed to delete carousel :(", response.status)
      }
    } catch (error) {
      console.log("Error in handleDeleteImage:", error)
    }
  };

  const handleMoveUp = async (id: string) => {
    const index = carouselImages.findIndex((img) => img.id === id);
    if (index > 0) {
      const newImages = [...carouselImages];
      [newImages[index].order, newImages[index - 1].order] = [newImages[index - 1].order, newImages[index].order];
      try {
        const response = await fetch('/api/carousel?isBulkUpdate=true', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify([newImages[index], newImages[index - 1]]),
        })
        if (response.status === 200) {
          fetchCarousel() // Refetch to get updated order from backend
        } else {
          console.log("Error in handleMoveUp :(", response.status)
        }
      } catch (error) {
        console.log("Error updating carousel order:", error)
      }
    }
  };

  const handleMoveDown = async (id: string) => {
    const index = carouselImages.findIndex((img) => img.id === id);
    if (index < carouselImages.length - 1) {
      const newImages = [...carouselImages];
      [newImages[index].order, newImages[index + 1].order] = [newImages[index + 1].order, newImages[index].order];
      try {
        const response = await fetch('/api/carousel?isBulkUpdate=true', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify([newImages[index], newImages[index + 1]]),
        })
        console.log(response)
        if (response.status === 200) {
          fetchCarousel() // Refetch to get updated order from backend
        } else {
          console.log("Error in handleMoveDown :(", response.status)
        }
      } catch (error) {
        console.log("Error updating carousel order:", error)
      }
    }
  };

  //to fetch carousel data from API
  const fetchCarousel = async () => {
    try {
      const response = await fetch('/api/carousel')
      const data = await response.json()
      setCarouselImages(data)
    } catch (error) {
      console.log('error from /carouselManager:', error)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    fetchCarousel()
  }, [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Home Carousel</h1>
          <p className="text-gray-600 mt-1">Manage homepage carousel images</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
        >
          + Upload Image
        </button>
      </div>
      {
        loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : null
      }
      {/* Add Image Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Upload Carousel Image</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image Title</label>
                <input
                  type="text"
                  value={newCarouselImage.title}
                  onChange={(e) => setNewCarouselImage({ ...newCarouselImage, title: e.target.value })}
                  placeholder="E.g., Summer Collection"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image Icon/Emoji</label>
                <input
                  type="text"
                  value={newCarouselImage.image}
                  onChange={(e) => setNewCarouselImage({ ...newCarouselImage, image: e.target.value })}
                  maxLength={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-2xl"
                />
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-600 mb-2">Preview:</p>
                <p className="text-5xl">{newCarouselImage.image}</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddImage}
                  className="flex-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
                >
                  Upload
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Carousel Images List */}
      <div className="space-y-3 overflow-y-auto max-h-[50vh]">
        {carouselImages.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-12 text-center">
            <p className="text-gray-600">No carousel images yet. Add your first image!</p>
          </div>
        ) : (
          carouselImages.map((img, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md border border-gray-200 p-4 flex items-center justify-between hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-4">
                <span className="text-5xl">{img.image}</span>
                <div>
                  <p className="font-semibold text-gray-900">{img.title}</p>
                  <p className="text-xs text-gray-500">Order: {img.order} | Uploaded: {img.createdAt?.split('T')[0]}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleActive(img._id)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${img.active
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-600'
                    }`}
                >
                  {img.active ? 'Active' : 'Disabled'}
                </button>
                <button
                  onClick={() => handleMoveUp(img.id)}
                  disabled={index === 0}
                  className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title="Move up"
                >
                  ⬆️
                </button>
                <button
                  onClick={() => handleMoveDown(img.id)}
                  disabled={index === carouselImages.length - 1}
                  className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title="Move down"
                >
                  ⬇️
                </button>
                {/* <button
                  onClick={() => handleDeleteImage(img._id)}
                  className="p-2 rounded hover:bg-red-100 text-red-600 transition-colors"
                  title="Delete"
                >
                  🗑️
                </button> */}
                <DeleteAlert
                  id={''}
                  onConfirm={() => handleDeleteImage(img._id)}
                  css="p-2 hover:bg-muted rounded-lg transition text-destructive hover:text-destructive/80"
                  title="Delete"
                  data={img.title}
                />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Preview Section */}
      {carouselImages.filter((img) => img.active).length > 0 && (
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Active Carousel Preview</h2>
          <div className="flex overflow-x-auto gap-4 pb-4">
            {carouselImages
              .filter((img) => img.active)
              .map((img, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-48 h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center"
                >
                  <div className="text-center">
                    <p className="text-6xl mb-2">{img.image}</p>
                    <p className="text-sm font-medium text-gray-700">{img.title}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

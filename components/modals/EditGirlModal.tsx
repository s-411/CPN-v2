'use client';

import React, { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useGirls } from '@/lib/context';
import { GirlFormData, GirlWithMetrics } from '@/lib/types';

interface EditGirlModalProps {
  isOpen: boolean;
  onClose: () => void;
  girl: GirlWithMetrics | null;
}

export default function EditGirlModal({ isOpen, onClose, girl }: EditGirlModalProps) {
  const { updateGirl } = useGirls();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<GirlFormData>>({});
  
  const [formData, setFormData] = useState<GirlFormData>({
    name: '',
    age: '',
    nationality: '',
    rating: 5.0
  });

  // Update form data when girl changes
  useEffect(() => {
    if (girl) {
      setFormData({
        name: girl.name,
        age: girl.age.toString(),
        nationality: girl.nationality,
        rating: girl.rating
      });
    }
  }, [girl]);

  const validateForm = (): boolean => {
    const newErrors: Partial<GirlFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    const age = parseInt(formData.age);
    if (!formData.age || isNaN(age) || age < 18) {
      newErrors.age = 'Age must be 18 or older';
    }

    // Nationality is now optional

    if (typeof formData.rating === 'number' && (formData.rating < 5.0 || formData.rating > 10.0)) {
      newErrors.rating = 'Rating must be between 5.0 and 10.0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!girl || !validateForm()) return;

    setIsSubmitting(true);

    try {
      updateGirl(girl.id, {
        name: formData.name.trim(),
        age: parseInt(formData.age),
        nationality: formData.nationality.trim(),
        rating: typeof formData.rating === 'number' ? formData.rating : parseFloat(formData.rating.toString())
      });

      setErrors({});
      onClose();
    } catch (error) {
      console.error('Error updating girl:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRatingChange = (rating: number) => {
    setFormData(prev => ({ ...prev, rating }));
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  if (!isOpen || !girl) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-cpn-dark border border-cpn-gray/20 rounded-lg w-full max-w-md animate-slide-up">
        <div className="flex items-center justify-between p-6 border-b border-cpn-gray/20">
          <h2 className="text-xl font-heading text-cpn-white">Edit Girl</h2>
          <button
            onClick={handleClose}
            className="text-cpn-gray hover:text-cpn-white transition-colors p-1"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-cpn-white mb-2">
              Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="input-cpn"
              placeholder="Enter name..."
            />
            {errors.name && (
              <p className="text-red-400 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-cpn-white mb-2">
              Age *
            </label>
            <input
              type="number"
              min="18"
              max="99"
              value={formData.age}
              onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
              className="input-cpn"
              placeholder="18"
            />
            {errors.age && (
              <p className="text-red-400 text-sm mt-1">{errors.age}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-cpn-white mb-2">
              Ethnicity (Optional)
            </label>
            <p className="text-sm text-cpn-gray mb-2">This information is optional and helps with analytics</p>
            <select
              value={formData.nationality}
              onChange={(e) => setFormData(prev => ({ ...prev, nationality: e.target.value }))}
              className="input-cpn"
            >
              <option value="">Prefer not to say</option>
              <option value="Asian">Asian</option>
              <option value="Black/African American">Black/African American</option>
              <option value="Hispanic/Latino">Hispanic/Latino</option>
              <option value="White/Caucasian">White/Caucasian</option>
              <option value="Middle Eastern">Middle Eastern</option>
              <option value="Native American">Native American</option>
              <option value="Pacific Islander">Pacific Islander</option>
              <option value="Mixed/Multiracial">Mixed/Multiracial</option>
              <option value="Other">Other</option>
            </select>
            {errors.nationality && (
              <p className="text-red-400 text-sm mt-1">{errors.nationality}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-cpn-white mb-4">
              Hotness Rating *
            </label>
            
            <div className="text-center mb-4">
              <div className="bg-cpn-yellow text-cpn-dark font-bold py-2 px-4 rounded-lg inline-block">
                {(typeof formData.rating === 'number' ? formData.rating : parseFloat(formData.rating.toString())).toFixed(1)}/10
              </div>
            </div>
            
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-cpn-gray">5.0</span>
              <span className="text-sm text-cpn-gray">7.5</span>
              <span className="text-sm text-cpn-gray">10.0</span>
            </div>
            
            <div className="grid grid-cols-6 gap-2 mb-4">
              {[5.0, 5.5, 6.0, 6.5, 7.0, 7.5].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => handleRatingChange(rating)}
                  className={`py-3 px-2 text-sm font-medium rounded-lg border transition-all ${
                    formData.rating === rating
                      ? 'bg-cpn-yellow text-cpn-dark border-cpn-yellow'
                      : 'bg-transparent text-cpn-gray border-cpn-gray hover:border-cpn-white hover:text-cpn-white'
                  }`}
                >
                  {rating.toFixed(1)}
                </button>
              ))}
            </div>
            
            <div className="grid grid-cols-5 gap-2 mb-4">
              {[8.0, 8.5, 9.0, 9.5, 10.0].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => handleRatingChange(rating)}
                  className={`py-3 px-2 text-sm font-medium rounded-lg border transition-all ${
                    formData.rating === rating
                      ? 'bg-cpn-yellow text-cpn-dark border-cpn-yellow'
                      : 'bg-transparent text-cpn-gray border-cpn-gray hover:border-cpn-white hover:text-cpn-white'
                  }`}
                >
                  {rating.toFixed(1)}
                </button>
              ))}
            </div>
            
            <div className="flex justify-between text-sm text-cpn-gray">
              <span>5.0-6.0: Below Average</span>
              <span>8.5-10.0: Exceptional</span>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 py-3 px-4 text-cpn-gray border border-cpn-gray/30 rounded-lg hover:text-cpn-white hover:border-cpn-gray transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 btn-cpn disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Updating...' : 'Update Girl'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
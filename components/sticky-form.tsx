'use client';

import React from "react"
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export function StickySidebarForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    organization: '',
    region: '',
    background: '',
    motivation: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitted(true);
    setIsLoading(false);

    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        organization: '',
        region: '',
        background: '',
        motivation: '',
      });
    }, 3000);
  };

  return (
    <div className="sticky top-8">
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
        {/* Header */}
        <div className="bg-gray-100 px-6 py-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Join Our Mission</h2>
          <p className="text-sm text-gray-600">
            Register as a Community Health Partner
          </p>
        </div>

        {/* Form Content */}
        <div className="p-6 bg-white">
          {isSubmitted ? (
            <div className="text-center py-8">
              <div className="mb-4">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-600">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Thank You!
              </h3>
              <p className="text-sm text-gray-600">
                Your application has been received. Our team will contact you
                soon.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-sm font-medium text-gray-900">
                  Full Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Your full name"
                  required
                  className="bg-gray-50 border-gray-300 text-gray-900 focus:border-gray-400 focus:ring-1 focus:ring-gray-400"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-900">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  required
                  className="bg-gray-50 border-gray-300 text-gray-900 focus:border-gray-400 focus:ring-1 focus:ring-gray-400"
                />
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium text-gray-900">
                  Phone <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+675 XXXXXXX"
                  required
                  className="bg-gray-50 border-gray-300 text-gray-900 focus:border-gray-400 focus:ring-1 focus:ring-gray-400"
                />
              </div>

              {/* Region */}
              <div className="space-y-2">
                <Label htmlFor="region" className="text-sm font-medium text-gray-900">
                  Region <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="region"
                  name="region"
                  value={formData.region}
                  onChange={handleChange}
                  placeholder="Your region/province"
                  required
                  className="bg-gray-50 border-gray-300 text-gray-900 focus:border-gray-400 focus:ring-1 focus:ring-gray-400"
                />
              </div>

              {/* Organization */}
              <div className="space-y-2">
                <Label htmlFor="organization" className="text-sm font-medium text-gray-900">
                  Organization (if any)
                </Label>
                <Input
                  id="organization"
                  name="organization"
                  value={formData.organization}
                  onChange={handleChange}
                  placeholder="Church, NGO, etc."
                  className="bg-gray-50 border-gray-300 text-gray-900 focus:border-gray-400 focus:ring-1 focus:ring-gray-400"
                />
              </div>

              {/* Background */}
              <div className="space-y-2">
                <Label htmlFor="background" className="text-sm font-medium text-gray-900">
                  Your Background
                </Label>
                <Textarea
                  id="background"
                  name="background"
                  value={formData.background}
                  onChange={handleChange}
                  placeholder="Medical, social work, or community experience..."
                  className="resize-none bg-gray-50 border-gray-300 text-gray-900 focus:border-gray-400 focus:ring-1 focus:ring-gray-400"
                  rows={3}
                />
              </div>

              {/* Motivation */}
              <div className="space-y-2">
                <Label htmlFor="motivation" className="text-sm font-medium text-gray-900">
                  Why do you want to join?
                </Label>
                <Textarea
                  id="motivation"
                  name="motivation"
                  value={formData.motivation}
                  onChange={handleChange}
                  placeholder="Tell us about your motivation..."
                  className="resize-none bg-gray-50 border-gray-300 text-gray-900 focus:border-gray-400 focus:ring-1 focus:ring-gray-400"
                  rows={3}
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gray-800 hover:bg-gray-900 text-white font-medium py-2 rounded-md transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Submitting...' : 'Register Now'}
              </Button>

              {/* Info Text */}
              <p className="text-xs text-gray-500 text-center">
                We will review your application and contact you within 48 hours.
              </p>
            </form>
          )}
        </div>
      </div>

      {/* Info Card */}
      <div className="mt-6 rounded-lg bg-gray-50 border border-gray-200 p-4">
        <h3 className="font-semibold text-sm text-gray-900 mb-3">
          Why Join Medivisor?
        </h3>
        <ul className="space-y-2 text-xs text-gray-600">
          <li className="flex gap-2">
            <span className="text-gray-900 font-bold flex-shrink-0">✓</span>
            <span>Purpose, respect & social standing in your community</span>
          </li>
          <li className="flex gap-2">
            <span className="text-gray-900 font-bold flex-shrink-0">✓</span>
            <span>Comprehensive training & backend support</span>
          </li>
          <li className="flex gap-2">
            <span className="text-gray-900 font-bold flex-shrink-0">✓</span>
            <span>Sustainable livelihood support</span>
          </li>
          <li className="flex gap-2">
            <span className="text-gray-900 font-bold flex-shrink-0">✓</span>
            <span>Growth & recognition opportunities</span>
          </li>
          <li className="flex gap-2">
            <span className="text-gray-900 font-bold flex-shrink-0">✓</span>
            <span>Part of a global network of health ambassadors</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
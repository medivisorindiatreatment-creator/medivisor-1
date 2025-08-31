'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Activities() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const sliderRef = useRef(null);

  const activities = [
    {
      title: 'Fiji Day Festivities',
      description: 'Cultural pride and joyous moments on Fiji\'s special day.',
      image: '/activities/Fiji-Day.jpg'
    },
    {
      title: 'Festival of Colors – Holi',
      description: 'Vibrant celebrations of color, unity, and happiness.',
      image: '/activities/holi.webp'
    },
    {
      title: 'Empowering Women on Women\'s Day',
      description: 'A day to honor strength, grace, and the achievements of women.',
      image: '/activities/Womens-Day.jpg'
    },
    {
      title: 'Splash of Joy at the Water Park',
      description: 'Fun-filled water adventures and refreshing memories.',
      image: '/activities/Water-Park.jpg'
    },
    {
      title: 'Spreading Love on Valentine\'s Day',
      description: 'Celebrating affection with heartfelt gestures and smiles.',
      image: '/activities/Valentines-Day.jpg'
    },
    {
      title: 'Honoring Moms on Mother\'s Day',
      description: 'A tribute to love, care, and the strength of mothers.',
      image: '/activities/Mothers-Day.jpg'
    }
  ];

  // We duplicate the activities to create a seamless loop
  const slides = [...activities, ...activities, ...activities];

  const nextSlide = () => {
    setCurrentSlide((prev) => prev + 1);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => prev - 1);
  };

  // Auto-slide functionality with a longer delay for a smoother feel
  useEffect(() => {
    const autoSlide = setInterval(() => {
      if (!isHovered) {
        nextSlide();
      }
    }, 5000); // 5 seconds for a slower, smoother scroll
    return () => clearInterval(autoSlide);
  }, [isHovered]);

  // Handle infinite loop logic
  useEffect(() => {
    if (currentSlide === activities.length * 2) {
      setTimeout(() => {
        // Instantly reset to the beginning of the second set without transition
        sliderRef.current.style.transitionDuration = '0s';
        setCurrentSlide(activities.length);
      }, 700); // Wait for the transition to finish (matches duration below)
    }

    if (currentSlide < activities.length) {
      setTimeout(() => {
        // Instantly reset to the end of the second set without transition
        sliderRef.current.style.transitionDuration = '0s';
        setCurrentSlide(activities.length * 2 - 1);
      }, 700);
    }

    // After the reset, re-enable the transition
    const timeout = setTimeout(() => {
      if (sliderRef.current) {
        sliderRef.current.style.transitionDuration = '700ms';
      }
    }, 100);

    return () => clearTimeout(timeout);
  }, [currentSlide, activities.length]);

  return (
    <section className="overflow-hidden relative py-4 md:py-10 bg-gray-50">
      <div className="container mx-auto px-4 md:px-0">
        <div className="md:text-center mb-8 max-w-3xl mx-auto">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-3 leading-snug">
            We Go Beyond Care —<br className='md:hidden block'/> We Celebrate Life
          </h1>
          <p className="mt-2 text-gray-700 md:text-lg text-base">
            More than just treatment — we care, we celebrate, and we create joyful experiences during your healing journey. From personal visits to vibrant events, your happiness is our mission.
          </p>
        </div>

        <div
          className="relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="overflow-hidden">
            <div
              ref={sliderRef}
              className="flex w-full transition-transform duration-700 ease-in-out"
              style={{
                transform: `translateX(-${(currentSlide * 100) / 3}%)`
              }}
            >
              {slides.map((activity, index) => (
                <div key={index} className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/3 p-2">
                  <div className="relative group cursor-pointer overflow-hidden rounded-md shadow-lg">
                    <Image
                      src={activity.image}
                      alt={activity.title}
                      width={600}
                      height={400}
                      className="w-full h-56 md:h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h2 className="text-lg md:text-xl lg:text-2xl font-semibold mb-1">
                        {activity.title}
                      </h2>
                      <p className="text-xs md:text-sm lg:text-base">
                        {activity.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="absolute top-1/2 left-0 right-0 transform -translate-y-1/2 flex justify-between px-2 md:px-4">
            <Button
              onClick={prevSlide}
              variant="outline"
              size="icon"
              className="bg-white hover:bg-gray-800 hover:text-white rounded-full shadow-lg transition duration-300 border-gray-200 w-10 h-10 md:w-10 md:h-10"
            >
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
            </Button>
            <Button
              onClick={nextSlide}
              variant="outline"
              size="icon"
              className="bg-white hover:bg-gray-800 hover:text-white rounded-full shadow-lg transition duration-300 border-gray-200 w-10 h-10 md:w-10 md:h-10"
            >
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
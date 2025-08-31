import { Metadata } from 'next';

// Define a type for your metadata to ensure consistency
type PageMetadata = {
  [key: string]: Metadata;
};

// Site-wide metadata
export const siteMetadata = {
  title: 'Medivisor India Treatment - High-Quality Medical Care',
  description:
    'Medivisor provides affordable, high-quality medical treatment in India for international patients, including surgery, kidney transplant, IVF, cancer care, and heart treatment.',
  keywords: 'medical tourism, India treatment, affordable surgery, kidney transplant, IVF, cancer care, heart treatment, international patients',
  openGraph: {
    title: 'Medivisor India Treatment - Your Trusted Medical Partner',
    description:
      'We offer comprehensive medical tourism services for international patients seeking world-class treatment in India.',
    url: 'https://www.medivisorindia.com/',
    siteName: 'Medivisor India Treatment',
    images: [
      {
        url: 'https://images.pexels.com/photos/40568/medical-appointment-doctor-healthcare-40568.jpeg',
        width: 1200,
        height: 630,
        alt: 'Medivisor India Treatment',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

// Page-specific metadata
export const pageMetadata: PageMetadata = {
  // Home Page
  '/': {
    title: 'Home | Medivisor India Treatment',
    description: siteMetadata.description,
  },
  // About Us Pages
  '/aboutus': {
    title: 'About Us | Medivisor India Treatment',
    description: 'Learn about Medivisor\'s mission, vision, and commitment to providing the best medical tourism services.',
  },
  '/services': {
    title: 'Our Services | Medivisor India Treatment',
    description: 'Explore the wide range of medical services offered by Medivisor, including treatment for cancer, cardiology, and more.',
  },
  '/team': {
    title: 'Our Team | Medivisor India Treatment',
    description: 'Meet the dedicated and experienced team of professionals at Medivisor.',
  },
  '/medical-advisors': {
    title: 'Our Medical Advisors | Medivisor India Treatment',
    description: 'Get to know our panel of distinguished medical advisors.',
  },
  '/hospital-network': {
    title: 'Our Hospital Network | Medivisor India Treatment',
    description: 'Discover our extensive network of top hospitals and medical facilities in India.',
  },
  '/safety-measures': {
    title: 'Our Safety Measures | Medivisor India Treatment',
    description: 'Read about the safety and quality measures Medivisor takes to ensure patient well-being.',
  },
  // India Treatment Pages
  '/india-treatment': {
    title: 'India Treatment | Medivisor India Treatment',
    description: 'A comprehensive guide to seeking medical treatment in India with Medivisor.',
  },
  '/treatment-cost': {
    title: 'Treatment Cost | Medivisor India Treatment',
    description: 'Find transparent and affordable pricing for medical treatments in India.',
  },
  '/treatment-process': {
    title: 'Treatment Process | Medivisor India Treatment',
    description: 'Understand the step-by-step process of getting treated in India with Medivisor.',
  },
  '/visa-process': {
    title: 'Visa Process | Medivisor India Treatment',
    description: 'A detailed guide to the medical visa application process for India.',
  },
  '/travel-guide': {
    title: 'Travel Guide | Medivisor India Treatment',
    description: 'Essential travel tips and a guide to make your medical journey to India smooth and hassle-free.',
  },
  '/faqs': {
    title: 'FAQs | Medivisor India Treatment',
    description: 'Frequently asked questions about medical treatment and services in India.',
  },
  // Gallery Pages
  '/gallery': {
    title: 'Gallery | Medivisor India Treatment',
    description: 'Explore our gallery of patient stories, photos, and media coverage.',
  },
  '/patient-testimonials': {
    title: 'Patient Testimonials | Medivisor India Treatment',
    description: 'Read and watch testimonials from patients who chose Medivisor for their treatment.',
  },
  '/photo-albums': {
    title: 'Patient Activities | Medivisor India Treatment',
    description: 'View photos of our patients\' activities and experiences in India.',
  },
  '/media-coverage': {
    title: 'News Coverage | Medivisor India Treatment',
    description: 'See media articles and news coverage about Medivisor India Treatment.',
  },
  '/blog': {
    title: 'Blog | Medivisor India Treatment',
    description: 'Read the latest articles and updates from the Medivisor blog.',
  },
  // Contact Us Page
  '/contact': {
    title: 'Contact Us | Medivisor India Treatment',
    description: 'Get in touch with Medivisor for all your medical tourism inquiries.',
  },
};


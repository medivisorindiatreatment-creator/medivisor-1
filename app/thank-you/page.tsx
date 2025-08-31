import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ThankYou() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Thank You!
          </h1>
          <p className="text-gray-600">
            Your message has been sent successfully. Our team will contact you within 24 hours.
          </p>
        </div>
        
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-md">
            <h3 className="font-semibold text-blue-900 mb-2">What happens next?</h3>
            <ul className="text-sm text-blue-800 space-y-1 text-left">
              <li>• Our medical consultant will review your case</li>
              <li>• We'll prepare a personalized treatment plan</li>
              <li>• You'll receive a detailed cost estimate</li>
              <li>• We'll schedule a consultation with our specialists</li>
            </ul>
          </div>
          
          <div className="bg-green-50 p-4 rounded-md">
            <h3 className="font-semibold text-green-900 mb-2">Need immediate assistance?</h3>
            <p className="text-sm text-green-800 mb-2">Contact us directly:</p>
            <a 
              href="https://wa.me/918340780250?text=Hello%2C%20I%20am%20interested%20in%20your%20services"
              className="inline-flex items-center gap-2 text-green-600 font-medium"
            >
              📱 WhatsApp: +91 8340 780 250
            </a>
          </div>
        </div>
        
        <div className="mt-8">
          <Link href="/">
            <Button className="w-full bg-[#E22026] hover:bg-[#74BF44] transition-colors">
              Return to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
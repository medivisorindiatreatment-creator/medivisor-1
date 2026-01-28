'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqData = [
  {
    id: 'what-is-programme',
    question: 'What is the Medivisor Expanded Patient Support Programme?',
    answer: 'The EPSP is a community-based initiative designed to reach families in Papua New Guinea who are suffering but cannot access digital platforms. Many of our countrymen are not online or uncomfortable using technology, and continue to struggle in silence. Community Health Partners (recognized publicly as Medivisor Health Ambassadors) become bridges of hope, reaching into villages and churches to guide families toward reliable treatment in India.',
  },
  {
    id: 'mission',
    question: 'Why is Medivisor launching this programme?',
    answer: 'Over one year, Medivisor has walked alongside over 100 families from Papua New Guinea and helped them find life-changing treatment in India. We receive overwhelming calls and messages showing many more people are suffering quietly and do not know where to turn. We cannot go deep and wide alone, so we now invite compassionate service-minded individuals and organizations to join hands in this mission.',
  },
  {
    id: 'who-can-join',
    question: 'Who can join as a Community Health Partner?',
    answer: 'We welcome individuals and organizations who:',
    listItems: [
      'Are socially motivated and respected in their community',
      'Have a service-oriented mindset',
      'Preferably have medical or social sector exposure',
      'Believe in ethical, patient-first work',
      'Believe in blessings, goodwill, and long-term respect more than money',
      'Want to build something meaningful for their community'
    ],
    note: 'You are not an agent or broker – you are a community health guide and support person.'
  },
  {
    id: 'what-will-i-do',
    question: 'What are the main responsibilities?',
    answer: 'As a Medivisor Community Health Partner and Health Ambassador, you will:',
    listItems: [
      'Meet and listen to patients and families',
      'Help collect medical reports and information',
      'Arrange online consultations with doctors in India',
      'Guide patients through documentation and travel processes',
      'Stay connected with families during the entire treatment journey',
      'Act as their local support and guidance point'
    ],
    note: 'You become a source of comfort, guidance, and hope for families in their most difficult moments.'
  },
  {
    id: 'support-provided',
    question: 'What support does Medivisor provide?',
    answer: 'Medivisor India will:',
    listItems: [
      'Review and guide all medical cases',
      'Connect patients to the right hospitals and doctors',
      'Plan and manage treatment in India',
      'Handle hospital coordination, accommodation, and local support',
      'Provide training, guidance, and materials to you',
      'Stand with you in every case'
    ],
    note: 'You are never alone – Medivisor does the medical and operational heavy lifting while you focus on community guidance and support.'
  },
  {
    id: 'livelihood',
    question: 'How is this work sustainable as a livelihood?',
    answer: 'Medivisor provides sustainable livelihood support through a transparent, fixed support amount per patient you guide. This is not commission-driven or sales-based – it is a dignified and ethical way to keep this service going. These funds exist so you can:',
    listItems: [
      'Run a small office',
      'Pay for phone, internet, and staff costs',
      'Work full-time serving patients',
      'Continue helping more families'
    ],
    note: 'This ensures sustainability support without depending on pushing patients.'
  },
  {
    id: 'rewards',
    question: 'What rewards and recognition will I receive?',
    answer: 'Your true rewards will be the gratitude and prayers of families you help, respect and trust in your community, and the quiet joy of knowing you were an instrument of hope and healing.',
    additionalItems: [
      'Official certificate of appointment and identity as a Medivisor Health Ambassador',
      'Recognition at Medivisor events and programmes',
      'Membership in the regional and international Medivisor network',
      'Recognition awards such as Outstanding Health Ambassador or Community Impact Award',
      'Invitations to annual meetings and trainings',
      'Opportunity to grow your region and build a respected health guidance centre'
    ]
  }
];

interface FAQItemProps {
  faq: typeof faqData[0];
  isOpen: boolean;
  onToggle: () => void;
}

function FAQItem({ faq, isOpen, onToggle }: FAQItemProps) {
  return (
    <div className={`border-b border-gray-100 ${isOpen ? 'bg-gray-50' : ''}`}>
      <button
        onClick={onToggle}
        className="w-full py-5 px-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
        aria-expanded={isOpen}
      >
        <span className="text-lg font-medium text-gray-900 pr-8">
          {faq.question}
        </span>
        <div className="flex-shrink-0">
          {isOpen ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </div>
      </button>
      
      {isOpen && (
        <div className="px-4 pb-5">
          <div className="pl-2 space-y-4">
            <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
            
            {faq.listItems && (
              <ul className="space-y-3">
                {faq.listItems.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center mr-3 mt-0.5">
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                    </div>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            )}
            
            {faq.additionalItems && (
              <div className="space-y-3">
                <p className="font-medium text-gray-900">Additionally, you receive:</p>
                <ul className="space-y-3">
                  {faq.additionalItems.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center mr-3 mt-0.5">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                      </div>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {faq.note && (
              <div className="pt-3 mt-3 border-t border-gray-200">
                <p className="text-gray-600 italic">{faq.note}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function FAQSection() {
  const [openId, setOpenId] = useState<string | null>('what-is-programme');

  const handleToggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          Frequently Asked Questions
        </h2>
        <p className="text-gray-600">
          Find answers to common questions about becoming a Medivisor Health Ambassador
        </p>
      </div>

      {/* FAQ Items */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {faqData.map((faq) => (
          <FAQItem
            key={faq.id}
            faq={faq}
            isOpen={openId === faq.id}
            onToggle={() => handleToggle(faq.id)}
          />
        ))}
      </div>

      {/* Summary Section */}
      <div className="mt-12">
        <div className="bg-gray-50 rounded-xl p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
            What You Will Receive as a Health Ambassador
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-lg border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">Purpose & Respect</h4>
                <ul className="space-y-2">
                  <li className="text-gray-700">Respect and recognition in your community</li>
                  <li className="text-gray-700">Prayers and blessings of families you help</li>
                  <li className="text-gray-700">Official certificate and identity as Health Ambassador</li>
                </ul>
              </div>
              
              <div className="bg-white p-5 rounded-lg border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">Training & Support</h4>
                <ul className="space-y-2">
                  <li className="text-gray-700">Comprehensive training and guidance</li>
                  <li className="text-gray-700">Information materials and resources</li>
                  <li className="text-gray-700">Full medical and operational support</li>
                </ul>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-lg border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">Sustainable Livelihood</h4>
                <ul className="space-y-2">
                  <li className="text-gray-700">Transparent, fixed support per patient</li>
                  <li className="text-gray-700">Not commission-driven or sales-based</li>
                  <li className="text-gray-700">Dignified, ethical compensation model</li>
                </ul>
              </div>
              
              <div className="bg-white p-5 rounded-lg border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">Growth & Recognition</h4>
                <ul className="space-y-2">
                  <li className="text-gray-700">International network membership</li>
                  <li className="text-gray-700">Recognition awards and certificates</li>
                  <li className="text-gray-700">Opportunity for regional growth</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-center text-lg font-medium text-gray-900">
              "You will earn respect, purpose, skills, and a sustainable livelihood — while helping save lives."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
// app/pacific-patient-meet-concluded/page.tsx (New File for Concluded Event)
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { format } from "date-fns";

// Event Details from the screenshot
const EVENT_NAME = "Pacific Patient Meet";
const START_DATE = new Date("2025-11-18");
const END_DATE = new Date("2025-11-26");
const EVENT_DATE_RANGE = `${format(START_DATE, "MMM dd")} – ${format(
  END_DATE,
  "MMM dd, yyyy"
)}`;

export const metadata = {
  title: `${EVENT_NAME} | Event Concluded - Thank You!`,
  description:
    "Thank you for joining the Medivisor Pacific Patient Meet. Stay tuned for future events.",
  openGraph: {
    title: `${EVENT_NAME} | Event Concluded - Thank You!`,
    description:
      "Thank you for joining the Medivisor Pacific Patient Meet. Stay tuned for future events.",
    images: [
      {
        url: "https://medivisorindiatreatment.com/thumbnail/pacific-patient-meet.jpg", // Placeholder image URL
        width: 1200,
        height: 630,
      },
    ],
    url: "https://medivisorindiatreatment.com/pacific-patient-meet",
    siteName: "Medivisor",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${EVENT_NAME} | Event Concluded - Thank You!`,
    description:
      "Thank you for joining the Medivisor Pacific Patient Meet. Stay tuned for future events.",
    images: ["https://medivisorindiatreatment.com/thumbnail/pacific-patient-meet.jpg"], // Placeholder image URL
  },
};

export default function Page() {
  return (
    <section className="bg-white text-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-red-600 to-red-700 text-white py-16 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
            {EVENT_NAME} Concluded
          </h1>
          <p className="text-lg sm:text-xl text-white/90 max-w-3xl mx-auto">
            The event held from **{EVENT_DATE_RANGE}** in Papua New Guinea,
            Solomon Islands, Vanuatu, and Fiji has successfully wrapped up.
          </p>
        </div>
      </div>

      <main className="w-full">
        {/* Left Column (Main Content) - Spans 2/3 of the width on large screens */}
        <div className="space-y-10 ">
          {/* Introduction */}
          <div className="space-y-5 mt-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Grateful for Your Participation
            </h2>
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
              We extend our heartfelt gratitude to everyone who attended the
              **{EVENT_NAME}**! Our specialists from **India Treatment Gallery** and **Yashoda Hospital**
              provided expert consultations across four nations: Papua New Guinea,
              Solomon Islands, Vanuatu, and Fiji. We hope we have provided the
              guidance you need for your healthcare journey in India.
            </p>
          </div>

      
          
          {/* What You'll Learn (Based on screenshot text) */}
          <div className="bg-gray-100 rounded-xs p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 border-l-4 border-red-600 pl-3">
              Post-Event Next Steps
            </h3>
            <ul className="list-disc pl-6 space-y-2 text-sm text-gray-700">
              <li>Review the doctor's expert medical guidance.</li>
              <li>Contact our team for transparent estimated treatment costs in India.</li>
              <li>Get assistance with travel planning and visa support.</li>
              <li>Receive continuous support through your journey to recovery.</li>
            </ul>
          </div>
        </div>

      
      </main>
    </section>
  );
}
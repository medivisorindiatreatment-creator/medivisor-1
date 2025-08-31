"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  FileText,
  Camera,
  StampIcon as Passport,
  DollarSign,
  CheckCircle,
  AlertTriangle,
  Download,
  Users,
  Calendar,
} from "lucide-react"
import Ctasection from "@/components/CtaSection"
import Banner from "@/components/BannerService"

export default function VisaPage() {
  const [activeStep, setActiveStep] = useState<number | null>(null)

  const requiredDocuments = [
    {
      id: 1,
      icon: Passport,
      title: "Passport Bio-Page",
      description: "Submit a clear copy of your passport's bio-page.",
      details: [
        "High-quality scan or photo",
        "All text must be clearly readable",
        "Valid for at least 6 months",
        "PDF or JPEG format accepted",
      ],
      image: "/services/visa.jpg",
    },
    {
      id: 2,
      icon: Camera,
      title: "Personal Photo",
      description:
        "Take a 2 inches by 2 inches photo of yourself with your mobile phone. Ensure your face and shoulders are clearly visible against a plain, light-colored, or white background.",
      details: [
        "2x2 inches dimensions",
        "Plain white or light background",
        "Face and shoulders visible",
        "Recent photo (within 6 months)",
      ],
      image: "/photographer-looking-negatives_23-2148019147.jpg",
    },
    {
      id: 3,
      icon: FileText,
      title: "e-Visa Application Form",
      description: "If you haven't received the form from us, please download it from the link provided.",
      details: [
        "Complete all required fields",
        "Use black or blue ink if printed",
        "Sign and date the form",
        "Double-check all information",
      ],
      image: "/services/concierge-lifestyle.jpg",
    },
  ]

  const importantNotes = [
    {
      icon: Users,
      title: "All Passengers Required",
      description: "All passengers must submit the required documents, regardless of age.",
    },
    {
      icon: Calendar,
      title: "60-Day Validity",
      description: "Your initial free eVisa will be valid for 60 days from the date of issue.",
    },
    {
      icon: DollarSign,
      title: "Extension Available",
      description:
        "If an extension is needed, we will arrange it. The visa extension will cost $80 per person (government fee).",
    },
  ]

  return (
    <>
      <Banner
  topSpanText="Visa Made Simple"
  title="Caring Visa Support for Patients & Families"
  description="When health is your priority, paperwork shouldn’t weigh you down. At Medivisor, we make the visa process easy and worry-free. Our team guides you step by step — preparing documents, coordinating with embassies, and ensuring smooth approvals — so you and your loved ones can focus on healing, not on formalities."
  buttonText="Start Visa Process"
  buttonLink="#visa-support"
  bannerBgImage="/visa-banner.png"
  mainImageSrc="/about-main.png"
  mainImageAlt="Compassionate Visa Assistance for Medical Travel"
/>


      <section className="min-h-screen bg-white">
        <div className="pt-10">
          <div className="">
            <div className="space-y-0">
              {requiredDocuments.map((document, index) => {
                const IconComponent = document.icon
                const isEven = index % 2 === 0
                const bgColor = isEven ? "bg-gray-50" : "bg-white" // first card gray

                return (
                  <div key={document.id} className={`${bgColor} py-14`}>
                    <div
                      className="container mx-auto px-4 md:px-0"
                    >
                      {/* Image Section */}
                      <div
                       className={`flex flex-col ${isEven ? "lg:flex-row" : "lg:flex-row-reverse"
                        } items-center gap-6 lg:gap-12`}>
<div className="flex-1 relative group">
                        <div className="relative overflow-hidden rounded-xs shadow-xs">
                          <img
                            src={document.image || "/placeholder.svg"}
                            alt={document.title}
                            className="w-full h-[220px] md:h-[400px] object-cover"
                          />
                        </div>
                        <div className="absolute md:-top-4 -top-5 md:-left-4 -left-2 md:w-14 w-10 md:h-14 h-10 bg-white text-gray-700 rounded-full flex items-center justify-center shadow-md border border-gray-200">
                          <IconComponent className="md:w-7 w-5 md:h-7 h-5" />
                        </div>
                      </div>

                      {/* Text Section */}
                      <div className="flex-1 space-y-4">
                        <h2 className="text-2xl font-bold text-gray-900 leading-tight">{document.title}</h2>
                        <p className="text-base text-gray-600 leading-relaxed">{document.description}</p>

                        {/* Inner Card */}
                        <div className="rounded-xs border border-gray-100 shadow-xs overflow-hidden bg-white">
                          <div className="px-5 pt-3">
                            <h3 className="text-lg font-semibold text-gray-800">Requirements:</h3>
                          </div>
                          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {document.details.map((detail, detailIndex) => (
                              <div
                                key={detailIndex}
                                className="flex items-center gap-2 px-3 py-2 rounded-md bg-gray-50 hover:bg-gray-100 transition"
                              >
                                <CheckCircle className="w-5 h-5 text-[#74BF44] flex-shrink-0" />
                                <span className="text-sm md:text-base text-gray-800">{detail}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                        </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Download Form */}

            <div className="py-10 bg-white rounded-xs p-8 border border-gray-100 shadow-xs">
              <div className="container mx-auto">
                <div className="grid grid-cols-2 gap-x-6">
                  <div className="col-span-1">
                    <div className="text-left bg-gray-100 p-10">

                      <Download className="w-12 h-12 text-gray-700 mx-left mb-4" />
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">Download e-Visa Application Form</h3>
                      <p className="text-base text-gray-600 mb-6 max-w-2xl mx-auto">
                        If you haven't received the e-Visa application form from us, you can download it directly using the
                        button below.
                      </p>
                      <a href="/e-Visa Application Form.docx">
                        <Button className="bg-[#E22026] border border-red-200 text-white text-sm md:text-base font-normal px-5 py-2 rounded-xs shadow-xs transition hover:bg-[#74BF44]">
                          Download Application Form
                        </Button>
                      </a>
                    </div>
                  </div>
                  <div className="col-span-1">
                    <div className=" h-full text-left w-full mx-auto rounded-xs border border-red-200 bg-[#e32128] shadow-xs">
                      <div className=" items-start gap-4 p-6">
                        {/* Icon Badge */}
                        <div className="pb-3">
                          <AlertTriangle className="w-12 h-12 text-white" />
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                          <h4 className="text-xl font-semibold text-gray-100 mb-4">Visa Extension Information</h4>

                          <div className="space-y-4">
                            {/* Point 1 */}
                            <div className="flex items-start gap-3 pb-4 border-b border-red-400">
                              <div className="w-8 h-8 flex items-center justify-center rounded-full p-1 bg-green-50">
                                <CheckCircle className="w-6 h-6 text-[#74BF44]" />
                              </div>
                              <div>
                                <p className="font-medium text-lg text-gray-100">Initial Validity: 60 days</p>
                                <p className="text-sm text-gray-100">
                                  Your initial free eVisa will be valid for 60 days from the date of issue.
                                </p>
                              </div>
                            </div>

                            {/* Point 2 */}
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 flex items-center justify-center rounded-full p-1 bg-green-50">
                                <CheckCircle className="w-6 h-6 text-[#74BF44]" />
                              </div>
                              <div>
                                <p className="font-medium text-lg text-gray-100">Extension Cost: $80 per person</p>
                                <p className="text-sm text-gray-100">
                                  If an extension is needed, we will arrange it for you (government fee applies).
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Important Info */}


            {/* Visa Extension Info */}

            <div className="py-10 bg-gray-50 ">
              <div className="container mx-auto">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">Important Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {importantNotes.map((note, index) => {
                    const IconComponent = note.icon
                    return (
                      <div key={index} className="bg-white rounded-sw p-6 border border-gray-100 shadow-xs text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <IconComponent className="w-8 h-8 text-gray-700" />
                        </div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">{note.title}</h4>
                        <p className="text-base text-gray-600">{note.description}</p>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Ctasection />
    </>
  )
}

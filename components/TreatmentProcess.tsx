import { Button } from "@/components/ui/button"
import { FileText, UserCheck, Plane, MapPin, CheckCircle } from "lucide-react"

export default function TreatmentProcessPage() {
  const steps = [
    {
      id: 1,
      icon: FileText,
      title: "Get a Quote",
      description:
        "Send us your medical reports, and we'll provide a comprehensive quotation that includes a detailed treatment plan and the overall cost, covering treatment, travel, accommodation, and food expenses.",
      image: "/services/quatation.jpg",
      features: ["Detailed treatment plan", "Transparent pricing", "No hidden costs", "Quick 24-hour response"],
    },
    {
      id: 2,
      icon: UserCheck,
      title: "Talk to the Doctor",
      description:
        "Let us know if you'd like to speak with the doctor, and we'll connect you with the appropriate specialist to discuss your personalized treatment plan and expected outcomes in detail.",
      image: "/services/c4d8f37853.jpg",
      features: [
        "Board-certified specialists",
        "Video consultations",
        "Personalized treatment plans",
        "Multiple language support",
      ],
    },
    {
      id: 3,
      icon: Plane,
      title: "Book a Ticket",
      description:
        "Send us the required documents, and we'll arrange your visa processing. You can then book your flight independently, or if you prefer, we can handle the booking for you. We'll also assist with any flying clearance requirements.",
      image: "/services/visa.jpg",
      features: [
        "Visa processing support",
        "Flight booking assistance",
        "Travel insurance guidance",
        "Medical clearance help",
      ],
    },
    {
      id: 4,
      icon: MapPin,
      title: "Fly to India",
      description:
        "Once you arrive in India, we handle everything else seamlessly, including airport pickup, premium hotel accommodations, hospital visits, currency exchange, and local SIM cards. A dedicated staff member will assist you throughout your entire stay.",
      image: "/services/flight.jpg",
      features: [
        "Airport pickup service",
        "Premium accommodations",
        "Dedicated care coordinator",
        "24/7 emergency support",
      ],
    },
  ]

  return (
    <section className="min-h-screen">
      <div className="space-y-0">
        {steps.map((step, index) => {
          const IconComponent = step.icon
          const isEven = index % 2 === 0
          const sectionBg = isEven ? "md:bg-gray-50" : "md:bg-white bg-gray-50"
          const cardBg = isEven ? "bg-white" : "bg-gray-50"
          const cardBgInner = isEven ? "bg-gray-50" : "bg-white" // 👈 alternate logic

          return (
            <div key={step.id} className={`${sectionBg} py-14`}>
              <div className="container mx-auto md:px-0 px-4">
                <div
                  className={`flex flex-col ${isEven ? "lg:flex-row" : "lg:flex-row-reverse"} items-center border border-gray-200 md:border-none  gap-8 lg:gap-12`}
                >
                  {/* Image + Icon */}
                  <div className="flex-1 relative group">
                    <div className="relative overflow-hidden rounded-xs shadow-md transition-transform ">
                      <img
                        src={step.image || "/placeholder.svg"}
                        alt={step.title}
                        className="w-full h-[200px] md:h-[400px] object-cover"
                      />
                    </div>
                    <div className="absolute -top-4 -left-4 w-16 h-16 bg-white text-gray-700 rounded-full flex items-center justify-center shadow-md border border-gray-200">
                      <IconComponent className="w-8 h-8" />
                    </div>
                  </div>

                  {/* Text Content */}
                  <div className="flex-1 px-2 md:px-0 space-y-2 md:space-y-5">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">{step.title}</h2>
                    <p className="text-base text-gray-600 leading-relaxed">{step.description}</p>

                    {/* Inner Card */}
                    <div className={`rounded-xs border border-gray-100 shadow-xs overflow-hidden ${cardBg}`}>
                      {/* Header */}
                      <div className="px-5 pt-3">
                        <h3 className="text-lg font-semibold text-gray-700">What's Included</h3>
                      </div>

                      {/* Features List */}
                      <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {step.features.map((feature, featureIndex) => (
                          <div
                            key={featureIndex}
                            className={`flex items-center gap-2 px-3 py-2 rounded-xs hover:bg-gray-100 transition ${cardBgInner}`}
                          >
                            <CheckCircle className="w-5 h-5 text-[#74BF44] flex-shrink-0" />
                            <span className="text-sm md:text-base text-gray-800">{feature}</span>
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
    </section>
  )
}

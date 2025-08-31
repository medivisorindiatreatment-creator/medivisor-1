"use client"

import type React from "react"

import { useState } from "react"
import {
  Shield,
  MessageCircle,
  DollarSign,
  Package,
  HeartHandshake,
  Star,
  CheckCircle,
  Award,
  Phone,
  ArrowRight,
  Heart,
  UserCheck,
  Clock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import CtaSection from "@/components/CtaSection"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import Banner from "@/components/BannerService"
import WhyChooseUsSection from "@/components/StatsSection"

interface ChoiceReason {
  id: string
  title: string
  description: string
  icon: React.ElementType
  category: string
  highlights?: string[]
}

const choiceReasons: ChoiceReason[] = [
  {
    id: "1",
    title: "Top-notch Healthcare Providers",
    description:
      "Collaborating exclusively with JCI and NABH accredited healthcare institutions and clinicians in India, Medivisor ensures that patients receive treatments and services of the highest quality, adhering to international healthcare standards.",
    icon: Shield,
    category: "Quality",
    highlights: ["JCI Accredited", "NABH Certified", "International Standards"],
  },
  {
    id: "2",
    title: "Tailored Treatment Plans",
    description:
      "Committed to personalized healthcare solutions, Medivisor works closely with medical experts to customize treatment plans based on the specific needs and preferences of each patient, enhancing the overall quality of care.",
    icon: UserCheck,
    category: "Personalization",
    highlights: ["Personalized Care", "Expert Collaboration", "Custom Solutions"],
  },
  {
    id: "3",
    title: "Clear and Open Communication",
    description:
      "Communication is at the core of the Medivisor experience. We prioritize transparency throughout the medical journey, covering treatment options, costs, and expected outcomes. This approach ensures that you are well-informed, empowering you to make decisions with confidence.",
    icon: MessageCircle,
    category: "Transparency",
    highlights: ["Full Transparency", "Informed Decisions", "Clear Communication"],
  },
  {
    id: "4",
    title: "Affordable Healthcare Options",
    description:
      "Recognizing the importance of affordability in healthcare, Medivisor strives to offer cost-effective treatment options without compromising on quality.",
    icon: DollarSign,
    category: "Affordability",
    highlights: ["Cost-Effective", "Quality Maintained", "Budget-Friendly"],
  },
  {
    id: "5",
    title: "One-Stop Shop – Streamlined Experience",
    description:
      "Medivisor provides a seamless and stress-free experience by managing everything from hospital booking to hotel accommodation, visa arrangements, and travel logistics. Eliminating the need to search for separate vendors, all services are efficiently provided under one roof. Visit us or give us a call, and we'll handle everything swiftly, efficiently, and economically.",
    icon: Package,
    category: "Convenience",
    highlights: ["All-in-One Service", "No Multiple Vendors", "Complete Management"],
  },
  {
    id: "6",
    title: "Comprehensive Assistance in India",
    description:
      "Going beyond paperwork, Medivisor ensures a hassle-free experience with a dedicated executive present both inside and outside the hospital. From airport pick-ups to hospital transfers and accompanying you on the hospital floor, our executive assists with doctor consultations, investigations, admissions, discharges, medications, and more.",
    icon: HeartHandshake,
    category: "Support",
    highlights: ["Dedicated Executive", "Full Assistance", "Hospital Accompaniment"],
  },
  {
    id: "7",
    title: "Holistic Care – Embracing Life's Moments",
    description:
      "Medivisor believes in extending care beyond the clinic. We organize and facilitate patients to enjoy festivals and significant occasions. Regular indoor activities and outdoor excursions offer a refreshing break from the monotony of treatment, significantly contributing to overall healing and recovery.",
    icon: Heart,
    category: "Wellness",
    highlights: ["Beyond Medical Care", "Festival Celebrations", "Recovery Activities"],
  },
  {
    id: "8",
    title: "Continued Relationship – Post-Treatment Support",
    description:
      "At Medivisor, our commitment doesn't end with the completion of treatment. We continue to assist our patients even after they've returned home, whether it involves sending medicines, organizing follow-up video consultations, or any other support needed.",
    icon: Clock,
    category: "Continuity",
    highlights: ["Post-Treatment Care", "Medicine Delivery", "Follow-up Support"],
  },
  {
    id: "9",
    title: "1800+ Testimonials – Real Stories, Real Satisfaction",
    description:
      "Over 1500 international patients, including 1200 from Pacific Island countries, have chosen Medivisor for their treatment and have shared positive feedback about their experiences. To hear their stories, click here.",
    icon: Star,
    category: "Trust",
    highlights: ["1500+ Patients", "1200 Pacific Islands", "Proven Results"],
  },
]

const categories = Array.from(new Set(choiceReasons.map((item) => item.category)))

const categoryIcons: Record<string, React.ElementType> = {
  Quality: Shield,
  Personalization: UserCheck,
  Transparency: MessageCircle,
  Affordability: DollarSign,
  Convenience: Package,
  Support: HeartHandshake,
  Wellness: Heart,
  Continuity: Clock,
  Trust: Star,
}

export default function WhyChooseUsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All")

  const filteredReasons =
    selectedCategory === "All" ? choiceReasons : choiceReasons.filter((item) => item.category === selectedCategory)

  const getCategoryCount = (category: string) => {
    return category === "All" ? choiceReasons.length : choiceReasons.filter((item) => item.category === category).length
  }

  return (
    <>
      {/* Header Section */}
      <Banner
        topSpanText="Why Choose Medivisor?"
        title="Expert-Led Medical Guidance You Can Trust"
        description="At Medivisor India, we bridge the gap between patients and top healthcare providers. With personalized support, unbiased medical insights, and a commitment to transparency, we ensure your treatment journey is informed, stress-free, and backed by experts who care."
        buttonText="Talk to a Medivisor Expert"
        buttonLink="/contact"
        bannerBgImage="/faq-banner.png"
        mainImageSrc="/about-main.png"
        mainImageAlt="Trusted Medical Experts at Medivisor India"
      />

      <WhyChooseUsSection />

      {/* Main Content */}
      <section className="bg-white">
        <div className="container mx-auto px-0 py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Sidebar - Categories */}
            <div className="lg:w-80 flex-shrink-0">
              <div className="bg-gray-50 rounded-xl shadow-sm  border-gray-100 border sticky top-6">
                <div className="p-6 border-b border-gray-300 ">
                  <h2 className="text-2xl font-semibold  text-gray-700 mb-2">Our Strengths</h2>
                  <p className="text-sm text-gray-700">Explore what makes us different</p>
                </div>

                <div className="p-4">
                  <nav className="space-y-1">
                    <button
                      onClick={() => setSelectedCategory("All")}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-all duration-200 ${selectedCategory === "All"
                          ? "bg-gray-50 text-gray-700 border border-gray-400"
                          : "text-gray-700 hover:bg-gray-50 hover:text-gray-700"
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center ${selectedCategory === "All" ? "bg-gray-50" : "bg-gray-50"
                            }`}
                        >
                          <Award
                            className={`w-4 h-4 ${selectedCategory === "All" ? "text-gray-700" : "text-neutral-400"}`}
                          />
                        </div>
                        <span className="font-medium">All Reasons</span>
                      </div>
                      <Badge
                        variant="secondary"
                        className={`${selectedCategory === "All" ? "bg-white text-gray-700" : "bg-gray-50 text-neutral-400"
                          }`}
                      >
                        {getCategoryCount("All")}
                      </Badge>
                    </button>

                    <div className="my-2 border-t border-gray-200" />

                    {categories.map((category) => {
                      const Icon = categoryIcons[category] || Award
                      return (
                        <button
                          key={category}
                          onClick={() => setSelectedCategory(category)}
                          className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-all duration-200 ${selectedCategory === category
                              ? "bg-gray-50 text-gray-700 border border-neutral-700"
                              : "text-gray-700 hover:bg-gray-50 hover:text-gray-700"
                            }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-8 h-8 rounded-lg flex items-center justify-center ${selectedCategory === category ? "bg-neutral-700" : "bg-gray-50"
                                }`}
                            >
                              <Icon
                                className={`w-4 h-4 ${selectedCategory === category ? "text-gray-700" : "text-gray-700"}`}
                              />
                            </div>
                            <span className="font-medium">{category}</span>
                          </div>
                          <Badge
                            variant="secondary"
                            className={`${selectedCategory === category
                                ? "bg-neutral-700 text-gray-700"
                                : "bg-gray-50 text-neutral-400"
                              }`}
                          >
                            {getCategoryCount(category)}
                          </Badge>
                        </button>
                      )
                    })}
                  </nav>
                </div>
              </div>
            </div>

            {/* Right Content - Reasons */}
            <div className="flex-1">
              <div className="mb-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-700">
                      {selectedCategory === "All" ? "All Our Strengths" : selectedCategory}
                    </h2>
                    <p className="text-neutral-400 mt-1">
                      {filteredReasons.length} reason{filteredReasons.length !== 1 ? "s" : ""} why Medivisor stands out
                    </p>
                  </div>
                </div>
              </div>

              {/* Reasons Grid */}
              <div className="space-y-6">
                {filteredReasons.map((reason, index) => {
                  const Icon = reason.icon

                  return (
                    <Card key={reason.id} className="group bg-gray-50 border-gray-100 transition-all duration-300">
                      <CardContent className="p-8">
                        <div className="flex items-start gap-6">
                          <div className="flex-shrink-0">
                            <div className="w-16 h-16 bg-white border-border-gray-200 rounded-xs flex items-center justify-center text-gray-700 shadow-sm">
                              <Icon className="w-8 h-8" />
                            </div>
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center w-8 h-8 bg-gray-50 rounded-full text-gray-700 font-bold text-sm">
                                  {index + 1}
                                </div>
                                <Badge
                                  variant="outline"
                                  className="text-base text-gray-700 border-gray-200 px-4 bg-gray-50"
                                >
                                  {reason.category}
                                </Badge>
                              </div>
                            </div>

                            <h3 className="text-xl font-bold text-gray-700 mb-4 group-hover:text-neutral-300 transition-colors duration-200">
                              {reason.title}
                            </h3>

                            <p className="text-gray-700 leading-relaxed mb-6">{reason.description}</p>

                            {reason.highlights && (
                              <div className="flex flex-wrap gap-2">
                                {reason.highlights.map((highlight, idx) => (
                                  <div key={idx} className="flex items-center gap-2 bg-white  px-3 py-1 rounded-full">
                                    <CheckCircle className="w-4 h-4 text-gray-800" />
                                    <span className="text-base font-medium text-gray-800">{highlight}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

            <CtaSection/>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

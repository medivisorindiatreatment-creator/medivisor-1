// types/medical-advisor.d.ts
export type MedicalAdvisor = {
  _id: string
  name: string
  photo?: string // Wix image URL
  specialty: string
  experience: string
  // Add any other fields from your Wix collection that you might need
  // _createdDate?: { $date: string };
  // _updatedDate?: { $date: string };
  // "link-medical-advisors-all"?: string;
}

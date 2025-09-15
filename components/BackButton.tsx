// components/BackButton.tsx

'use client';

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "./ui/button"; // Adjust the import path as needed

export function BackButton() {
    const router = useRouter();

    return (
        <Button
            onClick={() => router.back()}
            variant="outline"
            size="lg"
            className="border-gray-200 rounded-xs description-1 hover:bg-gray-50  bg-white"
        >
            <ArrowLeft className="h-5 w-5 mr-2" />
             Back
        </Button>
    );
}
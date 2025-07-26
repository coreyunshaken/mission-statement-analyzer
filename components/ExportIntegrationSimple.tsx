"use client"

import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface ExportIntegrationSimpleProps {
  missionText: string
  scores: {
    clarity: number
    specificity: number
    impact: number
    authenticity: number
    memorability: number
    overall: number
  }
  selectedIndustry: string
  onClose: () => void
}

export const ExportIntegrationSimple: React.FC<ExportIntegrationSimpleProps> = ({
  missionText,
  scores,
  selectedIndustry,
  onClose
}) => {
  return (
    <Card className="bg-gradient-to-r from-gray-700 to-gray-800 border-gray-600 mt-8 shadow-2xl">
      <CardContent className="p-6 sm:p-8 lg:p-10">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
            📤 Export & Share
          </h2>
          <p className="text-gray-200 text-base sm:text-lg">
            Export and sharing features coming soon!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-[#0a0e1a] border-gray-600">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-[#f8fafc] mb-4">
                📄 PDF Report
              </h3>
              <p className="text-gray-400 mb-4">
                Download a professional analysis report with all metrics and recommendations.
              </p>
              <Button disabled className="w-full bg-purple-600 opacity-50">
                Coming Soon
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-[#0a0e1a] border-gray-600">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-[#f8fafc] mb-4">
                🔗 Shareable Link
              </h3>
              <p className="text-gray-400 mb-4">
                Generate a link to share your analysis with team members.
              </p>
              <Button disabled className="w-full bg-pink-600 opacity-50">
                Coming Soon
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-8">
          <Button
            onClick={onClose}
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            Close
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
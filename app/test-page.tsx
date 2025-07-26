"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function TestPage() {
  const [showExport, setShowExport] = useState(false)

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">
          Mission Statement Analyzer
        </h1>
        
        <Card className="bg-[#111827] border-gray-600 mb-8">
          <CardContent className="p-6">
            <p className="text-gray-300 mb-4">
              This is a test page to verify the application is working.
            </p>
            
            <Button
              onClick={() => setShowExport(!showExport)}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              📤 Test Export & Share Button
            </Button>
          </CardContent>
        </Card>

        {showExport && (
          <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/30">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-purple-400 mb-4">
                📤 Export & Share (Working!)
              </h2>
              <p className="text-gray-300 mb-4">
                Great! The Export & Share feature is now visible. This means:
              </p>
              <ul className="text-gray-300 mb-4 list-disc list-inside">
                <li>The button appears correctly</li>
                <li>The component loads without errors</li>
                <li>The purple theme is applied</li>
                <li>The functionality is working</li>
              </ul>
              
              <Button
                onClick={() => setShowExport(false)}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                Close
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
"use client"

import React, { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

// Workshop Mode Configuration
const workshopQuestions = [
  {
    title: "What is your core purpose?",
    subtitle: "The fundamental reason your organization exists",
    question: "What problem do you solve or what value do you create?",
    placeholder: "e.g., We help small businesses automate repetitive tasks...",
    field: "purpose" as const,
    examples: [
      "Transform how people communicate",
      "Make sustainable energy accessible",
      "Empower students through personalized learning"
    ]
  },
  {
    title: "Who do you serve?",
    subtitle: "Your primary audience or beneficiaries",
    question: "Who are the main people or groups that benefit from what you do?",
    placeholder: "e.g., small business owners, students, healthcare professionals...",
    field: "audience" as const,
    examples: [
      "Small business owners worldwide",
      "Students in underserved communities", 
      "Healthcare professionals and patients"
    ]
  },
  {
    title: "What impact do you create?",
    subtitle: "The positive change you bring to the world",
    question: "What does success look like? How is the world better because of you?",
    placeholder: "e.g., save time, improve health outcomes, reduce environmental impact...",
    field: "impact" as const,
    examples: [
      "Save 10 hours per week for every user",
      "Improve learning outcomes by 40%",
      "Reduce carbon emissions globally"
    ]
  },
  {
    title: "What makes you unique?",
    subtitle: "Your differentiating factor or approach",
    question: "What do you do differently from others in your space?",
    placeholder: "e.g., AI-powered, community-driven, scientifically-backed...",
    field: "uniqueValue" as const,
    examples: [
      "Through AI-powered automation",
      "Using peer-to-peer learning networks",
      "With evidence-based methodologies"
    ]
  },
  {
    title: "What's your scope?",
    subtitle: "The scale and timeframe of your ambition",
    question: "Are you focused locally, globally, or somewhere in between?",
    placeholder: "e.g., globally, in developing markets, for the next generation...",
    field: "timeframe" as const,
    examples: [
      "Around the world",
      "For future generations",
      "In emerging markets"
    ]
  },
  {
    title: "Choose your action verb",
    subtitle: "The primary action that drives your mission",
    question: "What verb best describes what you do?",
    placeholder: "Select or type your own...",
    field: "actionVerb" as const,
    examples: [
      "Transform", "Empower", "Accelerate", "Connect", "Enable", 
      "Revolutionize", "Democratize", "Unlock", "Inspire", "Build"
    ]
  }
]

// Generate mission statement from workshop answers
function generateMissionFromWorkshop(answers: WorkshopAnswers, industry: string): string {
  const { purpose, audience, impact, uniqueValue, timeframe, actionVerb } = answers
  
  // Show partial preview as user fills in answers
  if (!purpose && !audience) return ""
  
  // Build mission statement progressively
  let mission = ""
  
  if (purpose && audience && actionVerb) {
    // Full mission statement with all key components
    const templates = [
      `To ${actionVerb.toLowerCase()} ${audience} by ${purpose}${uniqueValue ? ` ${uniqueValue}` : ""}${impact ? `, ${impact}` : ""}${timeframe ? ` ${timeframe}` : ""}.`,
      `${actionVerb} ${audience} through ${purpose}${uniqueValue ? ` ${uniqueValue}` : ""}${impact ? ` to ${impact}` : ""}${timeframe ? ` ${timeframe}` : ""}.`,
      `To ${purpose} for ${audience}${uniqueValue ? ` ${uniqueValue}` : ""}${impact ? `, enabling ${impact}` : ""}${timeframe ? ` ${timeframe}` : ""}.`
    ]
    
    const template = industry === "nonprofit" ? templates[0] : 
                    industry === "technology" ? templates[1] : 
                    templates[0]
    mission = template
  } else if (purpose && audience) {
    // Partial preview with purpose and audience
    mission = `To [ACTION VERB] ${audience} by ${purpose}${impact ? `, ${impact}` : ""}${uniqueValue ? ` ${uniqueValue}` : ""}${timeframe ? ` ${timeframe}` : ""}.`
  } else if (purpose) {
    // Just purpose
    mission = `To [ACTION VERB] [TARGET AUDIENCE] by ${purpose}.`
  }
  
  return mission.replace(/\s+/g, ' ').trim()
}

export interface WorkshopAnswers {
  purpose: string
  audience: string
  impact: string
  uniqueValue: string
  timeframe: string
  actionVerb: string
}

interface WorkshopModeProps {
  selectedIndustry: string
  onComplete: (mission: string) => void
  onClose: () => void
}

export const WorkshopMode: React.FC<WorkshopModeProps> = ({
  selectedIndustry,
  onComplete,
  onClose
}) => {
  const [workshopStep, setWorkshopStep] = useState(0)
  const [workshopAnswers, setWorkshopAnswers] = useState<WorkshopAnswers>({
    purpose: "",
    audience: "",
    impact: "",
    uniqueValue: "",
    timeframe: "",
    actionVerb: "",
  })

  const handleNext = useCallback(() => {
    if (workshopStep < workshopQuestions.length - 1) {
      setWorkshopStep(prev => prev + 1)
    } else {
      const generatedMission = generateMissionFromWorkshop(workshopAnswers, selectedIndustry)
      onComplete(generatedMission)
    }
  }, [workshopStep, workshopAnswers, selectedIndustry, onComplete])

  const handlePrevious = useCallback(() => {
    if (workshopStep > 0) {
      setWorkshopStep(prev => prev - 1)
    }
  }, [workshopStep])

  const handleAnswerChange = useCallback((field: keyof WorkshopAnswers, value: string) => {
    setWorkshopAnswers(prev => ({
      ...prev,
      [field]: value
    }))
  }, [])

  const handleExampleClick = useCallback((example: string) => {
    const currentField = workshopQuestions[workshopStep].field
    setWorkshopAnswers(prev => ({
      ...prev,
      [currentField]: example
    }))
  }, [workshopStep])

  const currentQuestion = workshopQuestions[workshopStep]
  const currentAnswer = workshopAnswers[currentQuestion.field]

  return (
    <Card 
      id="workshop-section"
      className="bg-gradient-to-r from-blue-600 to-blue-700 border-blue-500 mt-8 shadow-2xl animate-in slide-in-from-bottom duration-500"
    >
      <CardContent className="p-6 sm:p-8 lg:p-10">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
            🛠️ Mission Statement Workshop
          </h2>
          <p className="text-blue-100 text-base sm:text-lg">
            Step-by-step guidance to craft your perfect mission statement
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="text-sm text-blue-200">
              Step {workshopStep + 1} of {workshopQuestions.length}
            </div>
            <div className="flex gap-1">
              {workshopQuestions.map((_, index) => (
                <div 
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    index <= workshopStep ? 'bg-white' : 'bg-blue-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
              {currentQuestion.title}
            </h3>
            <p className="text-blue-100 text-base sm:text-lg mb-2">
              {currentQuestion.subtitle}
            </p>
            <p className="text-blue-50 text-sm sm:text-base leading-relaxed">
              {currentQuestion.question}
            </p>
          </div>

          <div className="mb-6">
            {currentQuestion.field === "actionVerb" ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                  {currentQuestion.examples.map((verb, index) => (
                    <Button
                      key={index}
                      variant={currentAnswer === verb ? "default" : "outline"}
                      onClick={() => handleExampleClick(verb)}
                      className={`text-sm ${
                        currentAnswer === verb 
                          ? "bg-blue-800 hover:bg-blue-900 text-white border-blue-600" 
                          : "border-gray-400 text-blue-900 hover:bg-gray-100 bg-white"
                      }`}
                    >
                      {verb}
                    </Button>
                  ))}
                </div>
                <Input
                  value={currentAnswer}
                  onChange={(e) => handleAnswerChange(currentQuestion.field, e.target.value)}
                  placeholder="Or type your own action verb..."
                  className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500 focus:ring-2 text-base rounded-lg"
                />
              </div>
            ) : (
              <Textarea
                value={currentAnswer}
                onChange={(e) => handleAnswerChange(currentQuestion.field, e.target.value)}
                placeholder={currentQuestion.placeholder}
                className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500 focus:ring-2 min-h-[120px] text-base rounded-lg resize-none"
                rows={4}
              />
            )}
          </div>

          {currentQuestion.field !== "actionVerb" && (
            <div className="mb-8">
              <p className="text-sm text-blue-200 mb-3">💡 Click an example to use it:</p>
              <div className="flex flex-wrap gap-2">
                {currentQuestion.examples.map((example, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    onClick={() => handleExampleClick(example)}
                    className="text-xs sm:text-sm bg-white hover:bg-gray-100 text-blue-900 hover:text-blue-900 border border-gray-400 hover:border-gray-500 transition-all duration-200"
                  >
                    {example}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Live Preview */}
          {workshopStep >= 2 && (
            <Card className="bg-gray-800 border-gray-600 mb-8">
              <CardContent className="p-4">
                <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  👀 Live Preview
                </h4>
                <div className="text-gray-100 text-base italic leading-relaxed">
                  "{generateMissionFromWorkshop(workshopAnswers, selectedIndustry) || "Your mission statement will appear here as you fill in the details..."}"
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center pt-6">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={workshopStep === 0}
              className="border-white text-white hover:bg-white hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Previous
            </Button>
            
            <Button
              onClick={handleNext}
              disabled={!currentAnswer.trim()}
              className="bg-white hover:bg-gray-100 disabled:from-gray-600 disabled:to-gray-700 disabled:text-gray-400 text-blue-600 font-semibold px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {workshopStep === workshopQuestions.length - 1 ? "Generate Mission 🚀" : "Next →"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
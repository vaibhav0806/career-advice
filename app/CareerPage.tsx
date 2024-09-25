'use client'

import { useState } from 'react'
import axios from 'axios'
import ReactMarkdown from 'react-markdown'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Send } from "lucide-react"

const getCareerAdvice = async (career: string, years: number): Promise<string> => {
  const url = 'https://gemma.us.gaianet.network/v1/chat/completions';

  const data = {
    messages: [
      { role: 'system', content: 'You are a helpful career advisor. Provide advice in Markdown format.' },
      { role: 'user', content: `Provide career advice for becoming a ${career} in ${years} years.` }
    ],
    model: 'gemma'
  };

  const config = {
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json'
    }
  };

  try {
    const response = await axios.post(url, data, config);
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

export default function CareerAdvicePage() {
  const [career, setCareer] = useState('')
  const [years, setYears] = useState('')
  const [advice, setAdvice] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const result = await getCareerAdvice(career, parseInt(years))
      setAdvice(result)
    } catch (error) {
      console.error('Error fetching career advice:', error)
      setAdvice('Sorry, there was an error generating your career advice. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Career Advice Generator</CardTitle>
          <CardDescription>Enter your desired career and timeframe to get personalized advice</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="career">Desired Career</Label>
              <Input
                id="career"
                value={career}
                onChange={(e) => setCareer(e.target.value)}
                placeholder="e.g., Software Developer"
                required
              />
            </div>
            <div>
              <Label htmlFor="years">Years to Achieve</Label>
              <Input
                id="years"
                type="number"
                value={years}
                onChange={(e) => setYears(e.target.value)}
                placeholder="e.g., 5"
                required
                min="1"
              />
            </div>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Advice...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Get Career Advice
                </>
              )}
            </Button>
          </form>
          {advice && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Your Career Advice</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <ReactMarkdown>{advice}</ReactMarkdown>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
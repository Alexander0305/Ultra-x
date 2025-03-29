"use client"

import { useState, useEffect } from "react"
import type { ContentRecommendation } from "@/lib/ai/content-recommendation"

type RecommendationProps = {
  userId: string
}

export function PersonalizedRecommendations({ userId }: RecommendationProps) {
  const [recommendations, setRecommendations] = useState<ContentRecommendation[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')

  useEffect(() => {
    fetchRecommendations()
  }, [userId])

  const fetchRecommendations = async () => {
    setLoading(true)
    try {
      // In a real app, this would be an API call
      // For now, we'll simulate with mock data
      setTimeout(() => {
        const mockRecommendations: ContentRecommendation[] = [
          {
            id: '1',
            title: 'The Evolution of Web Development Frameworks',
            description: 'Exploring the past, present, and future of web development frameworks and their impact on modern applications.',
            category: 'Technology',
            tags: ['Web Development', 'JavaScript', 'Frameworks', 'Programming'],
            relevanceScore: 0.95
          },
          {
            id: '2',
            title: 'Machine Learning for Beginners: A Practical Guide',
            description: 'A step-by-step introduction to machine learning concepts with practical examples and code snippets.',
            category: 'AI & Machine Learning',
            tags: ['AI', 'Machine Learning', 'Data Science', 'Python'],
            relevanceScore: 0.87
          },
          {
            id: '3',
            title: 'Sustainable Architecture: Building for the Future',
            description: 'How architects are incorporating sustainable practices and materials to create eco-friendly buildings.',
            category: 'Architecture',
            tags: ['Sustainability', 'Design', 'Environment', 'Innovation'],
            relevanceScore: 0.78
          },
          {
            id: '4',
            title: 'The Psychology of Social Media Engagement',
            description: 'Understanding the psychological factors that drive user engagement on social media platforms.',
            category: 'Psychology',
            tags: ['Social Media', 'User Behavior', 'Digital Psychology', 'Engagement'],
            relevanceScore: 0.92
          },
          {
            id: '5',
            title: 'Blockchain Beyond Cryptocurrency',
            description: 'Exploring practical applications of blockchain technology beyond digital currencies.',
            category: 'Technology',
            tags: ['Blockchain', 'Innovation', 'Decentralization', 'Technology'],
            relevanceScore: 0.83
          }
        ]
        
        setRecommendations(mockRecommendations)
        setLoading(false)
      }, 1500)
    } catch (error) {
      console.error(error)
    }
  }


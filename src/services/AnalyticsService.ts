import api from './APIService'
import type { AnalyticsResponse } from '@/types'

export const AnalyticsService = {
  /**
   * Fetches comprehensive financial analytics for a period (POST /analytics/).
   * @param startDate ISO 8601 string
   * @param endDate ISO 8601 string
   */
  async fetchAnalytics(startDate: string, endDate: string): Promise<AnalyticsResponse> {
    const response = await api.post<AnalyticsResponse>(
      '/analytics/',
      { startDate:startDate, endDate:endDate } // Payload matches Symfony AnalyticsRequest DTO
    )
    return response.data
  },

  /**
   * Fetches a financial summary text (POST /reports/summary).
   */
  async fetchSummary(startDate: string, endDate: string): Promise<string> {
    const response = await api.post<{ summary: string }>('/reports/summary', {
      startDate,
      endDate,
    })
    // Backend returns JSON object { summary: "..." }, extract the string
    return response.data.summary
  },
}

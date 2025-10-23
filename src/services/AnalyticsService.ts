import api from './APIService.ts'

export const analyticsService = {
  async getCurrentBalance(): Promise<number> {
    const response = await api.get('/analytics/current-balance')
    return response.data
  },

  async getBalanceForPeriod(startDate: string, endDate: string): Promise<number> {
    const response = await api.post('/analytics/period-balance', { startDate, endDate })
    return response.data
  },

  async getAnalytics(startDate: string, endDate: string): Promise<any> {
    const response = await api.post('/analytics', { startDate, endDate })
    return response.data
  },

  async getMonthlySummary(year: number, month: number): Promise<any> {
    const response = await api.get(`/analytics/monthly/${year}/${month}`)
    return response.data
  },

  async getSummary(startDate: string, endDate: string): Promise<string> {
    const response = await api.post('/reports/summary', { startDate, endDate })
    return response.data
  },
}

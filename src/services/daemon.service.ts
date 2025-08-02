import axios, { AxiosInstance } from 'axios'

/**
 * DaemonService reinforces persistent connections to Divina-L3
 * and AthenaMyst daemon APIs. Provides simple health checks and
 * future expansion for secure message passing.
 */
export class DaemonService {
  private divinaClient: AxiosInstance
  private athenaClient: AxiosInstance

  constructor(divinaUrl: string = process.env.DIVINA_L3_URL || '', athenaUrl: string = process.env.ATHENAMYST_URL || '') {
    this.divinaClient = axios.create({ baseURL: divinaUrl })
    this.athenaClient = axios.create({ baseURL: athenaUrl })
  }

  async ping() {
    try {
      const [divina, athena] = await Promise.all([
        this.divinaClient.get('/health'),
        this.athenaClient.get('/health'),
      ])
      return { success: true, divina: divina.data, athena: athena.data }
    } catch (error) {
      console.error('Daemon connection error:', error)
      return { success: false, error }
    }
  }
}

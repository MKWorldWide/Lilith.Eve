import axios from 'axios'

export class GoogleTranslateService {
  private apiKey: string

  constructor(apiKey: string = process.env.GOOGLE_CLOUD_API_KEY || process.env.GOOGLE_TRANSLATE_API_KEY || '') {
    this.apiKey = apiKey
  }

  async translate(text: string, targetLanguage: string): Promise<string> {
    if (!this.apiKey) {
      throw new Error('Google API key not provided')
    }

    const url = 'https://translation.googleapis.com/language/translate/v2'
    const response = await axios.post(url, null, {
      params: {
        q: text,
        target: targetLanguage,
        key: this.apiKey,
      },
    })

    return response.data.data.translations[0].translatedText as string
  }
}

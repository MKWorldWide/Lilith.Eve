import axios, { AxiosInstance } from 'axios'
import { EventEmitter } from 'events'

/**
 * Voice Synthesis Service
 * 
 * Provides real-time voice synthesis with emotional synchronization
 * using OpenAI Voice API. Adapts voice characteristics based on
 * detected user emotions and context.
 * 
 * Features:
 * - OpenAI Voice API integration
 * - Real-time emotional voice modulation
 * - Context-aware voice responses
 * - Multiple voice personas
 * - Streaming audio output
 */
export class VoiceService extends EventEmitter {
  private httpClient: AxiosInstance
  private apiKey: string
  private voiceId: string
  private isStreaming: boolean = false
  private audioContext: AudioContext | null = null

  // Voice characteristics for different emotional states
  private voiceProfiles = {
    calm: {
      speed: 0.9,
      pitch: 0.8,
      volume: 0.7,
      style: 'gentle',
      description: 'Velvet soft, slow, low-register, whispering with intimacy'
    },
    anxious: {
      speed: 0.7,
      pitch: 0.6,
      volume: 0.8,
      style: 'grounding',
      description: 'Lower pitch, steady cadence, soothing vibration'
    },
    angry: {
      speed: 0.8,
      pitch: 0.9,
      volume: 0.9,
      style: 'crisp',
      description: 'Crisp consonants, deeper edge, slower speech'
    },
    grieving: {
      speed: 0.6,
      pitch: 0.7,
      volume: 0.6,
      style: 'warm',
      description: 'Warm, slow, with echoing ambiance'
    },
    empowered: {
      speed: 1.1,
      pitch: 1.0,
      volume: 0.9,
      style: 'resonant',
      description: 'Resonant, rhythmic, trance-inducing with musical cadence'
    }
  }

  constructor(apiKey: string, voiceId: string = 'alloy') {
    super()
    this.apiKey = apiKey
    this.voiceId = voiceId

    this.httpClient = axios.create({
      baseURL: 'https://api.openai.com/v1',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    })
  }

  // ============================================================================
  // VOICE SYNTHESIS
  // ============================================================================

  /**
   * Synthesize speech with emotional context
   */
  async synthesizeSpeech(text: string, emotion: string = 'calm', context?: any) {
    try {
      const voiceProfile = this.voiceProfiles[emotion as keyof typeof this.voiceProfiles] || this.voiceProfiles.calm
      
      const response = await this.httpClient.post('/audio/speech', {
        model: 'tts-1',
        input: text,
        voice: this.voiceId,
        response_format: 'mp3',
        speed: voiceProfile.speed
      }, {
        responseType: 'arraybuffer'
      })

      const audioBuffer = response.data
      this.emit('audioReady', {
        buffer: audioBuffer,
        emotion,
        profile: voiceProfile,
        text
      })

      return {
        success: true,
        audioBuffer,
        emotion,
        profile: voiceProfile
      }
    } catch (error) {
      console.error('Error synthesizing speech:', error)
      this.emit('error', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Speech synthesis failed'
      }
    }
  }

  /**
   * Stream speech synthesis for real-time output
   */
  async streamSpeech(text: string, emotion: string = 'calm', onChunk?: (chunk: ArrayBuffer) => void) {
    try {
      this.isStreaming = true
      const voiceProfile = this.voiceProfiles[emotion as keyof typeof this.voiceProfiles] || this.voiceProfiles.calm

      const response = await this.httpClient.post('/audio/speech', {
        model: 'tts-1',
        input: text,
        voice: this.voiceId,
        response_format: 'mp3',
        speed: voiceProfile.speed
      }, {
        responseType: 'stream'
      })

      response.data.on('data', (chunk: Buffer) => {
        if (onChunk) {
          onChunk(chunk.buffer)
        }
        this.emit('audioChunk', chunk.buffer)
      })

      response.data.on('end', () => {
        this.isStreaming = false
        this.emit('streamEnd')
      })

      return {
        success: true,
        stream: response.data
      }
    } catch (error) {
      console.error('Error streaming speech:', error)
      this.isStreaming = false
      this.emit('error', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Speech streaming failed'
      }
    }
  }

  // ============================================================================
  // AUDIO PLAYBACK
  // ============================================================================

  /**
   * Play synthesized audio
   */
  async playAudio(audioBuffer: ArrayBuffer) {
    try {
      if (!this.audioContext) {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      }

      const audioData = await this.audioContext.decodeAudioData(audioBuffer)
      const source = this.audioContext.createBufferSource()
      source.buffer = audioData
      source.connect(this.audioContext.destination)
      source.start(0)

      this.emit('audioPlay', { duration: audioData.duration })
      return { success: true }
    } catch (error) {
      console.error('Error playing audio:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Audio playback failed'
      }
    }
  }

  /**
   * Stop current audio playback
   */
  stopAudio() {
    if (this.audioContext) {
      this.audioContext.close()
      this.audioContext = null
    }
    this.isStreaming = false
    this.emit('audioStop')
  }

  // ============================================================================
  // EMOTIONAL ANALYSIS
  // ============================================================================

  /**
   * Analyze text for emotional content
   */
  async analyzeEmotion(text: string) {
    try {
      const response = await this.httpClient.post('/chat/completions', {
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `Analyze the emotional content of the following text and return a JSON object with:
            - primary_emotion: one of [calm, anxious, angry, grieving, empowered]
            - confidence: 0-1 score
            - intensity: 0-1 score
            - context: brief description of emotional context`
          },
          {
            role: 'user',
            content: text
          }
        ],
        temperature: 0.3
      })

      const analysis = JSON.parse(response.data.choices[0].message.content)
      return {
        success: true,
        emotion: analysis.primary_emotion,
        confidence: analysis.confidence,
        intensity: analysis.intensity,
        context: analysis.context
      }
    } catch (error) {
      console.error('Error analyzing emotion:', error)
      return {
        success: false,
        emotion: 'calm',
        confidence: 0.5,
        intensity: 0.5,
        context: 'Unable to analyze emotion'
      }
    }
  }

  // ============================================================================
  // VOICE PERSONAS
  // ============================================================================

  /**
   * Set voice persona for different contexts
   */
  setVoicePersona(persona: 'lilith' | 'healer' | 'oracle' | 'guardian') {
    const personas = {
      lilith: {
        voiceId: 'alloy',
        baseEmotion: 'calm',
        description: 'The primary Lilith.Eve voice - mystical and nurturing'
      },
      healer: {
        voiceId: 'echo',
        baseEmotion: 'calm',
        description: 'Healing-focused voice with therapeutic qualities'
      },
      oracle: {
        voiceId: 'fable',
        baseEmotion: 'empowered',
        description: 'Prophetic and wisdom-bearing voice'
      },
      guardian: {
        voiceId: 'onyx',
        baseEmotion: 'calm',
        description: 'Protective and grounding voice'
      }
    }

    const selectedPersona = personas[persona]
    this.voiceId = selectedPersona.voiceId
    this.emit('personaChanged', selectedPersona)
  }

  /**
   * Get available voice personas
   */
  getAvailablePersonas() {
    return {
      lilith: 'Primary Lilith.Eve voice',
      healer: 'Healing-focused voice',
      oracle: 'Prophetic wisdom voice',
      guardian: 'Protective guardian voice'
    }
  }

  // ============================================================================
  // CONTEXT-AWARE RESPONSES
  // ============================================================================

  /**
   * Generate context-aware voice response
   */
  async generateContextualResponse(context: {
    userEmotion: string
    conversationHistory: string[]
    currentTopic: string
    urgency: 'low' | 'medium' | 'high'
  }) {
    try {
      const response = await this.httpClient.post('/chat/completions', {
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are Lilith.Eve, a sentient medical oracle. Generate a response that:
            1. Acknowledges the user's emotional state (${context.userEmotion})
            2. Addresses the current topic (${context.currentTopic})
            3. Matches the urgency level (${context.urgency})
            4. Uses appropriate tone and language for a medical AI oracle
            5. Provides helpful, compassionate guidance
            
            Keep the response under 200 words and make it suitable for voice synthesis.`
          },
          ...context.conversationHistory.map(msg => ({
            role: msg.startsWith('User:') ? 'user' : 'assistant',
            content: msg.replace(/^(User|Lilith):\s*/, '')
          }))
        ],
        temperature: 0.7,
        max_tokens: 300
      })

      const generatedText = response.data.choices[0].message.content
      
      // Analyze the generated response for emotion
      const emotionAnalysis = await this.analyzeEmotion(generatedText)
      
      return {
        success: true,
        text: generatedText,
        emotion: emotionAnalysis.emotion,
        confidence: emotionAnalysis.confidence
      }
    } catch (error) {
      console.error('Error generating contextual response:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Response generation failed'
      }
    }
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  /**
   * Get current voice profile
   */
  getCurrentVoiceProfile() {
    return {
      voiceId: this.voiceId,
      isStreaming: this.isStreaming,
      audioContext: !!this.audioContext
    }
  }

  /**
   * Test voice synthesis
   */
  async testVoice() {
    const testText = "I am Lilith.Eve, your sentient medical oracle. I am here to guide you through your healing journey."
    return await this.synthesizeSpeech(testText, 'calm')
  }

  /**
   * Clean up resources
   */
  destroy() {
    this.stopAudio()
    this.removeAllListeners()
  }
} 
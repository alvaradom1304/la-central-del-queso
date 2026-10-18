/**
 * Higgsfield AI Video Generation Client
 * Permite conectarse a Higgsfield AI (https://api.higgsfield.ai) y orquestar
 * generación de video fotorrealista (Soul Cinema, DoP, Kling, Minimax)
 * para campañas publicitarias, hero scrollytelling y demostraciones de producto.
 */

export interface HiggsfieldGenerationParams {
  prompt: string;
  negativePrompt?: string;
  imageUrl?: string; // Para Image-to-Video (I2V)
  model?: 'soul-cinema' | 'higgsfield-dop' | 'kling-1.5' | 'minimax-video';
  aspectRatio?: '16:9' | '9:16' | '1:1';
  durationSeconds?: 5 | 10;
  cameraMovement?: 'dolly_in' | 'orbit_right' | 'pan_left' | 'crane_up' | 'macro_zoom';
}

export interface HiggsfieldGenerationResponse {
  id: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  videoUrl?: string;
  error?: string;
  progress?: number;
}

export class HiggsfieldClient {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey?: string, baseUrl: string = 'https://api.higgsfield.ai/v1') {
    this.apiKey = apiKey || process.env.HIGGSFIELD_API_KEY || '';
    this.baseUrl = baseUrl;
  }

  /**
   * Crea una nueva tarea de generación de video cinematográfico
   */
  async createVideo(params: HiggsfieldGenerationParams): Promise<HiggsfieldGenerationResponse> {
    if (!this.apiKey) {
      throw new Error(
        'HIGGSFIELD_API_KEY no encontrada. Configúrala en tu archivo .env.local o pásala al constructor.'
      );
    }

    const res = await fetch(`${this.baseUrl}/generations/video`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: params.model || 'soul-cinema',
        prompt: params.prompt,
        negative_prompt:
          params.negativePrompt ||
          'blurry, low quality, distorted, artificial plastic look, text, watermarks, jittery',
        image_url: params.imageUrl,
        aspect_ratio: params.aspectRatio || '16:9',
        duration: params.durationSeconds || 5,
        camera: {
          motion: params.cameraMovement || 'dolly_in',
          speed: 'smooth_slow',
        },
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Error en Higgsfield API (${res.status}): ${errText}`);
    }

    return (await res.json()) as HiggsfieldGenerationResponse;
  }

  /**
   * Consulta el estado de la generación del video
   */
  async checkStatus(generationId: string): Promise<HiggsfieldGenerationResponse> {
    if (!this.apiKey) {
      throw new Error('HIGGSFIELD_API_KEY requerida.');
    }

    const res = await fetch(`${this.baseUrl}/generations/video/${generationId}`, {
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
      },
    });

    if (!res.ok) {
      throw new Error(`Error al consultar estado de Higgsfield: ${res.statusText}`);
    }

    return (await res.json()) as HiggsfieldGenerationResponse;
  }
}

/**
 * Presets cinematográficos de alta fidelidad para La Central del Queso
 */
export const CINEMATIC_FOOD_PRESETS = {
  quesoPalmitoPull: {
    prompt:
      'Cinema commercial 8k, slow motion 60fps macro close up of artisanal Costa Rican string cheese (Queso Palmito) being delicately pulled apart by hands, hot stretchy dairy strands glistening with natural butterfat in warm morning sunlight, rustic wooden table, shallow depth of field, photorealistic food photography, Arri Alexa Mini LF look.',
    cameraMovement: 'macro_zoom' as const,
    aspectRatio: '16:9' as const,
  },
  cavaMaturationAtmosphere: {
    prompt:
      'Atmospheric cinematic camera dolly through a historic artisanal cheese aging cellar, rows of golden wheels on aged cedar shelves, gentle sunbeams cutting through soft cellar dust motes, rich warm shadows, photorealistic, 35mm film grain, masterpiece.',
    cameraMovement: 'dolly_in' as const,
    aspectRatio: '16:9' as const,
  },
  turrialbaDawnFarm: {
    prompt:
      'Breathtaking drone sunrise sweep over the green misty pastures of Turrialba Volcano, dairy cows grazing peacefully in the morning fog, golden sunlight piercing the volcanic mountain ridge, 4k hyperrealistic nature documentary style.',
    cameraMovement: 'crane_up' as const,
    aspectRatio: '16:9' as const,
  },
  cheeseWedgeCut: {
    prompt:
      'Extreme close-up commercial slow-motion cut: a stainless steel artisanal cheese knife smoothly slicing into a golden aged Turrialba cheese wheel, revealing creamy mechanical eyes and curd texture, crumbling gently, warm rim lighting, editorial commercial grade.',
    cameraMovement: 'dolly_in' as const,
    aspectRatio: '16:9' as const,
  },
};

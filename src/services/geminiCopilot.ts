/**
 * geminiCopilot.ts
 *
 * AI Sign Language Copilot Service
 *
 * Buffers detected sign language keywords in real-time.
 * After a configurable silence window (default 1.5s), it calls
 * POST /api/copilot/reconstruct to use Gemini to reconstruct
 * a fluent, context-aware English sentence from the raw keywords.
 */

export type CopilotState = 'idle' | 'buffering' | 'processing' | 'ready';

export interface CopilotResult {
  reconstructedText: string;
  rawKeywords: string[];
  confidence: number;
  aiReconstructed: boolean;
}

export interface CopilotCallbacks {
  /** Called when a new keyword is added to the buffer (show interim "Signing..." state) */
  onBuffering: (keywords: string[]) => void;
  /** Called while waiting for Gemini response */
  onProcessing: () => void;
  /** Called when Gemini returns a reconstructed sentence */
  onResult: (result: CopilotResult) => void;
  /** Called on error */
  onError: (message: string) => void;
}

export class GeminiSignCopilot {
  private keywordBuffer: string[] = [];
  private debounceTimer: ReturnType<typeof setTimeout> | null = null;
  private contextWindow: string[] = []; // last N transcript entries for Gemini context
  private dialect: string = 'ASL';
  private silenceMs: number;
  private callbacks: CopilotCallbacks;
  private state: CopilotState = 'idle';
  private lastKeyword: string = '';

  constructor(callbacks: CopilotCallbacks, silenceMs = 1500) {
    this.callbacks = callbacks;
    this.silenceMs = silenceMs;
  }

  /** Update dialect (ASL, BSL, Auslan, IS) */
  setDialect(dialect: string) {
    this.dialect = dialect;
  }

  /** Update the rolling context window with recent transcript texts */
  setContext(recentEntries: string[]) {
    this.contextWindow = recentEntries.slice(-4); // keep last 4 entries
  }

  /** Push a newly detected sign keyword into the buffer */
  pushKeyword(keyword: string) {
    // Normalise and deduplicate consecutive identical signs
    const normalised = keyword.trim();
    if (!normalised || normalised === 'UNKNOWN' || normalised === 'Signing') return;

    // Skip if same as last to avoid duplicate rapid-fire same gesture
    if (normalised === this.lastKeyword) return;
    this.lastKeyword = normalised;

    this.keywordBuffer.push(normalised);
    this.state = 'buffering';
    this.callbacks.onBuffering([...this.keywordBuffer]);

    // Reset debounce timer every time a new keyword arrives
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    this.debounceTimer = setTimeout(() => {
      this.flushBuffer();
    }, this.silenceMs);
  }

  /** Immediately flush the buffer (e.g. when user ends sign session manually) */
  async flush() {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }
    await this.flushBuffer();
  }

  /** Reset the copilot state without triggering reconstruction */
  reset() {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }
    this.keywordBuffer = [];
    this.lastKeyword = '';
    this.state = 'idle';
  }

  get currentState(): CopilotState {
    return this.state;
  }

  get bufferedKeywords(): string[] {
    return [...this.keywordBuffer];
  }

  private async flushBuffer() {
    if (this.keywordBuffer.length === 0) return;

    const keywords = [...this.keywordBuffer];
    this.keywordBuffer = [];
    this.lastKeyword = '';
    this.state = 'processing';
    this.callbacks.onProcessing();

    try {
      const response = await fetch('/api/copilot/reconstruct', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          signKeywords: keywords,
          context: this.contextWindow,
          dialect: this.dialect,
        }),
      });

      if (!response.ok) {
        throw new Error(`Copilot API returned ${response.status}`);
      }

      const data = await response.json();

      this.state = 'ready';
      this.callbacks.onResult({
        reconstructedText: data.reconstructedText || keywords.join(' '),
        rawKeywords: keywords,
        confidence: data.confidence ?? 0.95,
        aiReconstructed: !data.fallback,
      });
    } catch (err: any) {
      console.error('[GeminiCopilot] Reconstruction error:', err);
      this.state = 'idle';
      // Graceful fallback — emit the raw keywords joined
      const fallback = keywords.join(' ');
      this.callbacks.onError(err.message || 'Reconstruction failed');
      this.callbacks.onResult({
        reconstructedText:
          fallback.charAt(0).toUpperCase() + fallback.slice(1) + '.',
        rawKeywords: keywords,
        confidence: 0.6,
        aiReconstructed: false,
      });
    }
  }
}

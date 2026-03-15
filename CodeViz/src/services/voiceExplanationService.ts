// Voice Explanation Service
// Provides text-to-speech functionality for code explanations

export class VoiceExplanationService {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isSpeaking: boolean = false;

  constructor() {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      this.synth = window.speechSynthesis;
    }
  }

  public speak(text: string, options?: {
    rate?: number;
    pitch?: number;
    volume?: number;
    lang?: string;
  }): void {
    if (!this.synth) {
      console.warn("Speech synthesis not supported");
      return;
    }

    // Stop any current speech
    this.stop();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = options?.rate ?? 0.9;
    utterance.pitch = options?.pitch ?? 1.0;
    utterance.volume = options?.volume ?? 1.0;
    utterance.lang = options?.lang ?? "en-US";

    utterance.onstart = () => {
      this.isSpeaking = true;
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      this.currentUtterance = null;
    };

    utterance.onerror = (error) => {
      console.error("Speech synthesis error:", error);
      this.isSpeaking = false;
      this.currentUtterance = null;
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  public stop(): void {
    if (this.synth && this.isSpeaking) {
      this.synth.cancel();
      this.isSpeaking = false;
      this.currentUtterance = null;
    }
  }

  public pause(): void {
    if (this.synth && this.isSpeaking) {
      this.synth.pause();
    }
  }

  public resume(): void {
    if (this.synth && this.isSpeaking) {
      this.synth.resume();
    }
  }

  public getIsSpeaking(): boolean {
    return this.isSpeaking;
  }

  public getVoices(): SpeechSynthesisVoice[] {
    if (!this.synth) return [];
    return this.synth.getVoices();
  }

  public speakExplanation(
    explanation: string,
    mode: "simplified" | "technical" = "simplified"
  ): void {
    // Clean up explanation text for better speech
    let cleanText = explanation
      .replace(/O\(/g, "Big O of ")
      .replace(/\)/g, "")
      .replace(/n\^/g, "n to the power of ")
      .replace(/\n/g, ". ")
      .replace(/\s+/g, " ")
      .trim();

    // Add mode-specific introduction
    if (mode === "simplified") {
      cleanText = `Here's a simple explanation. ${cleanText}`;
    } else {
      cleanText = `Technical explanation. ${cleanText}`;
    }

    this.speak(cleanText, {
      rate: mode === "simplified" ? 0.85 : 0.95,
      pitch: mode === "simplified" ? 1.1 : 1.0,
    });
  }
}

export const voiceExplanationService = new VoiceExplanationService();


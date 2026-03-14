'use client';

import { useState, useRef, useEffect } from 'react';
import { Mic, Play, Pause, Download, RefreshCw, Loader2, Volume2, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { Voice } from '@/types';

const EXAMPLE_TEXTS = [
  'Welcome to Donk AI — your intelligent voice, chat, and communications platform by Unykorn.',
  'The Solana token launch was successful. Your new token is now live on mainnet with full Metaplex metadata.',
  'Breaking: Decentralized finance continues to reshape global capital allocation at record pace.',
  'Good morning. Your portfolio is up 4.2% today. The Raydium pool has accumulated $12,400 in fees this week.',
];

const FEATURED_VOICES: Voice[] = [
  { voice_id: '21m00Tcm4TlvDq8ikWAM', name: 'Rachel',  category: 'american-female'  },
  { voice_id: 'AZnzlk1XvdvUeBnXmlld', name: 'Domi',    category: 'american-female'  },
  { voice_id: 'EXAVITQu4vr4xnSDxMaL', name: 'Bella',   category: 'american-female'  },
  { voice_id: 'ErXwobaYiN019PkySvjV', name: 'Antoni',  category: 'american-male'    },
  { voice_id: 'MF3mGyEYCl7XYWbV9V6O', name: 'Elli',    category: 'american-female'  },
  { voice_id: 'TxGEqnHWrfWFTfGW9XjX', name: 'Josh',    category: 'american-male'    },
  { voice_id: 'VR6AewLTigWG4xSOukaG', name: 'Arnold',  category: 'american-male'    },
  { voice_id: 'pNInz6obpgDQGcFmaJgB', name: 'Adam',    category: 'american-male'    },
];

export default function VoicePage() {
  const [text, setText]           = useState(EXAMPLE_TEXTS[0]);
  const [voices, setVoices]       = useState<Voice[]>(FEATURED_VOICES);
  const [selectedVoice, setVoice] = useState<Voice>(FEATURED_VOICES[0]);
  const [loading, setLoading]     = useState(false);
  const [playing, setPlaying]     = useState(false);
  const [audioUrl, setAudioUrl]   = useState<string | null>(null);
  const [audioDur, setAudioDur]   = useState<number | null>(null);
  const [error, setError]         = useState<string | null>(null);
  const [credits, setCredits]     = useState<number | null>(null);

  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    // Load full voice list
    fetch('/api/voices')
      .then((r) => r.json())
      .then((d: { ok: boolean; data: { voices: Voice[]; credits: number } }) => {
        if (d.ok && d.data.voices.length > 0) setVoices(d.data.voices);
        if (d.data.credits) setCredits(d.data.credits);
      })
      .catch(() => null);
  }, []);

  const generate = async () => {
    if (!text.trim() || loading) return;
    setLoading(true);
    setError(null);
    setAudioUrl(null);

    try {
      const res = await fetch('/api/speak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voiceId: selectedVoice.voice_id }),
      });

      if (!res.ok) {
        const err = await res.json() as { error?: string };
        throw new Error(err.error ?? `HTTP ${res.status}`);
      }

      const blob   = await res.blob();
      const url    = URL.createObjectURL(blob);
      setAudioUrl(url);

      if (audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.load();
        audioRef.current.onloadedmetadata = () => setAudioDur(audioRef.current!.duration);
        await audioRef.current.play();
        setPlaying(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'TTS failed');
    } finally {
      setLoading(false);
    }
  };

  const togglePlay = () => {
    if (!audioRef.current || !audioUrl) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play();
      setPlaying(true);
    }
  };

  const download = () => {
    if (!audioUrl) return;
    const a = document.createElement('a');
    a.href = audioUrl;
    a.download = `donk-ai-voice-${Date.now()}.mp3`;
    a.click();
  };

  const charCount = text.length;
  const overLimit = charCount > 2000;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent-cyan to-donk-500 flex items-center justify-center">
          <Mic className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-[#e8eaf6]">Voice Synthesis</h1>
          <p className="text-[#7b82b4] text-sm">Powered by ElevenLabs · multilingual_v2 · HD audio</p>
        </div>
        {credits !== null && (
          <div className="ml-auto text-xs text-[#7b82b4] bg-[#111325] border border-[#2a2d4a] rounded-lg px-3 py-1.5">
            {credits.toLocaleString()} chars used
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Text + Generate */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Text to Synthesize</CardTitle>
              <CardDescription>Paste or type any text — AI chat responses, announcements, marketing copy</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={6}
                  placeholder="Enter text to convert to speech…"
                  className={overLimit ? 'border-red-500/60' : ''}
                />
                <div className={`text-right text-xs mt-1 ${overLimit ? 'text-red-400' : 'text-[#7b82b4]'}`}>
                  {charCount}/2000
                </div>
              </div>

              {/* Suggested examples */}
              <div className="space-y-1">
                <p className="text-xs text-[#7b82b4] font-medium">Quick examples:</p>
                <div className="flex flex-wrap gap-1.5">
                  {EXAMPLE_TEXTS.map((ex, i) => (
                    <button
                      key={i}
                      onClick={() => setText(ex)}
                      className="text-xs bg-[#1a1e36] border border-[#2a2d4a] hover:border-accent-cyan/40 text-[#7b82b4] hover:text-accent-cyan px-2 py-1 rounded-lg transition-all"
                    >
                      Example {i + 1}
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-sm text-red-400 flex items-center gap-2">
                  <RefreshCw className="w-4 h-4" />
                  {error}
                </div>
              )}

              {/* Audio player */}
              {audioUrl && (
                <div className="bg-[#0a0b14] border border-accent-cyan/20 rounded-xl px-5 py-4 flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="wave-bar h-5" />
                    <span className="wave-bar h-7" />
                    <span className="wave-bar h-4" />
                    <span className="wave-bar h-7" />
                    <span className="wave-bar h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#e8eaf6]">{selectedVoice.name}</p>
                    <p className="text-xs text-[#7b82b4]">{audioDur ? `${audioDur.toFixed(1)}s` : 'Generated'} · MP3 HD</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={togglePlay}
                      className="w-9 h-9 rounded-full bg-accent-cyan/15 border border-accent-cyan/30 flex items-center justify-center hover:bg-accent-cyan/25 transition-all"
                    >
                      {playing ? <Pause className="w-4 h-4 text-accent-cyan" /> : <Play className="w-4 h-4 text-accent-cyan" />}
                    </button>
                    <button
                      onClick={download}
                      className="w-9 h-9 rounded-full bg-[#1a1e36] border border-[#2a2d4a] flex items-center justify-center hover:border-donk-500/40 transition-all"
                    >
                      <Download className="w-4 h-4 text-[#7b82b4]" />
                    </button>
                  </div>
                </div>
              )}

              <Button
                onClick={generate}
                loading={loading}
                disabled={!text.trim() || overLimit || loading}
                size="lg"
                className="w-full"
              >
                {loading ? (
                  <><Loader2 className="w-4 h-4" /> Synthesizing…</>
                ) : (
                  <><Volume2 className="w-4 h-4" /> Generate Voice Audio</>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right: Voice picker */}
        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Voice Selection</CardTitle>
              <CardDescription>{voices.length} voices available</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
                {voices.slice(0, 30).map((v) => (
                  <button
                    key={v.voice_id}
                    onClick={() => setVoice(v)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl border transition-all flex items-center gap-2 ${
                      selectedVoice.voice_id === v.voice_id
                        ? 'bg-accent-cyan/10 border-accent-cyan/40 text-accent-cyan'
                        : 'bg-[#0a0b14] border-[#2a2d4a] text-[#7b82b4] hover:border-accent-cyan/30 hover:text-[#e8eaf6]'
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                      selectedVoice.voice_id === v.voice_id ? 'bg-accent-cyan/20' : 'bg-[#1a1e36]'
                    }`}>
                      {v.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-medium truncate">{v.name}</div>
                      {v.category && (
                        <div className="text-xs opacity-60 truncate">{v.category}</div>
                      )}
                    </div>
                    {selectedVoice.voice_id === v.voice_id && (
                      <Star className="w-3.5 h-3.5 ml-auto shrink-0 fill-accent-cyan text-accent-cyan" />
                    )}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <audio
        ref={audioRef}
        onEnded={() => setPlaying(false)}
        onPause={() => setPlaying(false)}
        onPlay={() => setPlaying(true)}
      />
    </div>
  );
}

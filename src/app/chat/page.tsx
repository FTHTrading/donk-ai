'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Brain, Send, Volume2, VolumeX, Loader2, RefreshCw, Copy, Check, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/input';
import { cn, nanoid, formatTimestamp } from '@/lib/utils';
import { useWallet } from '@solana/wallet-adapter-react';
import type { ChatMessage } from '@/types';

const SUGGESTED = [
  'Explain Solana tokenomics in simple terms',
  'Write a professional cold email for FTH Trading',
  'What is the Unykorn governance model?',
  'Draft 5 SMS templates for a token launch campaign',
  'Analyze the risks of yield farming on Raydium',
  'Generate a compliance-friendly token description for Kuwait',
];

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [voice, setVoice]       = useState(false);
  const [copied, setCopied]     = useState<string | null>(null);
  const [error, setError]       = useState<string | null>(null);
  const { publicKey } = useWallet();

  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const audioRef    = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = useCallback(async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || loading) return;

    setInput('');
    setError(null);

    const userMsg: ChatMessage = { id: nanoid(), role: 'user', content, timestamp: Date.now() };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(publicKey && { 'X-Wallet-Address': publicKey.toBase58() }),
        },
        body: JSON.stringify({
          messages: [...messages, userMsg].map(({ role, content: c }) => ({ role, content: c })),
          voice,
        }),
      });

      const data = await res.json() as { ok: boolean; data?: { id: string; content: string; audioUrl?: string }; error?: string };

      if (!data.ok || !data.data) {
        throw new Error(data.error ?? 'Unknown error');
      }

      const assistantMsg: ChatMessage = {
        id:        data.data.id,
        role:      'assistant',
        content:   data.data.content,
        timestamp: Date.now(),
        audioUrl:  data.data.audioUrl,
      };

      setMessages((prev) => [...prev, assistantMsg]);

      // Auto-play audio if voice mode is on
      if (data.data.audioUrl && audioRef.current) {
        audioRef.current.src = data.data.audioUrl;
        audioRef.current.play().catch(() => null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get response');
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages, voice, publicKey]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const copyMsg = (id: string, content: string) => {
    navigator.clipboard.writeText(content).then(() => {
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 flex flex-col" style={{ height: 'calc(100vh - 8rem)' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-donk-500 to-accent-purple flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-[#e8eaf6]">AI Chat</h1>
            <p className="text-xs text-[#7b82b4]">GPT-4o · Context-aware · Markdown</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Voice toggle */}
          <button
            onClick={() => setVoice((v) => !v)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border',
              voice
                ? 'bg-accent-cyan/15 border-accent-cyan/40 text-accent-cyan'
                : 'bg-[#1a1e36] border-[#2a2d4a] text-[#7b82b4] hover:text-[#e8eaf6]'
            )}
            title="Toggle voice responses"
          >
            {voice ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            {voice ? 'Voice On' : 'Voice Off'}
          </button>
          <button
            onClick={() => setMessages([])}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs bg-[#1a1e36] border border-[#2a2d4a] text-[#7b82b4] hover:text-red-400 hover:border-red-500/40 transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear
          </button>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto space-y-4 pb-4 pr-1">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full space-y-6 pt-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-donk-500 to-accent-purple flex items-center justify-center animate-pulse-slow">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-xl font-bold text-[#e8eaf6]">Hey, I&apos;m Donk AI</h2>
              <p className="text-[#7b82b4] text-sm max-w-sm">GPT-4o powered. Ask me anything — analysis, writing, crypto, code, strategy.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-lg w-full">
              {SUGGESTED.map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="text-left text-xs bg-[#111325] border border-[#2a2d4a] hover:border-donk-500/40 text-[#7b82b4] hover:text-[#e8eaf6] px-3 py-2.5 rounded-xl transition-all"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn('flex gap-3 group', msg.role === 'user' ? 'justify-end' : 'justify-start')}
          >
            {msg.role === 'assistant' && (
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-donk-500 to-accent-purple flex items-center justify-center shrink-0 mt-0.5">
                <Brain className="w-3.5 h-3.5 text-white" />
              </div>
            )}
            <div className={cn('max-w-[80%] space-y-1', msg.role === 'user' ? 'items-end' : 'items-start')}>
              <div
                className={cn(
                  'rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap break-words',
                  msg.role === 'user'
                    ? 'bg-donk-500/20 border border-donk-500/30 text-[#e8eaf6] rounded-br-sm'
                    : 'bg-[#111325] border border-[#2a2d4a] text-[#e8eaf6] rounded-bl-sm'
                )}
              >
                {msg.content}
              </div>
              <div className="flex items-center gap-2 px-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-xs text-[#7b82b4]">{formatTimestamp(msg.timestamp)}</span>
                <button onClick={() => copyMsg(msg.id, msg.content)} className="text-[#7b82b4] hover:text-donk-400 transition-colors">
                  {copied === msg.id ? <Check className="w-3 h-3 text-accent-green" /> : <Copy className="w-3 h-3" />}
                </button>
                {msg.audioUrl && (
                  <button
                    onClick={() => {
                      if (audioRef.current) { audioRef.current.src = msg.audioUrl!; audioRef.current.play(); }
                    }}
                    className="text-[#7b82b4] hover:text-accent-cyan transition-colors"
                  >
                    <Volume2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 justify-start">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-donk-500 to-accent-purple flex items-center justify-center shrink-0">
              <Brain className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="bg-[#111325] border border-[#2a2d4a] rounded-2xl rounded-bl-sm px-4 py-3">
              <div className="flex items-center gap-1.5">
                <span className="wave-bar h-4" />
                <span className="wave-bar h-5" />
                <span className="wave-bar h-3" />
                <span className="wave-bar h-5" />
                <span className="wave-bar h-4" />
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-sm text-red-400 flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            {error}
            <button onClick={() => setError(null)} className="ml-auto text-red-300 hover:text-red-200">✕</button>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-[#2a2d4a] pt-4">
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message Donk AI… (Enter to send, Shift+Enter for newline)"
              rows={1}
              className="min-h-[44px] max-h-40 overflow-y-auto"
            />
          </div>
          <Button
            onClick={() => sendMessage()}
            loading={loading}
            disabled={!input.trim() || loading}
            size="md"
            className="shrink-0 h-[44px] px-4"
          >
            {loading ? <Loader2 className="w-4 h-4" /> : <Send className="w-4 h-4" />}
          </Button>
        </div>
        <p className="text-xs text-[#7b82b4] mt-2 text-center">
          GPT-4o · {voice ? '🔊 Voice responses ON (ElevenLabs)' : '🔇 Voice responses OFF'} · Rate limited
        </p>
      </div>

      {/* Hidden audio player */}
      <audio ref={audioRef} className="hidden" />
    </div>
  );
}

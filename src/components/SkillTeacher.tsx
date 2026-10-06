import React, { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { FileDown, GraduationCap, Loader2, Mic, Music, RotateCcw, Send, Square, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChatMessage, streamTeacher, synthesize, transcribe } from '@/lib/teacher-api';
import { downloadLessonPdf } from '@/lib/lesson-pdf';

const STORAGE_KEY = 'learn-any-skill-teacher-chat';
const CHATGPT_URL = 'https://chatgpt.com/g/g-677690e9535c81919b3acbd5ec088644-learn-any-skill-gpt';
const starters = ['Teach me guitar from zero', 'I want to learn Python for data analysis', 'Help me get better at public speaking'];

function loadMessages(): ChatMessage[] {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]'); } catch { return []; }
}

const SkillTeacher: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(loadMessages);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [recording, setRecording] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [audioState, setAudioState] = useState<{ index: number; label: string } | null>(null);
  const [autoSpeak, setAutoSpeak] = useState(false);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCache = useRef<Map<string, Blob>>(new Map());
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!busy) localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages, busy]);

  const getAudio = async (index: number, content: string) => {
    const cached = audioCache.current.get(content);
    if (cached) return cached;
    const blob = await synthesize(content, (done, total) => setAudioState({ index, label: total > 1 ? `Preparing voice ${done}/${total}…` : 'Preparing voice…' }));
    audioCache.current.set(content, blob);
    return blob;
  };

  const stopAudio = () => {
    audioRef.current?.pause();
    audioRef.current = null;
    setAudioState(null);
  };

  const speak = async (index: number, content: string) => {
    if (audioState?.index === index) return stopAudio();
    stopAudio();
    setError('');
    setAudioState({ index, label: 'Preparing voice…' });
    try {
      const blob = await getAudio(index, content);
      const audio = new Audio(URL.createObjectURL(blob));
      audioRef.current = audio;
      audio.onended = () => setAudioState(null);
      setAudioState({ index, label: 'Stop' });
      await audio.play();
    } catch (caught) {
      setAudioState(null);
      setError(caught instanceof Error ? caught.message : 'Could not read this aloud.');
    }
  };

  const downloadAudio = async (index: number, content: string) => {
    setError('');
    setAudioState({ index, label: 'Preparing audio…' });
    try {
      const blob = await getAudio(index, content);
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'learn-any-skill-lesson.wav';
      link.click();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Audio download failed.');
    } finally {
      setAudioState(null);
    }
  };

  const send = async (text: string) => {
    const content = text.trim();
    if (!content || busy) return;
    setError('');
    setInput('');
    const history: ChatMessage[] = [...messages, { role: 'user', content }];
    setMessages([...history, { role: 'assistant', content: '' }]);
    setBusy(true);
    let reply = '';
    try {
      await streamTeacher(history, (delta) => {
        reply += delta;
        setMessages([...history, { role: 'assistant', content: reply }]);
      });
      if (autoSpeak && reply) void speak(history.length, reply);
    } catch (caught) {
      setMessages(reply ? [...history, { role: 'assistant', content: reply }] : history);
      setError(caught instanceof Error ? caught.message : 'The teacher could not reply.');
    } finally {
      setBusy(false);
      inputRef.current?.focus();
    }
  };

  const toggleRecording = async () => {
    if (recording) return recorderRef.current?.stop();
    setError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const parts: Blob[] = [];
      recorder.ondataavailable = (e) => e.data.size && parts.push(e.data);
      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        setRecording(false);
        setTranscribing(true);
        try {
          const text = await transcribe(new Blob(parts, { type: recorder.mimeType || 'audio/webm' }));
          if (text) setInput((prev) => (prev ? `${prev} ${text}` : text));
          else setError("We couldn't hear anything. Please try again.");
        } catch (caught) {
          setError(caught instanceof Error ? caught.message : 'Voice input failed.');
        } finally {
          setTranscribing(false);
          inputRef.current?.focus();
        }
      };
      recorderRef.current = recorder;
      recorder.start();
      setRecording(true);
    } catch {
      setError('Please allow microphone access to talk to your teacher.');
    }
  };

  const reset = () => {
    stopAudio();
    setMessages([]);
    setError('');
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <section id="ai-teacher" className="py-14 sm:py-20" aria-labelledby="ai-teacher-heading">
      <div className="section-container py-0">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6 text-center">
            <span className="chip mb-4"><GraduationCap className="mr-2 h-4 w-4" aria-hidden="true" />AI teacher (INSITE version)</span>
            <h2 id="ai-teacher-heading" className="heading mb-3 text-3xl text-foreground sm:text-4xl">Learn any skill right here</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">Type or speak what you want to learn. Your teacher builds a step-by-step path, can read every lesson aloud, and lets you download classes as a PDF or audio file.</p>
          </div>

          <div className="overflow-hidden rounded-md border border-border bg-background shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-secondary/40 px-4 py-2">
              <label className="flex items-center gap-2 text-sm text-foreground">
                <input type="checkbox" checked={autoSpeak} onChange={(e) => setAutoSpeak(e.target.checked)} className="h-4 w-4 accent-primary" />
                Read replies aloud automatically
              </label>
              {messages.length > 0 && (
                <Button type="button" variant="ghost" size="sm" onClick={reset} disabled={busy}><RotateCcw className="h-4 w-4" aria-hidden="true" />New class</Button>
              )}
            </div>

            <div ref={listRef} className="h-[55vh] min-h-[320px] space-y-4 overflow-y-auto p-4 sm:h-[480px]" aria-live="polite">
              {messages.length === 0 && (
                <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
                  <GraduationCap className="h-12 w-12 text-primary" aria-hidden="true" />
                  <p className="font-medium text-foreground">What do you want to learn today?</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {starters.map((s) => (
                      <Button key={s} type="button" variant="outline" size="sm" className="h-auto whitespace-normal py-2" onClick={() => send(s)}>{s}</Button>
                    ))}
                  </div>
                </div>
              )}
              {messages.map((m, i) => m.role === 'user' ? (
                <div key={i} className="ml-auto max-w-[85%] whitespace-pre-wrap break-words rounded-md bg-primary px-4 py-2 text-primary-foreground">{m.content}</div>
              ) : (
                <div key={i} className="min-w-0 max-w-full">
                  {m.content ? (
                    <div className="prose prose-sm max-w-none break-words text-foreground [&_*]:text-inherit"><ReactMarkdown>{m.content}</ReactMarkdown></div>
                  ) : (
                    <p className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />Your teacher is preparing the lesson…</p>
                  )}
                  {m.content && !(busy && i === messages.length - 1) && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Button type="button" variant="outline" size="sm" onClick={() => speak(i, m.content)} disabled={!!audioState && audioState.index !== i}>
                        {audioState?.index === i ? (audioState.label === 'Stop' ? <Square className="h-4 w-4" /> : <Loader2 className="h-4 w-4 animate-spin" />) : <Volume2 className="h-4 w-4" />}
                        {audioState?.index === i ? audioState.label : 'Listen'}
                      </Button>
                      <Button type="button" variant="outline" size="sm" onClick={() => downloadLessonPdf(m.content)}><FileDown className="h-4 w-4" />PDF</Button>
                      <Button type="button" variant="outline" size="sm" onClick={() => downloadAudio(i, m.content)} disabled={!!audioState}><Music className="h-4 w-4" />Audio</Button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {error && (
              <div className="mx-4 mb-2 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive" role="alert">
                {error}{' '}
                <a href={CHATGPT_URL} target="_blank" rel="noopener noreferrer" className="font-semibold underline">Try the CHATGPT version</a>
              </div>
            )}

            <form className="flex items-end gap-2 border-t border-border p-3" onSubmit={(e) => { e.preventDefault(); send(input); }}>
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input); } }}
                rows={2}
                maxLength={4000}
                aria-label="Message your teacher"
                placeholder={recording ? 'Listening… tap stop when done' : transcribing ? 'Turning your voice into text…' : 'Tell your teacher what you want to learn'}
                className="min-w-0 flex-1 resize-none rounded-md border border-input bg-background px-3 py-2 text-base text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
              />
              <Button type="button" size="icon" variant={recording ? 'destructive' : 'outline'} onClick={toggleRecording} disabled={transcribing || busy} aria-label={recording ? 'Stop recording' : 'Speak your message'} className="h-11 w-11 shrink-0">
                {transcribing ? <Loader2 className="h-5 w-5 animate-spin" /> : recording ? <Square className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </Button>
              <Button type="submit" size="icon" disabled={!input.trim() || busy} aria-label="Send message" className="h-11 w-11 shrink-0">
                {busy ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillTeacher;

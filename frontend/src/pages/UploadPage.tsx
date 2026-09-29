import { useState } from 'react';
import { CheckCircle2, FileText, UploadCloud } from 'lucide-react';
import UploadDropzone from '../components/UploadDropzone';
import { uploadResume } from '../services/resumeService';

const recentFiles = [
  { name: 'Resume_V2.pdf', date: '2 hours ago', score: 82 },
  { name: 'Portfolio.docx', date: 'Apr 28, 2026', score: 75 },
  { name: 'CareerBrief.txt', date: 'Mar 15, 2026', score: 68 },
];

export default function UploadPage() {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState('');

  const handleFileSelect = async (file: File) => {
    setSelectedFile(file);
    setUploadError('');
    setUploadProgress(10);
    setUploading(true);

    try {
      await uploadResume(file);
      setUploadProgress(100);
    } catch (error) {
      setUploadProgress(0);
      setUploadError(error instanceof Error ? error.message : 'Unable to upload resume.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-6 rounded-[32px] border border-white/10 bg-surface2/90 p-8 shadow-glow sm:grid-cols-[1fr_0.9fr]">
        <div>
          <p className="text-sm uppercase tracking-[0.32em] text-cyan-300/80">Resume upload</p>
          <h1 className="mt-3 text-4xl font-semibold text-white">Upload a resume and get instant feedback.</h1>
          <p className="mt-4 max-w-2xl text-slate-300">Use the drag-and-drop upload area to add your current resume, then review insights in the AI intelligence dashboard.</p>
        </div>
        <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
          <p className="text-sm uppercase tracking-[0.32em] text-slate-500">Supported formats</p>
          <div className="mt-4 flex flex-wrap gap-3">
            {['PDF', 'DOCX', 'TXT', 'MD'].map((item) => (
              <span key={item} className="rounded-full border border-white/10 bg-surface/90 px-4 py-2 text-sm text-slate-200">
                {item}
              </span>
            ))}
          </div>
          <div className="mt-6 rounded-[28px] border border-white/10 bg-surface/80 p-5 text-sm text-slate-300">
            <div className="flex items-center gap-3 text-cyan-200">
              <UploadCloud className="h-5 w-5" />
              <span>Fast parsing and AI resume scoring</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.3fr_0.9fr]">
        <div className="space-y-6">
          <UploadDropzone onSelect={handleFileSelect} />
          <div className="rounded-[32px] border border-white/10 bg-surface2/90 p-7 shadow-glow">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.32em] text-slate-500">Upload progress</p>
                <p className="mt-2 text-3xl font-semibold text-white">{uploadProgress}%</p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-3xl bg-cyan-400/10 px-4 py-3 text-sm text-cyan-200">
                <CheckCircle2 className="h-4 w-4" />
                Intelligent parsing
              </div>
            </div>
            <div className="mt-6 h-3 rounded-full bg-white/10">
              <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 transition-all duration-500" style={{ width: `${uploadProgress}%` }} />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[32px] border border-white/10 bg-surface2/90 p-7 shadow-glow">
            <p className="text-sm uppercase tracking-[0.32em] text-slate-500">Resume preview</p>
            <div className="mt-6 rounded-[28px] bg-surface/90 p-5">
              <div className="flex items-center justify-between text-sm text-slate-400">
                <div>
                  <p className="font-semibold text-white">Resume_V2.pdf</p>
                  <p className="mt-1">3.2 MB • Uploaded 10 sec ago</p>
                </div>
                <span className="rounded-full bg-white/5 px-3 py-2 text-xs uppercase tracking-[0.36em] text-slate-300">AI ready</span>
              </div>
              <div className="mt-6 space-y-3 text-sm text-slate-300">
                <p>Latest roles: Product Engineering Intern, Frontend Developer</p>
                <p>Top detected keywords: React, TypeScript, UX, API design, collaboration</p>
              </div>
            </div>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-surface2/90 p-7 shadow-glow">
            <p className="text-sm uppercase tracking-[0.32em] text-slate-500">Recent uploads</p>
            <div className="mt-6 space-y-4">
              {recentFiles.map((item) => (
                <div key={item.name} className="flex items-center justify-between rounded-3xl bg-surface/80 p-4 text-sm">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-cyan-300" />
                    <div>
                      <p className="font-medium text-white">{item.name}</p>
                      <p className="text-slate-400">{item.date}</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-200">Score {item.score}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

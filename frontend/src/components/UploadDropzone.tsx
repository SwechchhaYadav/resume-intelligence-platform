import { ChangeEvent, useRef } from 'react';
import { CloudUpload } from 'lucide-react';

interface UploadDropzoneProps {
  onSelect?: (file: File) => void;
}

export default function UploadDropzone({ onSelect }: UploadDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChooseFile = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    onSelect?.(file);
    event.target.value = '';
  };

  return (
    <div className="rounded-[32px] border border-dashed border-white/15 bg-white/5 p-8 text-center text-slate-300 shadow-glow">
      <CloudUpload className="mx-auto mb-5 h-12 w-12 text-cyan-300" />
      <h2 className="text-xl font-semibold text-white">Drag and drop your resume</h2>
      <p className="mt-3 max-w-xl mx-auto text-sm text-slate-400">Upload PDF, DOCX, TXT or Markdown files and get a fast career analysis. Our AI preserves formatting and keywords.</p>
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
        onChange={handleFileChange}
        className="hidden"
      />
      <button
        type="button"
        onClick={handleChooseFile}
        className="mt-6 inline-flex rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[1.01]"
      >
        Choose file
      </button>
    </div>
  );
}

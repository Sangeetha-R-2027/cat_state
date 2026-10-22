import React, { useState } from 'react';
import {
  Upload,
  FileText,
  X,
  CheckCircle2,
  AlertCircle,
  FileCode,
  Image,
  Eye,
  Trash2,
  Sparkles,
  Paperclip
} from 'lucide-react';
import { DocumentItem } from '../types';
import { analyzeDocument } from '../services/aiService';

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAttachDocument: (doc: DocumentItem) => void;
  currentDoc?: DocumentItem;
}

export const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({
  isOpen,
  onClose,
  onAttachDocument,
  currentDoc
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [selectedSample, setSelectedSample] = useState<'lecture' | 'custom' | null>(null);
  const [previewDoc, setPreviewDoc] = useState<DocumentItem | null>(currentDoc || null);

  if (!isOpen) return null;

  const SAMPLE_NOTES = `LECTURE 4: DYNAMIC DATA STRUCTURES & POINTER ARITHMETIC
Instructor: Dr. Vance, CS Department

1. MEMORY ARCHITECTURE REVIEW
Stack: Local variables, fast automatic cleanup, limited size.
Heap: Explicit allocation via malloc/calloc. Programmer responsible for free().
Pointer: A variable holding the 64-bit virtual address of another variable in RAM.

2. LINKED LIST POINTER REASSIGNMENT
struct Node {
    int val;
    struct Node* next;
};

Safe Insertion Invariant:
new_node->next = head; // 1. Bridge anchored first!
head = new_node;       // 2. Head updated safely!

3. EXAM WARNINGS
- Dereferencing NULL (0x0) crashes with SIGSEGV.
- Never call free(temp) before saving temp->next.`;

  const handleLoadSample = () => {
    const doc = analyzeDocument('Lecture_04_Pointers_and_Nodes.txt', SAMPLE_NOTES);
    setPreviewDoc(doc);
    setSelectedSample('lecture');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = (event.target?.result as string) || `Extracted text from ${file.name}.`;
      const doc = analyzeDocument(file.name, text);
      setPreviewDoc(doc);
    };
    reader.readAsText(file);
  };

  const handleConfirm = () => {
    if (previewDoc) {
      onAttachDocument(previewDoc);
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '780px', maxHeight: '90vh' }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--border-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--bg-surface)'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '6px',
                  backgroundColor: 'var(--accent-subtle)',
                  color: 'var(--accent-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Paperclip size={16} />
              </div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Optional Study Material & Notes Grounding
              </h2>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Upload PDFs, handwritten notes, or documents. The AI grounds lessons and questions strictly in your sources.
            </p>
          </div>

          <button onClick={onClose} className="btn-ghost" style={{ padding: '6px' }}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '24px', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Optional Reassurance Note */}
          <div
            style={{
              padding: '10px 14px',
              backgroundColor: 'var(--accent-subtle)',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.78rem',
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Sparkles size={16} color="var(--accent-primary)" style={{ flexShrink: 0 }} />
            <span>
              <strong>Note:</strong> Uploads are completely optional. You can learn any concept without uploading any files.
            </span>
          </div>

          {/* Dropzone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              const file = e.dataTransfer.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                  const text = (event.target?.result as string) || `Extracted text from ${file.name}.`;
                  const doc = analyzeDocument(file.name, text);
                  setPreviewDoc(doc);
                };
                reader.readAsText(file);
              }
            }}
            style={{
              border: dragOver ? '2px dashed var(--accent-primary)' : '2px dashed var(--border-medium)',
              borderRadius: 'var(--radius-lg)',
              padding: '32px 20px',
              textAlign: 'center',
              backgroundColor: dragOver ? 'var(--accent-subtle)' : 'var(--bg-subtle)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px'
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: 'var(--bg-surface)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--shadow-sm)',
                color: 'var(--accent-primary)'
              }}
            >
              <Upload size={22} />
            </div>

            <div>
              <div style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                Drag and drop your study materials here
              </div>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Supports PDF, DOCX, TXT, and photos of handwritten notes (OCR simulated/grounded)
              </div>
            </div>

            <label className="btn-secondary" style={{ fontSize: '0.82rem', padding: '7px 16px', cursor: 'pointer' }}>
              <span>Browse Files from Device</span>
              <input type="file" accept=".pdf,.txt,.docx,image/*" onChange={handleFileUpload} style={{ display: 'none' }} />
            </label>
          </div>

          {/* Sample Academic Materials Quick-Load */}
          <div>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '10px' }}>
              Or Load Curated Academic Course Material:
            </div>
            <button
              onClick={handleLoadSample}
              className="card"
              style={{
                width: '100%',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                textAlign: 'left',
                border: previewDoc?.name.includes('Lecture_04') ? '1.5px solid var(--accent-primary)' : '1px solid var(--border-light)',
                backgroundColor: previewDoc?.name.includes('Lecture_04') ? 'var(--accent-subtle)' : 'var(--bg-surface)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FileText size={20} color="var(--accent-primary)" />
                <div>
                  <div style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    Lecture_04_Pointers_and_Nodes.txt
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    Official CS lecture notes covering stack vs heap, pointer assignment order, and SIGSEGV traps.
                  </div>
                </div>
              </div>
              <span className="badge badge-primary" style={{ fontSize: '0.68rem' }}>
                Load Sample
              </span>
            </button>
          </div>

          {/* Document Preview & Extracted Concepts */}
          {previewDoc && (
            <div
              className="card"
              style={{
                padding: '18px',
                backgroundColor: 'var(--bg-surface)',
                border: '1.5px solid var(--success-border)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={18} color="var(--success)" />
                  <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    Document Ready for Grounding: {previewDoc.name}
                  </span>
                </div>
                <button
                  onClick={() => setPreviewDoc(null)}
                  className="btn-ghost"
                  style={{ color: 'var(--danger)', padding: '4px' }}
                  title="Remove document"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                {previewDoc.summary}
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {previewDoc.keyConcepts.map((c, i) => (
                  <span key={i} className="badge badge-neutral" style={{ fontSize: '0.68rem' }}>
                    {c}
                  </span>
                ))}
              </div>

              {/* Text snippet preview */}
              <div style={{ maxHeight: '120px', overflowY: 'auto', padding: '10px', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)', fontSize: '0.74rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                {previewDoc.extractedText.slice(0, 400)}...
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div
          style={{
            padding: '16px 24px',
            borderTop: '1px solid var(--border-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--bg-surface)'
          }}
        >
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {previewDoc ? 'Document will be linked to active course topic.' : 'No document attached.'}
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={onClose} className="btn-secondary" style={{ fontSize: '0.84rem' }}>
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={!previewDoc}
              className="btn-primary"
              style={{ fontSize: '0.84rem', opacity: previewDoc ? 1 : 0.5 }}
            >
              <span>Attach & Ground Lessons</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

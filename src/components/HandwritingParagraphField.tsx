import { useRef } from 'react'

interface HandwritingParagraphFieldProps {
  text: string
  imageDataUrl: string | null
  onTextChange: (text: string) => void
  onImageChange: (dataUrl: string | null) => void
}

function readImageFile(file: File, onLoad: (dataUrl: string) => void) {
  const reader = new FileReader()
  reader.onload = () => {
    if (typeof reader.result === 'string') onLoad(reader.result)
  }
  reader.readAsDataURL(file)
}

function imageFromClipboard(e: React.ClipboardEvent): File | null {
  const items = e.clipboardData?.items
  if (!items) return null
  for (const item of items) {
    if (item.type.startsWith('image/')) {
      return item.getAsFile()
    }
  }
  return null
}

export function HandwritingParagraphField({
  text,
  imageDataUrl,
  onTextChange,
  onImageChange,
}: HandwritingParagraphFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  function applyImage(file: File) {
    readImageFile(file, (dataUrl) => {
      onImageChange(dataUrl)
      onTextChange('')
    })
  }

  function handlePaste(e: React.ClipboardEvent) {
    const file = imageFromClipboard(e)
    if (!file) return
    e.preventDefault()
    applyImage(file)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    const file = [...e.dataTransfer.files].find((f) => f.type.startsWith('image/'))
    if (file) applyImage(file)
  }

  function useTextInstead() {
    onImageChange(null)
  }

  if (imageDataUrl) {
    return (
      <div className="handwriting-paragraph-field handwriting-paragraph-field--image">
        <img
          src={imageDataUrl}
          alt="Handwriting paragraph"
          className="handwriting-paragraph-field__preview"
        />
        <div className="handwriting-paragraph-field__actions">
          <button type="button" className="btn-secondary text-sm" onClick={useTextInstead}>
            Use text instead
          </button>
          <button type="button" className="btn-secondary text-sm" onClick={() => onImageChange(null)}>
            Remove image
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      className="handwriting-paragraph-field"
      onPaste={handlePaste}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      <textarea
        rows={6}
        className="teacher-editor__textarea handwriting-paragraph-field__textarea"
        placeholder="Type the handwriting paragraph here…"
        value={text}
        onChange={(e) => onTextChange(e.target.value)}
        onPaste={handlePaste}
      />
      <div className="handwriting-paragraph-field__footer">
        <button
          type="button"
          className="btn-secondary text-sm"
          onClick={() => fileInputRef.current?.click()}
        >
          Choose image…
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) applyImage(file)
            e.target.value = ''
          }}
        />
      </div>
    </div>
  )
}

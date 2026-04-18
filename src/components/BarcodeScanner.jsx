/**
 * BarcodeScanner
 *
 * Full-screen modal with two modes:
 *   - Camera: live scan via @zxing/browser
 *   - Upload: decode a barcode from a photo file
 *
 * Calls onDetected(barcode) when a code is read, onClose to dismiss.
 */
import { useEffect, useRef, useState } from 'react'
import { BrowserMultiFormatReader } from '@zxing/browser'
import { NotFoundException } from '@zxing/library'

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

const UploadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
    <circle cx="8.5" cy="8.5" r="1.5"/>
    <polyline points="21 15 16 10 5 21"/>
  </svg>
)

const CameraIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
    <circle cx="12" cy="13" r="4"/>
  </svg>
)

export default function BarcodeScanner({ onDetected, onClose }) {
  const [mode, setMode] = useState('camera') // 'camera' | 'upload'
  const videoRef    = useRef(null)
  const fileRef     = useRef(null)
  const detectedRef = useRef(false)
  const [status, setStatus]         = useState('Requesting camera…')
  const [cameraError, setCameraError] = useState(null)
  const [uploadState, setUploadState] = useState(null) // null | 'loading' | 'error' | { preview, barcode }

  // ── Camera mode ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (mode !== 'camera') return
    detectedRef.current = false

    const reader = new BrowserMultiFormatReader()

    reader
      .decodeFromVideoDevice(undefined, videoRef.current, (result, err) => {
        if (detectedRef.current) return
        if (result) {
          detectedRef.current = true
          setStatus('Barcode detected!')
          onDetected(result.getText())
          return
        }
        if (err && !(err instanceof NotFoundException)) {
          console.warn('Scanner error:', err)
        }
      })
      .then(() => setStatus('Point camera at a barcode'))
      .catch((err) => {
        console.error('Camera error:', err)
        setCameraError(
          err.name === 'NotAllowedError'
            ? 'Camera permission denied. Please allow camera access and try again.'
            : 'Could not access camera. Make sure no other app is using it.'
        )
      })

    return () => {
      BrowserMultiFormatReader.releaseAllStreams()
    }
  }, [mode, onDetected])

  // ── Upload mode ───────────────────────────────────────────────────────────
  async function handleFileChange(e) {
    const file = e.target.files?.[0]
    if (!file) return

    const previewUrl = URL.createObjectURL(file)
    setUploadState('loading')

    try {
      const reader = new BrowserMultiFormatReader()
      const result = await reader.decodeFromImageUrl(previewUrl)
      setUploadState({ preview: previewUrl, barcode: result.getText() })
      detectedRef.current = true
      onDetected(result.getText())
    } catch (err) {
      console.warn('Upload decode error:', err)
      setUploadState({ preview: previewUrl, barcode: null })
    }
  }

  // ── Shared header ─────────────────────────────────────────────────────────
  const header = (
    <div className="flex items-center justify-between px-space-lg py-space-md flex-shrink-0">
      {/* Mode toggle */}
      <div className="flex gap-space-xs bg-white/10 rounded-radius-sm p-space-3xs">
        <button
          onClick={() => { setMode('camera'); setCameraError(null); setUploadState(null) }}
          className={`flex items-center gap-space-xs px-space-sm py-space-xs rounded-radius-xs text-small font-medium transition-colors duration-150 ${
            mode === 'camera' ? 'bg-white text-neutral-900' : 'text-white/70 hover:text-white'
          }`}
        >
          <CameraIcon />
          Camera
        </button>
        <button
          onClick={() => { setMode('upload'); BrowserMultiFormatReader.releaseAllStreams() }}
          className={`flex items-center gap-space-xs px-space-sm py-space-xs rounded-radius-xs text-small font-medium transition-colors duration-150 ${
            mode === 'upload' ? 'bg-white text-neutral-900' : 'text-white/70 hover:text-white'
          }`}
        >
          <UploadIcon />
          Upload
        </button>
      </div>

      <button
        onClick={onClose}
        aria-label="Close scanner"
        className="text-white/70 hover:text-white transition-colors duration-150"
      >
        <CloseIcon />
      </button>
    </div>
  )

  // ── Camera view ───────────────────────────────────────────────────────────
  if (mode === 'camera') {
    return (
      <div className="fixed inset-0 z-50 bg-neutral-900 flex flex-col">
        {header}

        <div className="flex-1 relative overflow-hidden flex items-center justify-center">
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            playsInline
            muted
          />

          {!cameraError && (
            <div className="relative z-10 w-64 h-40 sm:w-80 sm:h-48">
              {[
                'top-0 left-0 border-t-2 border-l-2',
                'top-0 right-0 border-t-2 border-r-2',
                'bottom-0 left-0 border-b-2 border-l-2',
                'bottom-0 right-0 border-b-2 border-r-2',
              ].map((cls, i) => (
                <span key={i} className={`absolute w-6 h-6 border-white/80 ${cls}`} />
              ))}
              <div className="absolute inset-x-0 top-1/2 h-px bg-primary/80 animate-pulse" />
            </div>
          )}

          {cameraError && (
            <div className="relative z-10 mx-space-xl text-center">
              <p className="text-body text-white/80">{cameraError}</p>
            </div>
          )}
        </div>

        <div className="flex-shrink-0 px-space-lg py-space-lg text-center">
          {!cameraError && <p className="text-small text-white/60">{status}</p>}
          <button onClick={onClose} className="mt-space-md text-small font-medium text-white/70 hover:text-white underline">
            Cancel
          </button>
        </div>
      </div>
    )
  }

  // ── Upload view ───────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-50 bg-neutral-900 flex flex-col">
      {header}

      <div className="flex-1 flex flex-col items-center justify-center gap-space-xl px-space-xl">

        {/* File drop / tap zone */}
        {!uploadState && (
          <button
            onClick={() => fileRef.current?.click()}
            className="
              flex flex-col items-center gap-space-md
              w-full max-w-sm
              border-2 border-dashed border-white/30
              rounded-radius-lg
              p-space-3xl
              text-white/70 hover:text-white hover:border-white/60
              transition-colors duration-150
            "
          >
            <UploadIcon />
            <span className="text-body font-medium">Tap to choose a photo</span>
            <span className="text-small text-white/50">Select an image with a barcode</span>
          </button>
        )}

        {/* Loading */}
        {uploadState === 'loading' && (
          <div className="flex flex-col items-center gap-space-md text-white/70">
            <div className="w-10 h-10 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <p className="text-body">Reading barcode…</p>
          </div>
        )}

        {/* Result — error */}
        {uploadState && uploadState !== 'loading' && !uploadState.barcode && (
          <div className="flex flex-col items-center gap-space-lg w-full max-w-sm">
            {uploadState.preview && (
              <img src={uploadState.preview} alt="Uploaded" className="w-full rounded-radius-md max-h-64 object-contain" />
            )}
            <p className="text-body text-white/80 text-center">No barcode found in this image. Try a clearer photo.</p>
            <button
              onClick={() => { setUploadState(null); fileRef.current && (fileRef.current.value = '') }}
              className="text-small font-medium text-white underline"
            >
              Try another image
            </button>
          </div>
        )}

        {/* Result — success (brief flash before onDetected closes modal) */}
        {uploadState?.barcode && (
          <div className="flex flex-col items-center gap-space-md text-white/80">
            <p className="text-body">Barcode detected!</p>
          </div>
        )}

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      <div className="flex-shrink-0 px-space-lg py-space-lg text-center">
        <button onClick={onClose} className="text-small font-medium text-white/70 hover:text-white underline">
          Cancel
        </button>
      </div>
    </div>
  )
}

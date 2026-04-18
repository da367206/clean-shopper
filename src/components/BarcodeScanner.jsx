/**
 * BarcodeScanner
 *
 * Full-screen camera modal that scans barcodes using @zxing/browser.
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

export default function BarcodeScanner({ onDetected, onClose }) {
  const videoRef   = useRef(null)
  const readerRef  = useRef(null)
  const [status, setStatus]   = useState('Requesting camera…')
  const [error,  setError]    = useState(null)
  const detectedRef = useRef(false)

  useEffect(() => {
    const reader = new BrowserMultiFormatReader()
    readerRef.current = reader

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
        setError(
          err.name === 'NotAllowedError'
            ? 'Camera permission denied. Please allow camera access and try again.'
            : 'Could not access camera. Make sure no other app is using it.'
        )
      })

    return () => {
      BrowserMultiFormatReader.releaseAllStreams()
    }
  }, [onDetected])

  return (
    <div className="fixed inset-0 z-50 bg-neutral-900 flex flex-col">

      {/* Header */}
      <div className="flex items-center justify-between px-space-lg py-space-md flex-shrink-0">
        <span className="text-body font-medium text-white">Scan Barcode</span>
        <button
          onClick={onClose}
          aria-label="Close scanner"
          className="text-white/70 hover:text-white transition-colors duration-150"
        >
          <CloseIcon />
        </button>
      </div>

      {/* Camera view */}
      <div className="flex-1 relative overflow-hidden flex items-center justify-center">
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          playsInline
          muted
        />

        {/* Scan frame overlay */}
        {!error && (
          <div className="relative z-10 w-64 h-40 sm:w-80 sm:h-48">
            {/* Corner markers */}
            {[
              'top-0 left-0 border-t-2 border-l-2',
              'top-0 right-0 border-t-2 border-r-2',
              'bottom-0 left-0 border-b-2 border-l-2',
              'bottom-0 right-0 border-b-2 border-r-2',
            ].map((cls, i) => (
              <span key={i} className={`absolute w-6 h-6 border-white/80 ${cls}`} />
            ))}
            {/* Scan line animation */}
            <div className="absolute inset-x-0 top-1/2 h-px bg-primary/80 animate-pulse" />
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="relative z-10 mx-space-xl text-center">
            <p className="text-body text-white/80">{error}</p>
          </div>
        )}
      </div>

      {/* Status bar */}
      <div className="flex-shrink-0 px-space-lg py-space-lg text-center">
        {!error && (
          <p className="text-small text-white/60">{status}</p>
        )}
        <button
          onClick={onClose}
          className="mt-space-md text-small font-medium text-white/70 hover:text-white underline"
        >
          Cancel
        </button>
      </div>

    </div>
  )
}

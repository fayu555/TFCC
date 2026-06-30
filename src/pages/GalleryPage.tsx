import { useEffect, useMemo, useState } from 'react'

type Photo = {
  id: string
  title: string
  url: string
}

const initialPhotos: Photo[] = [
  { id: 'g1', title: 'Team huddle', url: 'https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=800&q=80' },
  { id: 'g2', title: 'Match action', url: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80' },
]

export function GalleryPage() {
  const [photos, setPhotos] = useState<Photo[]>(() => {
    const stored = window.localStorage.getItem('tfcc-gallery')
    if (!stored) return initialPhotos
    try {
      return JSON.parse(stored) as Photo[]
    } catch {
      return initialPhotos
    }
  })
  const [form, setForm] = useState({ title: '', url: '' })

  useEffect(() => {
    window.localStorage.setItem('tfcc-gallery', JSON.stringify(photos))
  }, [photos])

  const canUpload = form.title && form.url
  const galleryCount = useMemo(() => photos.length, [photos])

  return (
    <div>
      <div className="card">
        <h2>Photo Gallery</h2>
        <p>Click and upload match photos so everyone can view them.</p>
        <p>{galleryCount} photos shared</p>
        <div className="gallery-grid">
          {photos.map((photo) => (
            <div key={photo.id} className="gallery-item">
              <img src={photo.url} alt={photo.title} />
              <div style={{ padding: '12px' }}>
                <strong>{photo.title}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h2>Upload Photo</h2>
        <div className="field">
          <label>Title</label>
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        </div>
        <div className="field">
          <label>Image URL</label>
          <input value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} />
        </div>
        <button disabled={!canUpload} onClick={() => {
          setPhotos((current) => [
            ...current,
            { id: crypto.randomUUID(), title: form.title, url: form.url },
          ])
          setForm({ title: '', url: '' })
        }}>
          Upload Photo Link
        </button>
      </div>
    </div>
  )
}

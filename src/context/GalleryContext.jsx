import { createContext, useContext, useState } from 'react'

const GalleryContext = createContext(null)

export function GalleryProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem('visioai_gallery') || '[]') } catch { return [] }
  })

  const addItem = (item) => {
    const newItems = [{ ...item, id: Date.now(), timestamp: new Date().toISOString() }, ...items]
    setItems(newItems)
    localStorage.setItem('visioai_gallery', JSON.stringify(newItems.slice(0, 100)))
  }

  const removeItem = (id) => {
    const updated = items.filter(i => i.id !== id)
    setItems(updated)
    localStorage.setItem('visioai_gallery', JSON.stringify(updated))
  }

  const clearAll = () => { setItems([]); localStorage.removeItem('visioai_gallery') }

  return (
    <GalleryContext.Provider value={{ items, addItem, removeItem, clearAll }}>
      {children}
    </GalleryContext.Provider>
  )
}

export const useGallery = () => useContext(GalleryContext)

'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface EditModeState {
  isEditMode: boolean
  toggle: () => void
}

const EditModeContext = createContext<EditModeState>({ isEditMode: false, toggle: () => {} })

export function EditModeProvider({ children }: { children: ReactNode }) {
  const [isEditMode, setIsEditMode] = useState(false)
  return (
    <EditModeContext.Provider value={{ isEditMode, toggle: () => setIsEditMode(v => !v) }}>
      {children}
    </EditModeContext.Provider>
  )
}

export function useEditMode() {
  return useContext(EditModeContext)
}

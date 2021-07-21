import { useMemo } from 'react'
import { createStore, applyMiddleware } from 'redux'
import { configureStore } from '@reduxjs/toolkit'
import user from '@/slices/user'




function initStore() {
  const store = configureStore({
    reducer: {
      user
    },
  })
  return store
}

export function useStore() {
  const store = initStore()
  return store
}

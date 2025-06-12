"use client"
import { useState, useEffect } from "react"

let toasts = []
let listeners = []

export function showToast(message, type = "info") {
  const id = Math.random().toString(36).substr(2, 9)
  const toast = { id, message, type, isVisible: false }
  
  toasts = [...toasts, toast]
  listeners.forEach((listener) => listener(toasts))
  
   setTimeout(() => {
    toasts = toasts.map(t => t.id === id ? { ...t, isVisible: true } : t)
    listeners.forEach((listener) => listener(toasts))
  }, 50)
  
   setTimeout(() => {
    toasts = toasts.map(t => t.id === id ? { ...t, isVisible: false } : t)
    listeners.forEach((listener) => listener(toasts))
    
     setTimeout(() => {
      toasts = toasts.filter((t) => t.id !== id)
      listeners.forEach((listener) => listener(toasts))
    }, 300)
  }, 5000)
}

export function Toaster() {
  const [toastList, setToastList] = useState([])
  
  useEffect(() => {
    const listener = (newToasts) => setToastList(newToasts)
    listeners.push(listener)
    
    return () => {
      listeners = listeners.filter((l) => l !== listener)
    }
  }, [])
  
  const getToastStyles = (toast) => {
    const baseStyles = "mb-3 max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden transition-all duration-300 ease-in-out"
    const visibilityStyles = toast.isVisible 
      ? "transform translate-x-0 opacity-100" 
      : "transform translate-x-full opacity-0"
    
    const typeStyles = {
      success: "border-l-4 border-green-500",
      error: "border-l-4 border-red-500",
      info: "border-l-4 border-blue-500"
    }
    
    return `${baseStyles} ${visibilityStyles} ${typeStyles[toast.type] || typeStyles.info}`
  }
  
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col items-end">
      {toastList.map((toast) => (
        <div
          key={toast.id}
          className={getToastStyles(toast)}
        >
          <div className="p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                {toast.type === "success" && (
                  <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                )}
                {toast.type === "error" && (
                  <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                )}
                {toast.type === "info" && (
                  <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                )}
              </div>
              <div className="ml-3 flex-1 pt-0.5">
                <p className="text-sm font-medium text-gray-900 leading-5">{toast.message}</p>
              </div>
              <div className="ml-4 flex-shrink-0 flex">
                <button
                  className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={() => {
                    toasts = toasts.filter((t) => t.id !== toast.id)
                    listeners.forEach((listener) => listener(toasts))
                  }}
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

 export default function ToastDemo() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-md mx-auto space-y-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Toast Demo</h1>
        
        <button
          onClick={() => showToast("This is a success message!", "success")}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
        >
          Show Success Toast
        </button>
        
        <button
          onClick={() => showToast("This is an error message!", "error")}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
        >
          Show Error Toast
        </button>
        
        <button
          onClick={() => showToast("This is an info message with some longer text to test wrapping!", "info")}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
        >
          Show Info Toast
        </button>
      </div>
      
      <Toaster />
    </div>
  )
}
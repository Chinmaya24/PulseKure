import { Toaster as SonnerToaster } from 'sonner'

const Toaster = () => {
  return (
    <SonnerToaster
      position="top-right"
      toastOptions={{
        style: {
          background: '#fff',
          color: '#333',
          border: '1px solid #e5e7eb',
        },
        className: 'toast',
        duration: 4000,
      }}
    />
  )
}

export default Toaster 
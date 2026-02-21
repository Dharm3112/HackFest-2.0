import React from 'react'

function App() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="p-8 bg-surface rounded-xl border border-highlight/30 shadow-2xl shadow-glow/10 text-center max-w-md">
        <h1 className="text-3xl font-bold mb-4">
          OmniGuard <span className="text-primary">AML</span>
        </h1>
        <p className="text-textMuted mb-6">
          The HexaCore initial UI foundation is successfully deployed.
        </p>
        <button className="bg-primary hover:bg-accent text-white font-medium py-2 px-6 rounded transition-colors duration-200">
          Upload Policy
        </button>
      </div>
    </div>
  )
}

export default App

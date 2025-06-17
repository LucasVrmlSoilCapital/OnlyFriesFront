import React from 'react'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import UserProfile from './components/UserProfile'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <header className="bg-blue-600 text-white p-4">
          <h1 className="text-2xl font-bold">Mon Application</h1>
        </header>
        
        <main className="container mx-auto mt-8 px-4">
          <ProtectedRoute>
            <div className="space-y-8">
              <UserProfile />
              
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Bienvenue dans votre application !
                </h2>
                <p className="text-gray-600">
                  Vous êtes maintenant connecté(e) avec Supabase. Vous pouvez développer
                  vos fonctionnalités ici.
                </p>
              </div>
            </div>
          </ProtectedRoute>
        </main>
      </div>
    </AuthProvider>
  )
}

export default App

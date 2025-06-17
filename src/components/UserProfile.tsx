import React from 'react'
import { useAuth } from '../contexts/AuthContext'

const UserProfile: React.FC = () => {
  const { user, signOut } = useAuth()

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error)
    }
  }

  if (!user) return null

  return (
    <div className="bg-white shadow rounded-lg p-6 max-w-md mx-auto">
      <div className="flex items-center space-x-6">
        <div className="flex-1">
          <h2 className="text-xl font-bold text-gray-900">Profil utilisateur</h2>
          <p className="text-gray-600">Email: {user.email}</p>
          <p className="text-gray-600">ID: {user.id}</p>
          {user.user_metadata?.full_name && (
            <p className="text-gray-600">Nom: {user.user_metadata.full_name}</p>
          )}
        </div>
      </div>
      
      <div className="mt-6">
        <button
          onClick={handleSignOut}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Se déconnecter
        </button>
      </div>
    </div>
  )
}

export default UserProfile 
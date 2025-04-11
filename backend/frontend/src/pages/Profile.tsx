import { useState, useRef } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { toast } from 'sonner'
import axios from 'axios'
import { Camera, Shield, Trash2, CheckCircle2, XCircle } from 'lucide-react'

interface ProfileFormData {
  email: string
  firstName: string
  lastName: string
  currentPassword: string
  newPassword: string
  confirmPassword: string
  profilePicture: File | null
  isTwoFactorEnabled: boolean
}

const Profile = () => {
  const { user, token, logout } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState<ProfileFormData>({
    email: user?.email || '',
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    profilePicture: null,
    isTwoFactorEnabled: user?.isTwoFactorEnabled || false,
  })

  const validateForm = (): string[] => {
    const errors: string[] = []
    
    if (!formData.email) {
      errors.push('Email is required')
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.push('Email is invalid')
    }

    if (formData.newPassword || formData.confirmPassword) {
      if (!formData.currentPassword) {
        errors.push('Current password is required to change password')
      }
      if (formData.newPassword.length < 8) {
        errors.push('New password must be at least 8 characters long')
      }
      if (formData.newPassword !== formData.confirmPassword) {
        errors.push('New passwords do not match')
      }
    }

    return errors
  }

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Profile picture must be less than 5MB')
        return
      }
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file')
        return
      }
      setFormData(prev => ({ ...prev, profilePicture: file }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const errors = validateForm()
    if (errors.length > 0) {
      errors.forEach(error => toast.error(error))
      return
    }

    setIsLoading(true)
    try {
      const formDataToSend = new FormData()
      formDataToSend.append('email', formData.email)
      formDataToSend.append('firstName', formData.firstName)
      formDataToSend.append('lastName', formData.lastName)
      formDataToSend.append('isTwoFactorEnabled', formData.isTwoFactorEnabled.toString())

      if (formData.profilePicture) {
        formDataToSend.append('profilePicture', formData.profilePicture)
      }

      if (formData.newPassword) {
        formDataToSend.append('currentPassword', formData.currentPassword)
        formDataToSend.append('newPassword', formData.newPassword)
      }

      const response = await axios.put(
        'http://localhost:8000/api/profile/',
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      )

      toast.success('Profile updated successfully')
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        profilePicture: null,
      }))
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || 'Failed to update profile')
      } else {
        toast.error('An unexpected error occurred')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return
    }

    setIsDeleting(true)
    try {
      await axios.delete('http://localhost:8000/api/profile/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      toast.success('Account deleted successfully')
      logout()
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || 'Failed to delete account')
      } else {
        toast.error('An unexpected error occurred')
      }
    } finally {
      setIsDeleting(false)
    }
  }

  const handleResendVerification = async () => {
    try {
      await axios.post(
        'http://localhost:8000/api/auth/resend-verification/',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      toast.success('Verification email sent successfully')
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || 'Failed to send verification email')
      } else {
        toast.error('An unexpected error occurred')
      }
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
          <div className="flex items-center space-x-2">
            {user?.isEmailVerified ? (
              <span className="flex items-center text-green-600">
                <CheckCircle2 className="w-5 h-5 mr-1" />
                Email Verified
              </span>
            ) : (
              <button
                onClick={handleResendVerification}
                className="flex items-center text-blue-600 hover:text-blue-700"
              >
                <XCircle className="w-5 h-5 mr-1" />
                Verify Email
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-4 mb-6">
          <div className="relative">
            <img
              src={formData.profilePicture ? URL.createObjectURL(formData.profilePicture) : user?.profilePicture || '/default-avatar.png'}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 bg-blue-600 text-white p-1 rounded-full hover:bg-blue-700"
            >
              <Camera className="w-4 h-4" />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleProfilePictureChange}
              accept="image/*"
              className="hidden"
            />
          </div>
          <div>
            <h2 className="text-lg font-medium text-gray-900">
              {user?.firstName} {user?.lastName}
            </h2>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">Security Settings</h2>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, isTwoFactorEnabled: !prev.isTwoFactorEnabled }))}
                className={`flex items-center space-x-2 px-3 py-1 rounded-md ${
                  formData.isTwoFactorEnabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}
              >
                <Shield className="w-4 h-4" />
                <span>2FA {formData.isTwoFactorEnabled ? 'Enabled' : 'Disabled'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                  Current Password
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleDeleteAccount}
              disabled={isDeleting}
              className="flex items-center text-red-600 hover:text-red-700 disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              {isDeleting ? 'Deleting...' : 'Delete Account'}
            </button>

            <button
              type="submit"
              className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Profile 
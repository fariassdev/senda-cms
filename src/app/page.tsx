'use client';

import { useAuthStore } from '@/stores/authStore';

export default function Home() {
  const { user, clearAuth } = useAuthStore();

  const handleLogout = () => {
    clearAuth();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Senda CMS</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Welcome, {user?.name || user?.email}
              </span>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Welcome to Senda CMS
              </h2>
              <p className="text-gray-600 mb-8">
                Your meditation course management system is ready. Start by
                creating your first course.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {/* Course Management Card */}
                <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <div className="text-blue-600 text-2xl mb-4">📚</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Course Management
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Create and manage your meditation courses
                  </p>
                  <button
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                    disabled
                  >
                    Coming Soon
                  </button>
                </div>

                {/* Lesson Creation Card */}
                <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <div className="text-green-600 text-2xl mb-4">✏️</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Lesson Creation
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Design individual meditation lessons
                  </p>
                  <button
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
                    disabled
                  >
                    Coming Soon
                  </button>
                </div>

                {/* Script Generation Card */}
                <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <div className="text-purple-600 text-2xl mb-4">🤖</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    AI Script Generation
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Generate lesson scripts with AI
                  </p>
                  <button
                    className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors"
                    disabled
                  >
                    Coming Soon
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

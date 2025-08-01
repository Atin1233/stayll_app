"use client"

import { ChatBubbleLeftRightIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline'

// Mock messages data
const mockMessages = [
  {
    id: '1',
    from: 'John Doe',
    subject: 'Rent payment question',
    message: 'Hi, I have a question about the rent payment process. Can you help me?',
    timestamp: '2 hours ago',
    unread: true
  },
  {
    id: '2',
    from: 'Sarah Wilson',
    subject: 'Maintenance request',
    message: 'The kitchen sink is leaking. Can someone come fix it?',
    timestamp: '1 day ago',
    unread: false
  },
  {
    id: '3',
    from: 'Mike Johnson',
    subject: 'Lease renewal',
    message: 'I would like to discuss renewing my lease for another year.',
    timestamp: '3 days ago',
    unread: false
  }
]

export default function MessagesPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Messages</h1>
        <p className="mt-2 text-sm text-gray-600">
          AI-powered inbox for managing tenant communications.
        </p>
      </div>

      {/* Coming Soon Banner */}
      <div className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-center">
          <ChatBubbleLeftRightIcon className="h-8 w-8 text-blue-500 mr-4" />
          <div>
            <h3 className="text-lg font-medium text-blue-900">AI Auto-Reply Coming Soon</h3>
            <p className="text-blue-700 mt-1">
              We're building intelligent message handling to automatically respond to common tenant inquiries.
            </p>
          </div>
        </div>
      </div>

      {/* Messages List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Messages</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Sample messages (AI auto-reply functionality coming soon)
          </p>
        </div>
        <ul className="divide-y divide-gray-200">
          {mockMessages.map((message) => (
            <li key={message.id} className={`px-4 py-4 sm:px-6 ${message.unread ? 'bg-blue-50' : ''}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <ChatBubbleLeftRightIcon className="h-8 w-8 text-blue-500" />
                  </div>
                  <div className="ml-4">
                    <div className="flex items-center">
                      <p className="text-sm font-medium text-gray-900">
                        {message.from}
                      </p>
                      {message.unread && (
                        <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          New
                        </span>
                      )}
                    </div>
                    <div className="mt-1">
                      <p className="text-sm font-medium text-gray-900">{message.subject}</p>
                      <p className="text-sm text-gray-500 mt-1">{message.message}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">{message.timestamp}</span>
                  <button className="text-blue-600 hover:text-blue-900">
                    <PaperAirplaneIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Features Preview */}
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ChatBubbleLeftRightIcon className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Auto-Reply</dt>
                  <dd className="text-sm text-gray-900">
                    Intelligent responses to common questions
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <PaperAirplaneIcon className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Smart Routing</dt>
                  <dd className="text-sm text-gray-900">
                    Route messages to the right team member
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ChatBubbleLeftRightIcon className="h-6 w-6 text-purple-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Analytics</dt>
                  <dd className="text-sm text-gray-900">
                    Track response times and satisfaction
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 
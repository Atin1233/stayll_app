import { 
  DocumentTextIcon, 
  UsersIcon, 
  ChatBubbleLeftRightIcon,
  ExclamationTriangleIcon 
} from '@heroicons/react/24/outline'

const stats = [
  { name: 'Total Leases', value: '12', icon: DocumentTextIcon, change: '+2', changeType: 'positive' },
  { name: 'Active Tenants', value: '8', icon: UsersIcon, change: '+1', changeType: 'positive' },
  { name: 'Unread Messages', value: '3', icon: ChatBubbleLeftRightIcon, change: '+1', changeType: 'negative' },
  { name: 'Rent Due Soon', value: '2', icon: ExclamationTriangleIcon, change: '0', changeType: 'neutral' },
]

export default function DashboardPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-sm text-gray-600">
          Welcome back! Here's what's happening with your properties.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div
            key={item.name}
            className="relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow sm:px-6 sm:pt-6"
          >
            <dt>
              <div className="absolute rounded-md bg-blue-500 p-3">
                <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">{item.name}</p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
              <p className="text-2xl font-semibold text-gray-900">{item.value}</p>
              <p
                className={`ml-2 flex items-baseline text-sm font-semibold ${
                  item.changeType === 'positive' ? 'text-green-600' : 
                  item.changeType === 'negative' ? 'text-red-600' : 'text-gray-500'
                }`}
              >
                {item.change}
              </p>
            </dd>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <DocumentTextIcon className="h-5 w-5 text-blue-500" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    New lease uploaded for John Doe
                  </p>
                  <p className="text-sm text-gray-500">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <UsersIcon className="h-5 w-5 text-green-500" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Tenant Sarah Wilson rent payment received
                  </p>
                  <p className="text-sm text-gray-500">1 day ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Rent due reminder for 123 Main St
                  </p>
                  <p className="text-sm text-gray-500">2 days ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 
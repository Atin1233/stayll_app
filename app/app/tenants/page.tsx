"use client"

import { UsersIcon, CheckCircleIcon, ExclamationTriangleIcon, ClockIcon } from '@heroicons/react/24/outline'

// Mock tenant data
const mockTenants = [
  {
    id: '1',
    name: 'John Doe',
    status: 'on-time',
    lease_start: '2025-01-01',
    lease_end: '2025-12-31',
    rent_amount: '$2,100',
    property_address: '123 Main St, Apt 4B'
  },
  {
    id: '2',
    name: 'Sarah Wilson',
    status: 'late',
    lease_start: '2024-11-01',
    lease_end: '2025-10-31',
    rent_amount: '$1,800',
    property_address: '456 Oak Ave, Unit 12'
  },
  {
    id: '3',
    name: 'Mike Johnson',
    status: 'due-soon',
    lease_start: '2024-12-01',
    lease_end: '2025-11-30',
    rent_amount: '$2,300',
    property_address: '789 Pine St, Unit 7'
  }
]

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'on-time':
      return <CheckCircleIcon className="h-5 w-5 text-green-500" />
    case 'late':
      return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
    case 'due-soon':
      return <ClockIcon className="h-5 w-5 text-yellow-500" />
    default:
      return <ClockIcon className="h-5 w-5 text-gray-400" />
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case 'on-time':
      return 'On Time'
    case 'late':
      return 'Late'
    case 'due-soon':
      return 'Due Soon'
    default:
      return 'Unknown'
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'on-time':
      return 'bg-green-100 text-green-800'
    case 'late':
      return 'bg-red-100 text-red-800'
    case 'due-soon':
      return 'bg-yellow-100 text-yellow-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export default function TenantsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Tenants</h1>
        <p className="mt-2 text-sm text-gray-600">
          Manage your tenants and track their payment status.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircleIcon className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">On Time</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {mockTenants.filter(t => t.status === 'on-time').length}
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
                <ExclamationTriangleIcon className="h-6 w-6 text-red-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Late</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {mockTenants.filter(t => t.status === 'late').length}
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
                <ClockIcon className="h-6 w-6 text-yellow-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Due Soon</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {mockTenants.filter(t => t.status === 'due-soon').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tenants List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {mockTenants.map((tenant) => (
            <li key={tenant.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <UsersIcon className="h-8 w-8 text-blue-500" />
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-gray-900">
                          {tenant.name}
                        </p>
                        <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(tenant.status)}`}>
                          {getStatusIcon(tenant.status)}
                          <span className="ml-1">{getStatusText(tenant.status)}</span>
                        </span>
                      </div>
                      <div className="mt-1 flex items-center text-sm text-gray-500">
                        <p>{tenant.property_address}</p>
                      </div>
                      <div className="mt-1 flex items-center text-sm text-gray-500">
                        <p className="mr-4">Rent: {tenant.rent_amount}</p>
                        <p>Lease: {tenant.lease_start} to {tenant.lease_end}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="text-blue-600 hover:text-blue-900 text-sm font-medium">
                      View Lease
                    </button>
                    <button className="text-gray-600 hover:text-gray-900 text-sm font-medium">
                      Contact
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
} 
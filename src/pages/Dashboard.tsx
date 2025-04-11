import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Stethoscope,
  Building2,
  Activity,
  Calendar,
  MessageSquare,
  FileText,
  Video,
} from 'lucide-react';

const stats = [
  { name: 'Total Patients', value: '1,234', icon: Users, change: '+12%', changeType: 'positive' },
  { name: 'Active Doctors', value: '89', icon: Stethoscope, change: '+5%', changeType: 'positive' },
  { name: 'Partner NGOs', value: '45', icon: Building2, change: '+8%', changeType: 'positive' },
  { name: 'Today\'s Appointments', value: '56', icon: Calendar, change: '+3%', changeType: 'positive' },
];

const recentActivity = [
  {
    id: 1,
    type: 'appointment',
    title: 'New Appointment Scheduled',
    description: 'Dr. Smith with Patient John Doe',
    time: '2 hours ago',
    icon: Calendar,
  },
  {
    id: 2,
    type: 'consultation',
    title: 'Video Consultation Started',
    description: 'Dr. Johnson with Patient Jane Smith',
    time: '3 hours ago',
    icon: Video,
  },
  {
    id: 3,
    type: 'message',
    title: 'New Message Received',
    description: 'From Patient Robert Wilson',
    time: '4 hours ago',
    icon: MessageSquare,
  },
  {
    id: 4,
    type: 'report',
    title: 'Medical Report Uploaded',
    description: 'For Patient Sarah Brown',
    time: '5 hours ago',
    icon: FileText,
  },
];

export default function Dashboard() {
  const [selectedTimeRange, setSelectedTimeRange] = useState('today');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex space-x-2">
          {['today', 'week', 'month', 'year'].map((range) => (
            <button
              key={range}
              onClick={() => setSelectedTimeRange(range)}
              className={`px-3 py-1 text-sm font-medium rounded-md ${
                selectedTimeRange === range
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:px-6 sm:py-6"
          >
            <dt>
              <div className="absolute rounded-md bg-primary-500 p-3">
                <stat.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">{stat.name}</p>
            </dt>
            <dd className="ml-16 flex items-baseline">
              <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              <p
                className={`ml-2 flex items-baseline text-sm font-semibold ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {stat.change}
              </p>
            </dd>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Recent Activity</h3>
            <div className="mt-6 flow-root">
              <ul className="-my-5 divide-y divide-gray-200">
                {recentActivity.map((activity) => (
                  <motion.li
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="py-4"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <activity.icon className="h-6 w-6 text-primary-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-gray-900">
                          {activity.title}
                        </p>
                        <p className="truncate text-sm text-gray-500">{activity.description}</p>
                      </div>
                      <div>
                        <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                          {activity.time}
                        </span>
                      </div>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Quick Actions</h3>
            <div className="mt-6 grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
                <Calendar className="mr-2 h-5 w-5" />
                Schedule Appointment
              </button>
              <button className="flex items-center justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
                <Video className="mr-2 h-5 w-5" />
                Start Video Call
              </button>
              <button className="flex items-center justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
                <MessageSquare className="mr-2 h-5 w-5" />
                Send Message
              </button>
              <button className="flex items-center justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
                <FileText className="mr-2 h-5 w-5" />
                Upload Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
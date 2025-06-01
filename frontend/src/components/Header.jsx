// components/Header.jsx
import React from "react";
import {
  Bell,
  User,
  AlertCircle,
  MessageSquare,
  Clock,
  CheckCircle,
  X,
  HelpCircle,
  LogOut,
  CircleHelp,
} from "lucide-react";

export default function Header({
  hasSearched,
  notifications,
  notificationsOpen,
  setNotificationsOpen,
  profileOpen,
  setProfileOpen,
  markAllNotificationsAsRead,
  deleteNotification,
}) {
  return (
    <header
      className={`h-14 flex items-center pl-4 py-4 pr-6 justify-end w-full`}
    >
      {/* <button className="w-9 h-9 rounded-full flex items-center justify-center font-medium cursor-pointer hover:bg-gray-200">
        <CircleHelp className='text-gray-600'/>
        </button> */}

      {/* {hasSearched && (
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-gray-800 ptserif py-1.5"></h1>
        </div>
      )}
      <div className="flex items-center gap-5">
        <button
          className="relative p-2 text-gray-500 hover:bg-gray-200 rounded-full"
          onClick={() => setNotificationsOpen(!notificationsOpen)}
        >
          <Bell size={16} />
          {notifications.filter(n => !n.read).length > 0 && (
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
          )}
        </button>
        <button
          onClick={() => setProfileOpen(!profileOpen)}
          className="w-9 h-9 rounded-full bg-blue-700 text-white flex items-center justify-center font-medium"
        >
          <User size={20} />
        </button>
      </div> */}

      {/* Notifications Dropdown
      {notificationsOpen && (
        <div className="absolute right-18 top-12 w-72 bg-white rounded-lg shadow-lg z-10 border border-gray-200 overflow-hidden">
          <div className="flex justify-between items-center border-b p-3">
            <h3 className="font-medium">Notifications</h3>
            <button
              onClick={markAllNotificationsAsRead}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              Mark all as read
            </button>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">No notifications</div>
            ) : notifications.map(notif => (
              <div
                key={notif.id}
                className={`border-b ${notif.read ? 'bg-white' : 'bg-blue-50'} hover:bg-gray-50`}
              >
                <div className="p-3 relative flex items-start">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3
                      ${notif.type === 'alert' ? 'bg-red-100 text-red-600' :
                        notif.type === 'info' ? 'bg-blue-100 text-blue-600' :
                        notif.type === 'reminder' ? 'bg-yellow-100 text-yellow-600' :
                        'bg-green-100 text-green-600'}`}
                  >
                    {notif.type === 'alert' ? <AlertCircle size={16}/> :
                     notif.type === 'info' ? <MessageSquare size={16}/> :
                     notif.type === 'reminder' ? <Clock size={16}/> :
                     <CheckCircle size={16}/>}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{notif.title}</h4>
                    <p className="text-xs text-gray-600">{notif.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                  </div>
                  <button
                    onClick={() => deleteNotification(notif.id)}
                    className="text-gray-400 hover:text-gray-600 p-1"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="p-2 border-t text-center">
            <button className="text-sm text-blue-600 hover:text-blue-800">
              View all notifications
            </button>
          </div>
        </div>
      )} */}

      {/* Profile Dropdown
      {profileOpen && (
        <div className="absolute right-6 top-12 w-64 bg-white rounded-lg shadow-lg z-10 border border-gray-200 overflow-hidden">
          <div className="p-4 border-b-[0.1px] border-gray-300 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-800 text-white flex items-center justify-center font-bold text-xl mx-auto mb-2">
              SI
            </div>
            <h3 className="font-medium">Shoaib Imran</h3>
            <p className="text-sm text-gray-600">Imran@example.com</p>
          </div>
          <div className="py-1">
            <button className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100">
              <HelpCircle size={16} className="mr-3 text-gray-500" />
              <span>Help & Support</span>
            </button>
          </div>
          <div className="py-1 border-t-[0.1px] border-gray-300">
            <button className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-gray-100">
              <LogOut size={16} className="mr-3" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )} */}
    </header>
  );
}

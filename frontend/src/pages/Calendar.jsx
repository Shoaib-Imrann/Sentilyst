// import React from "react";
// import { Plus, Clock, Edit, Trash2 } from "lucide-react";

// // Dummy events data, replace with your actual source
// const eventsData = [
//   {
//     id: 1,
//     date: "Apr 7, 2025",
//     title: "Company Merger Announcement",
//     time: "10:00 AM",
//     type: "Press Release"
//   },
//   {
//     id: 2,
//     date: "Apr 10, 2025",
//     title: "Earnings Call",
//     time: "2:00 PM",
//     type: "Conference Call"
//   }
// ];

// export default function CalendarPage() {
//   return (
//     <div className="p-6">
//       <div className="mb-6">
//         <h2 className="text-2xl font-bold mb-1">M&A Events Calendar</h2>
//         <p className="text-gray-600">Track important M&A-related events and announcements</p>
//       </div>

//       <div className="flex justify-between items-center mb-6">
//         <div className="flex items-center space-x-4">
//           <button className="px-4 py-2 bg-blue-600 text-white rounded-md">Today</button>
//           <button className="px-4 py-2 border border-gray-300 rounded-md">Week</button>
//           <button className="px-4 py-2 border border-gray-300 rounded-md">Month</button>
//         </div>
//         <div>
//           <button className="flex items-center bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700">
//             <Plus size={16} className="mr-2" />
//             Add Event
//           </button>
//         </div>
//       </div>

//       {/* Upcoming Events */}
//       <div className="bg-white rounded-xl shadow-md p-6">
//         <h3 className="font-bold text-lg mb-4">Upcoming Events</h3>
//         <div className="space-y-4">
//           {eventsData.map((event) => (
//             <div key={event.id} className="flex items-center p-4 border border-gray-100 rounded-lg hover:bg-gray-50">
//               <div className="h-12 w-12 bg-blue-50 text-blue-700 rounded-lg flex flex-col items-center justify-center mr-4">
//                 <span className="text-xs font-medium">{event.date.split(' ')[0]}</span>
//                 <span className="font-bold">{event.date.split(' ')[1].replace(',', '')}</span>
//               </div>
//               <div className="flex-1">
//                 <h4 className="font-bold">{event.title}</h4>
//                 <div className="flex items-center text-sm text-gray-600">
//                   <Clock size={14} className="mr-1" />
//                   {event.time}
//                   <span className="mx-2">•</span>
//                   <span>{event.type}</span>
//                 </div>
//               </div>
//               <div className="flex space-x-2">
//                 <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-md">
//                   <Edit size={16} />
//                 </button>
//                 <button className="p-2 text-red-500 hover:bg-red-50 rounded-md">
//                   <Trash2 size={16} />
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Calendar Month View */}
//       <div className="mt-6 bg-white rounded-xl shadow-md p-6">
//         <h3 className="font-bold text-lg mb-4">Calendar</h3>
//         <div className="border border-gray-200 rounded-lg">
//           <div className="grid grid-cols-7 text-center py-2 border-b border-gray-200 bg-gray-50 font-medium">
//             <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
//           </div>
//           <div className="grid grid-cols-7 text-center divide-x divide-y divide-gray-200">
//             {Array.from({ length: 35 }).map((_, index) => {
//               const day = (index % 31) + 1;
//               const hasEvent = eventsData.some(e => parseInt(e.date.split(' ')[1]) === day);
//               return (
//                 <div key={index} className={`py-6 px-2 ${hasEvent ? 'bg-blue-50' : ''}`}>
//                   <span className={`inline-block w-8 h-8 rounded-full ${
//                     hasEvent ? 'bg-blue-100 text-blue-700' : ''
//                   } flex items-center justify-center`}>
//                     {day <= 31 ? day : ''}
//                   </span>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import { Plus, Clock, Edit, Trash2 } from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function CalendarPage() {
  const [eventsData, setEventsData] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get("/api/calendar/ma-news-events");
        // the API wraps events in { eventsData: [...] }
        const data = res.data.eventsData || [];
        const filtered = data.filter((e) => e.title.trim());
        setEventsData(filtered);
        toast.success("Events loaded successfully");
      } catch (err) {
        // console.error("Failed to fetch events", err);
        toast.error("Couldn't load events");
      }
    };

    fetchEvents();
  }, []);

  return (
    <>
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-1">M&A Events Calendar</h2>
          <p className="text-gray-600">
            Track important M&A-related events and announcements
          </p>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md">
              Today
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-md">
              Week
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-md">
              Month
            </button>
          </div>
          <div>
            <button className="flex items-center bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700">
              <Plus size={16} className="mr-2" />
              Add Event
            </button>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="font-bold text-lg mb-4">Upcoming Events</h3>
          <div className="space-y-4">
            {eventsData.map((event) => (
              <div
                key={event.id}
                className="flex items-center p-4 border border-gray-100 rounded-lg hover:bg-gray-50"
              >
                <div className="h-12 w-12 bg-blue-50 text-blue-700 rounded-lg flex flex-col items-center justify-center mr-4">
                  <span className="text-xs font-medium">
                    {event.date.split(" ")[0]}
                  </span>
                  <span className="font-bold">
                    {event.date.split(" ")[1].replace(",", "")}
                  </span>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold">{event.title}</h4>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock size={14} className="mr-1" />
                    {event.time}
                    <span className="mx-2">•</span>
                    <span>{event.type}</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-md">
                    <Edit size={16} />
                  </button>
                  <button className="p-2 text-red-500 hover:bg-red-50 rounded-md">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Calendar Month View */}
        <div className="mt-6 bg-white rounded-xl shadow-md p-6">
          <h3 className="font-bold text-lg mb-4">Calendar</h3>
          <div className="border border-gray-200 rounded-lg">
            <div className="grid grid-cols-7 text-center py-2 border-b border-gray-200 bg-gray-50 font-medium">
              <div>Sun</div>
              <div>Mon</div>
              <div>Tue</div>
              <div>Wed</div>
              <div>Thu</div>
              <div>Fri</div>
              <div>Sat</div>
            </div>
            <div className="grid grid-cols-7 text-center divide-x divide-y divide-gray-200">
              {Array.from({ length: 35 }).map((_, index) => {
                const day = (index % 31) + 1;
                const hasEvent = eventsData.some(
                  (e) => parseInt(e.date.split(" ")[1]) === day
                );
                return (
                  <div
                    key={index}
                    className={`py-6 px-2 ${hasEvent ? "bg-blue-50" : ""}`}
                  >
                    <span
                      className={`inline-block w-8 h-8 rounded-full ${
                        hasEvent ? "bg-blue-100 text-blue-700" : ""
                      } flex items-center justify-center`}
                    >
                      {day <= 31 ? day : ""}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

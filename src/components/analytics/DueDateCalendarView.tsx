import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useCalendarTasks } from '../../hooks/useAnalytics';
import { format, startOfMonth, endOfMonth, isSameDay } from 'date-fns';
import { Skeleton } from '../Skeleton';
import { Link } from 'react-router-dom';
import { Calendar as CalendarIcon, AlertCircle } from 'lucide-react';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

export const DueDateCalendarView = ({ userId }: { userId?: string }) => {
  const [selectedDate, setSelectedDate] = useState<Value>(new Date());
  const now = new Date();
  const startDate = startOfMonth(now);
  const endDate = endOfMonth(now);

  const { data, isLoading } = useCalendarTasks(userId, startDate, endDate);

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <Skeleton variant="rectangular" width="100%" height={400} />
      </div>
    );
  }

  const tasks = data?.tasks || [];
  const selectedDateStr = selectedDate instanceof Date ? format(selectedDate, 'yyyy-MM-dd') : null;

  // Get tasks for selected date
  const tasksForDate = selectedDateStr
    ? tasks.filter(task => {
        const taskDate = format(new Date(task.dueDate), 'yyyy-MM-dd');
        return taskDate === selectedDateStr;
      })
    : [];

  // Mark dates with tasks
  const tileClassName = ({ date }: { date: Date }) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const hasTasks = tasks.some(task => {
      const taskDate = format(new Date(task.dueDate), 'yyyy-MM-dd');
      return taskDate === dateStr;
    });
    
    const isOverdue = hasTasks && date < now && !isSameDay(date, now);
    const isToday = isSameDay(date, now);
    const isSelected = selectedDate instanceof Date && isSameDay(date, selectedDate);

    let classes = 'hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors';
    
    if (isSelected) {
      classes += ' bg-blue-500 text-white';
    } else if (isToday) {
      classes += ' bg-blue-100 dark:bg-blue-900/30';
    } else if (isOverdue) {
      classes += ' bg-red-100 dark:bg-red-900/30';
    } else if (hasTasks) {
      classes += ' bg-green-100 dark:bg-green-900/30';
    }

    return classes;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200';
      case 'HIGH':
        return 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200';
      case 'MEDIUM':
        return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
      case 'LOW':
        return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DONE':
        return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
      case 'IN_PROGRESS':
        return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200';
      case 'IN_REVIEW':
        return 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200';
      case 'CANCELLED':
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors">
      <div className="flex items-center gap-2 mb-6">
        <CalendarIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Due Date Calendar</h3>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calendar */}
        <div>
          <div className="[&_.react-calendar]:w-full [&_.react-calendar]:border-0 [&_.react-calendar]:bg-transparent">
            <div className="[&_.react-calendar__tile]:text-sm [&_.react-calendar__tile]:p-2 [&_.react-calendar__tile]:rounded">
              <div className="[&_.react-calendar__navigation]:mb-4 [&_.react-calendar__navigation_button]:text-gray-700 [&_.react-calendar__navigation_button]:dark:text-gray-300">
                <Calendar
                  onChange={setSelectedDate}
                  value={selectedDate}
                  tileClassName={tileClassName}
                  className="dark:[&_.react-calendar__navigation]:text-gray-300 dark:[&_.react-calendar__month-view__weekdays]:text-gray-400 dark:[&_.react-calendar__month-view__days__day]:text-gray-300"
                />
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="mt-4 flex flex-wrap gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-green-100 dark:bg-green-900/30"></div>
              <span className="text-gray-600 dark:text-gray-400">Has Tasks</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-red-100 dark:bg-red-900/30"></div>
              <span className="text-gray-600 dark:text-gray-400">Overdue</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-blue-100 dark:bg-blue-900/30"></div>
              <span className="text-gray-600 dark:text-gray-400">Today</span>
            </div>
          </div>
        </div>

        {/* Tasks for Selected Date */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
            {selectedDateStr 
              ? `Tasks due on ${format(selectedDate instanceof Date ? selectedDate : new Date(), 'MMMM d, yyyy')}`
              : 'Select a date to view tasks'
            }
          </h4>
          
          {tasksForDate.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <CalendarIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No tasks due on this date</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {tasksForDate.map((task) => {
                const isOverdue = new Date(task.dueDate) < now && task.status !== 'DONE';
                return (
                  <Link
                    key={task.id}
                    to={`/tasks/${task.id}`}
                    className="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h5 className="font-medium text-gray-900 dark:text-gray-100">{task.title}</h5>
                          {isOverdue && (
                            <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                          )}
                        </div>
                        {task.projectName && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            Project: {task.projectName}
                          </p>
                        )}
                        <div className="flex gap-2 flex-wrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(task.status)}`}>
                            {task.status.replace('_', ' ')}
                          </span>
                          <span className={`px-2 py-1 text-xs font-medium rounded ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


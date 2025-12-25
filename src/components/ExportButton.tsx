import { useState } from 'react';
import { Download, FileSpreadsheet, FileText, Calendar } from 'lucide-react';
import { useExportTasksExcel, useExportTasksCSV, useExportProjectsPDF } from '../hooks/useExport';
import type { ExportFilters } from '../api/export';

interface ExportButtonProps {
  type: 'tasks' | 'projects';
  filters?: ExportFilters;
  className?: string;
}

export const ExportButton = ({ type, filters, className }: ExportButtonProps) => {
  const [showDateRange, setShowDateRange] = useState(false);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const exportTasksExcel = useExportTasksExcel();
  const exportTasksCSV = useExportTasksCSV();
  const exportProjectsPDF = useExportProjectsPDF();

  const handleExport = (format: 'excel' | 'csv' | 'pdf') => {
    const exportFilters: ExportFilters = {
      ...filters,
    };

    if (startDate) {
      exportFilters.startDate = new Date(startDate);
    }
    if (endDate) {
      exportFilters.endDate = new Date(endDate);
    }

    if (type === 'tasks') {
      if (format === 'excel') {
        exportTasksExcel.mutate(exportFilters);
      } else {
        exportTasksCSV.mutate(exportFilters);
      }
    } else {
      exportProjectsPDF.mutate(exportFilters);
    }

    setShowDateRange(false);
  };

  const isLoading =
    exportTasksExcel.isPending || exportTasksCSV.isPending || exportProjectsPDF.isPending;

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setShowDateRange(!showDateRange)}
        disabled={isLoading}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        title={`Export ${type === 'tasks' ? 'Tasks' : 'Projects'}`}
      >
        <Download className="h-4 w-4" />
        {isLoading ? 'Exporting...' : `Export ${type === 'tasks' ? 'Tasks' : 'Projects'}`}
      </button>

      {showDateRange && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowDateRange(false)}
          />
          <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-20 border border-gray-200 dark:border-gray-700">
            <div className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Export Options</h3>
              </div>

              {/* Date Range */}
              <div className="space-y-3 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Start Date (optional)
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    End Date (optional)
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              {/* Export Buttons */}
              <div className="space-y-2">
                {type === 'tasks' ? (
                  <>
                    <button
                      onClick={() => handleExport('excel')}
                      disabled={isLoading}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 dark:bg-green-500 text-white rounded-md hover:bg-green-700 dark:hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FileSpreadsheet className="h-4 w-4" />
                      Export to Excel
                    </button>
                    <button
                      onClick={() => handleExport('csv')}
                      disabled={isLoading}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FileText className="h-4 w-4" />
                      Export to CSV
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleExport('pdf')}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 dark:bg-red-500 text-white rounded-md hover:bg-red-700 dark:hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FileText className="h-4 w-4" />
                    Export to PDF
                  </button>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};


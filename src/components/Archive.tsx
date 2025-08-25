import { useState, useEffect } from 'react';
import { Calendar, Filter, Download, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import * as mobx from 'mobx';
import { observer } from 'mobx-react-lite';

// Define custom types for better type safety
type TimeFilter = 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly';
type Status = 'success' | 'warning' | 'error';

// MobX Store (No changes to logic)
class ArchiveDataStore {
    constructor() {
        mobx.makeAutoObservable(this);
    }

    // State
    startDate = new Date(new Date().setMonth(new Date().getMonth() - 1));
    endDate = new Date();
    startTime = '00:00';
    endTime = '23:59';
    timeFilter: TimeFilter = 'daily';
    currentPage = 1;
    itemsPerPage = 10;
    filteredData: {
        id: number;
        timestamp: Date;
        value: number;
        status: Status;
        category: string;
        details: string;
        volume: number;
    }[] = [];
    isLoading = false;
    showStartCalendar = false;
    showEndCalendar = false;

    // Dummy data generator
    generateDummyData() {
        const data = [];
        const startDateTime = new Date(this.startDate);
        const [startHours, startMinutes] = this.startTime.split(':').map(Number);
        startDateTime.setHours(startHours, startMinutes, 0, 0);

        const endDateTime = new Date(this.endDate);
        const [endHours, endMinutes] = this.endTime.split(':').map(Number);
        endDateTime.setHours(endHours, endMinutes, 59, 999);

        let current = new Date(startDateTime);
        let increment;

        switch (this.timeFilter) {
            case 'hourly': increment = 60 * 60 * 1000; break;
            case 'daily': increment = 24 * 60 * 60 * 1000; break;
            case 'weekly': increment = 7 * 24 * 60 * 60 * 1000; break;
            case 'monthly': increment = 30 * 24 * 60 * 60 * 1000; break;
            case 'yearly': increment = 365 * 24 * 60 * 60 * 1000; break;
            default: increment = 24 * 60 * 60 * 1000;
        }

        while (current <= endDateTime) {
            const baseValue = Math.random() * 1000 + 500;
            data.push({
                id: data.length + 1,
                timestamp: new Date(current),
                value: Math.round(baseValue * 100) / 100,
                status: (Math.random() > 0.8 ? 'warning' : Math.random() > 0.9 ? 'error' : 'success') as Status,
                category: ['Analytics', 'Performance', 'Security', 'Usage'][Math.floor(Math.random() * 4)],
                details: `Sample data point ${data.length + 1}`,
                volume: Math.floor(Math.random() * 10000) + 1000
            });
            current = new Date(current.getTime() + increment);
        }

        return data.slice(0, 1000);
    }

    // Actions
    setStartDate = (date: Date) => { this.startDate = date; this.showStartCalendar = false; this.loadData(); }
    setEndDate = (date: Date) => { this.endDate = date; this.showEndCalendar = false; this.loadData(); }
    setStartTime = (time: string) => { this.startTime = time; this.loadData(); }
    setEndTime = (time:string) => { this.endTime = time; this.loadData(); }
    setTimeFilter = (filter: string) => { this.timeFilter = filter as TimeFilter; this.currentPage = 1; this.loadData(); }
    setCurrentPage = (page: number) => { this.currentPage = page; }
    toggleStartCalendar = () => { this.showStartCalendar = !this.showStartCalendar; this.showEndCalendar = false; }
    toggleEndCalendar = () => { this.showEndCalendar = !this.showEndCalendar; this.showStartCalendar = false; }
    loadData = () => {
        this.isLoading = true;
        setTimeout(() => {
            this.filteredData = this.generateDummyData();
            this.isLoading = false;
        }, 500);
    }

    // Computed values
    get totalPages() { return Math.ceil(this.filteredData.length / this.itemsPerPage); }
    get paginatedData() { const start = (this.currentPage - 1) * this.itemsPerPage; const end = start + this.itemsPerPage; return this.filteredData.slice(start, end); }
    get summaryStats() { const data = this.filteredData; return { total: data.length, avgValue: data.length ? (data.reduce((sum, item) => sum + item.value, 0) / data.length).toFixed(2) : 0, successCount: data.filter(item => item.status === 'success').length, warningCount: data.filter(item => item.status === 'warning').length, errorCount: data.filter(item => item.status === 'error').length }; }
}

const store = new ArchiveDataStore();

const ArchiveDataComponent = observer(() => {
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    store.loadData();
    const handleClickOutside = (event: MouseEvent) => { if (!(event.target as HTMLElement).closest('.calendar-container')) { store.showStartCalendar = false; store.showEndCalendar = false; } };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatDisplayDate = (date: Date) => { return date.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }); };

  const generateCalendarDays = (date: Date) => {
    const year = date.getFullYear(); const month = date.getMonth(); const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay); startDate.setDate(startDate.getDate() - firstDay.getDay());
    const days = []; const current = new Date(startDate);
    for (let i = 0; i < 42; i++) { days.push(new Date(current)); current.setDate(current.getDate() + 1); }
    return days;
  };

  interface DatePickerCalendarProps { selectedDate: Date; onDateSelect: (date: Date) => void; show: boolean; }
  
  const DatePickerCalendar = ({ selectedDate, onDateSelect, show }: DatePickerCalendarProps) => {
    const [viewDate, setViewDate] = useState(new Date(selectedDate));
    const days = generateCalendarDays(viewDate);
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    if (!show) return null;
    return (
      <div className="calendar-container absolute top-full left-0 z-50 mt-2 bg-zinc-800 border border-zinc-700 rounded-lg shadow-2xl p-4 w-80">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => setViewDate(new Date(viewDate.setMonth(viewDate.getMonth() - 1)))} className="p-1 hover:bg-zinc-700 rounded transition-colors"><ChevronLeft size={20} className="text-zinc-300" /></button>
          <h3 className="font-semibold text-zinc-100">{monthNames[viewDate.getMonth()]} {viewDate.getFullYear()}</h3>
          <button onClick={() => setViewDate(new Date(viewDate.setMonth(viewDate.getMonth() + 1)))} className="p-1 hover:bg-zinc-700 rounded transition-colors"><ChevronRight size={20} className="text-zinc-300" /></button>
        </div>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (<div key={day} className="text-center text-xs font-medium text-zinc-400 py-2">{day}</div>))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => {
            const isCurrentMonth = day.getMonth() === viewDate.getMonth();
            const isSelected = day.toDateString() === selectedDate.toDateString();
            const isToday = day.toDateString() === new Date().toDateString();
            return (
              <button key={index} onClick={() => onDateSelect(new Date(day))}
                className={`p-2 text-sm rounded-md transition-colors font-medium ${isCurrentMonth ? 'text-zinc-200' : 'text-zinc-600'} ${isSelected ? 'bg-[rgb(234,179,8)] text-zinc-900 hover:bg-yellow-400' : 'hover:bg-zinc-700'} ${isToday && !isSelected ? 'border border-[rgb(234,179,8)]/50' : ''}`}>
                {day.getDate()}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const formatTimestamp = (timestamp: Date) => {
    const options: Record<TimeFilter, Intl.DateTimeFormatOptions> = { hourly: { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', hour12: false }, daily: { day: '2-digit', month: '2-digit', year: 'numeric' }, weekly: { day: '2-digit', month: '2-digit', year: 'numeric' }, monthly: { month: 'short', year: 'numeric' }, yearly: { year: 'numeric' } };
    if (store.timeFilter === 'hourly') { return timestamp.toLocaleString('en-GB', options[store.timeFilter]); }
    return timestamp.toLocaleDateString('en-US', options[store.timeFilter]);
  };

  const getStatusColor = (status: Status) => {
    const colors: Record<Status, string> = { success: 'bg-green-500/10 text-green-400', warning: 'bg-yellow-500/10 text-yellow-400', error: 'bg-red-500/10 text-red-400' };
    return colors[status] || 'bg-zinc-700 text-zinc-300';
  };

  const timeFilters = [{ value: 'hourly', label: 'Hourly' }, { value: 'daily', label: 'Daily' }, { value: 'weekly', label: 'Weekly' }, { value: 'monthly', label: 'Monthly' }, { value: 'yearly', label: 'Yearly' }];

  return (
    <div className="w-full min-h-screen bg-[rgb(24,24,27)] text-zinc-200 p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-7xl mx-auto space-y-6">
        <div className="bg-zinc-900/50 rounded-lg shadow-2xl border border-zinc-800 p-6">
          <h1 className="text-3xl font-bold text-zinc-100 mb-6">Archive Data</h1>
          <div className="flex flex-col lg:flex-row lg:items-end gap-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex flex-col relative"><label className="text-sm font-medium text-zinc-400 mb-2">Start Date & Time</label>
                <div className="flex gap-2">
                  <div className="relative"><button onClick={store.toggleStartCalendar} className="flex items-center gap-2 px-3 py-2 border border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[rgb(234,179,8)] bg-zinc-800 hover:bg-zinc-700 transition-colors"><Calendar size={18} className="text-zinc-400" /><span className="text-sm">{formatDisplayDate(store.startDate)}</span></button><DatePickerCalendar selectedDate={store.startDate} onDateSelect={store.setStartDate} show={store.showStartCalendar} /></div>
                  <div className="relative"><input type="time" value={store.startTime} onChange={(e) => store.setStartTime(e.target.value)} className="px-3 py-2 w-32 bg-zinc-800 border border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[rgb(234,179,8)]" /><Clock size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-500 pointer-events-none" /></div>
                </div>
              </div>
              <div className="flex flex-col relative"><label className="text-sm font-medium text-zinc-400 mb-2">End Date & Time</label>
                <div className="flex gap-2">
                  <div className="relative"><button onClick={store.toggleEndCalendar} className="flex items-center gap-2 px-3 py-2 border border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[rgb(234,179,8)] bg-zinc-800 hover:bg-zinc-700 transition-colors"><Calendar size={18} className="text-zinc-400" /><span className="text-sm">{formatDisplayDate(store.endDate)}</span></button><DatePickerCalendar selectedDate={store.endDate} onDateSelect={store.setEndDate} show={store.showEndCalendar} /></div>
                  <div className="relative"><input type="time" value={store.endTime} onChange={(e) => store.setEndTime(e.target.value)} className="px-3 py-2 w-32 bg-zinc-800 border border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[rgb(234,179,8)]" /><Clock size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-500 pointer-events-none" /></div>
                </div>
              </div>
            </div>
            <div className="flex flex-col"><label className="text-sm font-medium text-zinc-400 mb-2">Time Period</label><select value={store.timeFilter} onChange={(e) => store.setTimeFilter(e.target.value)} className="px-3 py-2 border border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[rgb(234,179,8)] bg-zinc-800 hover:bg-zinc-700 transition-colors"><option disabled>Select Period</option>{timeFilters.map(filter => (<option key={filter.value} value={filter.value}>{filter.label}</option>))}</select></div>
            <div className="flex gap-2 lg:ml-auto"><button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 rounded-md transition-colors"><Filter size={16} />Filters</button><button className="flex items-center gap-2 px-4 py-2 bg-[rgb(234,179,8)] hover:bg-yellow-600 text-zinc-900 font-bold rounded-md transition-colors"><Download size={16} />Export</button></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-zinc-800/50 p-4 rounded-lg border-t-4 border-zinc-500"><div className="text-3xl font-bold text-zinc-100">{store.summaryStats.total}</div><div className="text-sm text-zinc-400">Total Records</div></div>
            <div className="bg-zinc-800/50 p-4 rounded-lg border-t-4 border-blue-500"><div className="text-3xl font-bold text-zinc-100">{store.summaryStats.avgValue}</div><div className="text-sm text-zinc-400">Avg Value</div></div>
            <div className="bg-zinc-800/50 p-4 rounded-lg border-t-4 border-green-500"><div className="text-3xl font-bold text-green-400">{store.summaryStats.successCount}</div><div className="text-sm text-zinc-400">Success</div></div>
            <div className="bg-zinc-800/50 p-4 rounded-lg border-t-4 border-yellow-500"><div className="text-3xl font-bold text-yellow-400">{store.summaryStats.warningCount}</div><div className="text-sm text-zinc-400">Warnings</div></div>
            <div className="bg-zinc-800/50 p-4 rounded-lg border-t-4 border-red-500"><div className="text-3xl font-bold text-red-400">{store.summaryStats.errorCount}</div><div className="text-sm text-zinc-400">Errors</div></div>
          </div>
        </div>
        <div className="bg-zinc-900/50 rounded-lg shadow-2xl border border-zinc-800 overflow-hidden">
          {store.isLoading ? (<div className="flex items-center justify-center h-96"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[rgb(234,179,8)]"></div></div>) : (
            <>
              <div className="hidden md:block overflow-x-auto"><table className="w-full text-sm">
                  <thead className="bg-zinc-800/50"><tr >
                      <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Timestamp</th><th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Value</th><th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Status</th><th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Category</th><th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Volume</th><th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Details</th>
                  </tr></thead>
                  <tbody className="divide-y divide-zinc-800">
                    {store.paginatedData.map((item) => (<tr key={item.id} className="hover:bg-zinc-800/60 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-zinc-300">{formatTimestamp(item.timestamp)}</td><td className="px-6 py-4 whitespace-nowrap font-medium text-zinc-100">{item.value}</td><td className="px-6 py-4 whitespace-nowrap"><span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getStatusColor(item.status)}`}>{item.status}</span></td><td className="px-6 py-4 whitespace-nowrap text-zinc-300">{item.category}</td><td className="px-6 py-4 whitespace-nowrap text-zinc-300">{item.volume.toLocaleString()}</td><td className="px-6 py-4 text-zinc-400">{item.details}</td>
                    </tr>))}
                  </tbody>
              </table></div>
              <div className="md:hidden divide-y divide-zinc-800">
                {store.paginatedData.map((item) => (<div key={item.id} className="p-4">
                    <div className="flex justify-between items-start mb-2"><div className="text-sm font-medium text-zinc-100">{formatTimestamp(item.timestamp)}</div><span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getStatusColor(item.status)}`}>{item.status}</span></div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm"><div className="text-zinc-400">Value: <span className="ml-1 font-medium text-zinc-200">{item.value}</span></div><div className="text-zinc-400">Category: <span className="ml-1 text-zinc-200">{item.category}</span></div><div className="text-zinc-400">Volume: <span className="ml-1 text-zinc-200">{item.volume.toLocaleString()}</span></div></div>
                    <div className="mt-2 text-sm text-zinc-400">{item.details}</div>
                </div>))}
              </div>
              <div className="bg-zinc-900/50 px-4 py-3 flex items-center justify-between border-t border-zinc-800 sm:px-6">
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div><p className="text-sm text-zinc-400">Showing <span className="font-medium text-zinc-200">{(store.currentPage - 1) * store.itemsPerPage + 1}</span> to <span className="font-medium text-zinc-200">{Math.min(store.currentPage * store.itemsPerPage, store.filteredData.length)}</span> of <span className="font-medium text-zinc-200">{store.filteredData.length}</span> results</p></div>
                  <div><nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button onClick={() => store.setCurrentPage(Math.max(1, store.currentPage - 1))} disabled={store.currentPage === 1} className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-zinc-700 bg-zinc-800 text-sm font-medium text-zinc-400 hover:bg-zinc-700 disabled:opacity-40 transition-colors"><ChevronLeft size={20} /></button>
                      {Array.from({ length: Math.min(5, store.totalPages) }, (_, i) => { const page = i + 1; return (<button key={page} onClick={() => store.setCurrentPage(page)} className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium transition-colors ${page === store.currentPage ? 'z-10 bg-[rgb(234,179,8)] border-[rgb(234,179,8)] text-zinc-900 font-bold' : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700'}`}>{page}</button>); })}
                      <button onClick={() => store.setCurrentPage(Math.min(store.totalPages, store.currentPage + 1))} disabled={store.currentPage === store.totalPages} className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-zinc-700 bg-zinc-800 text-sm font-medium text-zinc-400 hover:bg-zinc-700 disabled:opacity-40 transition-colors"><ChevronRight size={20} /></button>
                  </nav></div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
});

export default ArchiveDataComponent;
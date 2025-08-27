import { useState, useEffect } from "react";
import { Calendar, Filter, ChevronLeft, ChevronRight, Clock, ArrowLeft, X } from "lucide-react";
import * as mobx from "mobx";
import { observer } from "mobx-react-lite";
import globalStore from "../stores/GlobalStore";

import { sendMessage, addListener, removeListener, connectWebSocket } from "../utils/api";

type TimeFilter = "minute" | "hourly" | "daily" | "weekly" | "monthly" | "yearly";
type Status = "success" | "warning" | "error";

interface ArchiveItem {
  id: number;
  timestamp: Date;
  value: number;
  status: Status;
  category: string;
  details: string;
  volume: number;
}

class ArchiveDataStore {
  constructor() {
    mobx.makeAutoObservable(this);
  }

  startDate = new Date('2022-04-26');
  endDate = new Date('2022-04-29');
  startTime = "00:00";
  endTime = "23:59";
  timeFilter: TimeFilter = "hourly";
  rawData: any[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  filteredData: ArchiveItem[] = [];
  isLoading = false;
  showStartCalendar = false;
  showEndCalendar = false;

  streamId: string | null = null;
  
  setStreamId = (id: string) => {
    this.streamId = id;
  };
  
  get currentStreamId() {
    return this.streamId;
  }
  
  get currentProfileId() {
    // Find the specific stream by ID
    const stream = globalStore.streams.find(s => s.id === this.currentStreamId);
    return stream?.stream_config?.calculation_profile?.active_profile_id;
  }

  get paginatedData() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.rawData.slice(start, start + this.itemsPerPage);
  }

  get totalPages() {
    return Math.ceil(this.rawData.length / this.itemsPerPage);
  }

  requestArchiveData = async () => {
    const startDateTime = new Date(this.startDate);
    const [startHours, startMinutes] = this.startTime.split(":").map(Number);
    startDateTime.setHours(startHours, startMinutes, 0, 0);
    
    const endDateTime = new Date(this.endDate);
    const [endHours, endMinutes] = this.endTime.split(":").map(Number);
    endDateTime.setHours(endHours, endMinutes, 0, 0);
    
    const archiveTypeMap = {
      minute: "minute", hourly: "hour", daily: "day", weekly: "week", monthly: "month", yearly: "year"
    };
    
    const request = {
      scope: "get_archives",
      stream_id: this.currentStreamId,
      profile_id: this.currentProfileId,
      archive_type: archiveTypeMap[this.timeFilter] || "minute",
      start_date: startDateTime.toISOString().slice(0, 19).replace('T', ' '),
      end_date: endDateTime.toISOString().slice(0, 19).replace('T', ' ')
    };
    
    console.log('Sending archive request:', request);
    
    try {
      await connectWebSocket();
      sendMessage(request);
    } catch (error) {
      this.isLoading = false;
    }
  };

  handleWebSocketMessage = mobx.action((event: MessageEvent) => {
    try {
      const data = JSON.parse(event.data);
      console.log('WebSocket Response:', data);
      
      if (data.results && Array.isArray(data.results)) {
        console.log('Archive data received:', data.results.length, 'records');
        console.log('First few records:', data.results.slice(0, 3));
        this.rawData = data.results;
        this.isLoading = false;
      } else {
        console.log('No results array found in response');
      }
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
      this.isLoading = false;
    }
  });

  processData = mobx.action(() => {
    if (!this.rawData?.length) {
      this.filteredData = [];
      return;
    }
    
    this.filteredData = this.rawData.map((record, index) => ({
      id: index + 1,
      timestamp: new Date(record.current_system_timestamp || Date.now()),
      value: record.device_flow_rate || record.operating_flow_rate || record.current_volume_original || 0,
      status: (record.interference_flag ? 'warning' : 'success') as Status,
      category: record.method_name || 'Archive',
      details: 'Archive data',
      volume: record.operating_total_volume_net || record.current_volume_original || 0
    }));
  });

  extractValue = (record: any): number => {
    if (typeof record === 'object' && record !== null) {
      // Prioritize flow rate fields from your data structure
      if (record.device_flow_rate !== undefined && record.device_flow_rate !== null) return Number(record.device_flow_rate);
      if (record.operating_flow_rate !== undefined) return Number(record.operating_flow_rate);
      if (record.standard_flow_rate !== undefined) return Number(record.standard_flow_rate);
      if (record.current_volume_original !== undefined) return Number(record.current_volume_original);
      
      // Fallback to other numeric fields
      if (record.value !== undefined) return Number(record.value);
      if (record.measurement !== undefined) return Number(record.measurement);
    }
    return 0;
  };

  determineStatus = (record: any): Status => {
    if (typeof record === 'object' && record !== null) {
      if (record.interference_flag === true) return 'warning';
      if (record.last_status_ok === false) return 'error';
      if (record.error || record.error_flag || record.status === 'error') return 'error';
    }
    return 'success';
  };

  extractVolume = (record: any): number => {
    if (typeof record === 'object' && record !== null) {
      if (record.operating_total_volume_net !== undefined) return Number(record.operating_total_volume_net);
      if (record.standard_total_volume_net !== undefined) return Number(record.standard_total_volume_net);
      if (record.current_volume_original !== undefined) return Number(record.current_volume_original);
      if (record.volume !== undefined) return Number(record.volume);
    }
    return 0;
  };

  setStartDate = mobx.action((date: Date) => {
    this.startDate = date;
    this.showStartCalendar = false;
    this.loadData();
  });

  setEndDate = mobx.action((date: Date) => {
    this.endDate = date;
    this.showEndCalendar = false;
    this.loadData();
  });

  setStartTime = mobx.action((time: string) => {
    this.startTime = time;
    this.loadData();
  });

  setEndTime = mobx.action((time: string) => {
    this.endTime = time;
    this.loadData();
  });

  setTimeFilter = mobx.action((filter: string) => {
    this.timeFilter = filter as TimeFilter;
    this.currentPage = 1;
    this.loadData();
  });

  setCurrentPage = mobx.action((page: number) => {
    this.currentPage = page;
  });

  toggleStartCalendar = mobx.action(() => {
    this.showStartCalendar = !this.showStartCalendar;
    this.showEndCalendar = false;
  });

  toggleEndCalendar = mobx.action(() => {
    this.showEndCalendar = !this.showEndCalendar;
    this.showStartCalendar = false;
  });

  loadData = mobx.action(() => {
    if (!this.currentStreamId || this.isLoading) {
      return;
    }
    
    this.isLoading = true;
    this.requestArchiveData();
    
    // Clear any existing timeout
    if (this.loadingTimeout) {
      clearTimeout(this.loadingTimeout);
    }
    
    this.loadingTimeout = setTimeout(mobx.action(() => {
      if (this.isLoading) {
        this.isLoading = false;
      }
    }), 5000);
  });

  loadingTimeout: number | null = null;

  setupWebSocketListener = () => {
    // Remove any existing listener first to prevent duplicates
    removeListener(this.handleWebSocketMessage);
    addListener(this.handleWebSocketMessage);
  };

  cleanup = () => {
    removeListener(this.handleWebSocketMessage);
  };
}

const DatePickerCalendar = ({ selectedDate, onDateSelect, show }: {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  show: boolean;
}) => {
  const [viewDate, setViewDate] = useState(new Date(selectedDate));
  
  if (!show) return null;

  const generateCalendarDays = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    const days = [];
    const current = new Date(startDate);
    for (let i = 0; i < 42; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return days;
  };

  const days = generateCalendarDays(viewDate);
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  return (
    <div className="calendar-container absolute top-full left-0 z-[9999] mt-2 bg-slate-700/95 backdrop-blur-sm border border-slate-500/50 rounded-lg sm:rounded-xl shadow-2xl p-3 sm:p-4 lg:p-6 w-72 sm:w-80 max-w-[calc(100vw-2rem)]">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setViewDate(new Date(viewDate.setMonth(viewDate.getMonth() - 1)))}
          className="p-2 hover:bg-slate-600/50 rounded-lg transition-all duration-200"
        >
          <ChevronLeft size={20} className="text-slate-200" />
        </button>
        <h3 className="font-bold text-slate-100 text-lg">
          {monthNames[viewDate.getMonth()]} {viewDate.getFullYear()}
        </h3>
        <button
          onClick={() => setViewDate(new Date(viewDate.setMonth(viewDate.getMonth() + 1)))}
          className="p-2 hover:bg-slate-600/50 rounded-lg transition-all duration-200"
        >
          <ChevronRight size={20} className="text-slate-200" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-3">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
          <div key={day} className="text-center text-xs font-bold text-slate-300 py-2">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          const isCurrentMonth = day.getMonth() === viewDate.getMonth();
          const isSelected = day.toDateString() === selectedDate.toDateString();
          const isToday = day.toDateString() === new Date().toDateString();
          return (
            <button
              key={index}
              onClick={() => onDateSelect(new Date(day))}
              className={`p-2 text-sm rounded-lg transition-all duration-200 font-medium ${
                isCurrentMonth ? "text-slate-200" : "text-slate-500"
              } ${
                isSelected
                  ? "bg-gradient-to-r from-yellow-500 to-amber-600 text-black hover:from-yellow-600 hover:to-amber-700 shadow-lg"
                  : "hover:bg-slate-600/50"
              } ${
                isToday && !isSelected ? "border border-yellow-400/50" : ""
              }`}
            >
              {day.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// Create a global store instance to avoid multiple instances
const archiveStore = new ArchiveDataStore();

const ArchiveDataComponent = observer(({ streamId, onClose }: { streamId?: string; onClose?: () => void }) => {
  
  useEffect(() => {
    if (streamId) {
      archiveStore.setStreamId(streamId);
      archiveStore.rawData = [];
      archiveStore.currentPage = 1;
      setTimeout(() => archiveStore.loadData(), 100);
    }
    
    archiveStore.setupWebSocketListener();
    
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as HTMLElement).closest(".calendar-container")) {
        archiveStore.showStartCalendar = false;
        archiveStore.showEndCalendar = false;
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      archiveStore.cleanup();
    };
  }, [streamId]);

  const formatDisplayDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short", year: "numeric", month: "short", day: "numeric",
    });
  };

  const timeFilters = [
    { value: "minute", label: "Minute" },
    { value: "hourly", label: "Hourly" },
    { value: "daily", label: "Daily" },
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" },
    { value: "yearly", label: "Yearly" },
  ];

  const DateTimeInput = ({ 
    label, 
    date, 
    time, 
    showCalendar, 
    onDateClick, 
    onTimeChange, 
    onDateSelect 
  }: {
    label: string;
    date: Date;
    time: string;
    showCalendar: boolean;
    onDateClick: () => void;
    onTimeChange: (time: string) => void;
    onDateSelect: (date: Date) => void;
  }) => (
    <div className="flex flex-col relative z-[100]">
      <label className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wide">
        {label}
      </label>
      <div className="flex gap-3">
        <div className="relative z-[100] flex-1 min-w-0">
          <button
            onClick={onDateClick}
            className="flex items-center gap-3 px-4 py-3 h-12 w-full border border-slate-500/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500/50 bg-slate-600/50 hover:bg-slate-600/70 transition-all duration-200 shadow-sm"
          >
            <Calendar size={18} className="text-slate-300 flex-shrink-0" />
            <span className="text-sm font-medium text-slate-100 truncate">
              {formatDisplayDate(date)}
            </span>
          </button>
          <DatePickerCalendar
            selectedDate={date}
            onDateSelect={onDateSelect}
            show={showCalendar}
          />
        </div>
        <div className="relative w-36 flex-shrink-0">
          <input
            type="time"
            value={time}
            onChange={(e) => onTimeChange(e.target.value)}
            className="px-4 py-3 w-full h-12 bg-gray-800 border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500/50 text-slate-100 font-medium shadow-sm"
          />
          <Clock size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-gray-800 text-slate-100">
      {onClose && (
        <div className="mb-6">
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-800 text-slate-200 rounded-lg transition-all duration-200 border border-gray-800"
          >
            <X />
            Close Archive
          </button>
        </div>
      )}
      <div className="w-full max-w-7xl mx-auto space-y-4 sm:space-y-6 lg:space-y-8">
        {/* Header Section */}
        <div className="bg-gray-800 backdrop-blur-sm rounded-lg sm:rounded-xl shadow-2xl p-4 sm:p-6 lg:p-8 relative z-[200]">
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-lg flex items-center justify-center shadow-lg">
              <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-50 tracking-tight">
                Archive Data
              </h1>
              <p className="text-slate-300 text-xs sm:text-sm hidden sm:block">Stream {archiveStore.currentStreamId} Historical Data</p>
            </div>
          </div>
          
          {/* Control Panel */}
          <div className="bg-gray-800 rounded-lg p-3 sm:p-4 lg:p-6 border relative z-[50]">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6 items-end">
              <DateTimeInput
                label="Start Date & Time"
                date={archiveStore.startDate}
                time={archiveStore.startTime}
                showCalendar={archiveStore.showStartCalendar}
                onDateClick={archiveStore.toggleStartCalendar}
                onTimeChange={archiveStore.setStartTime}
                onDateSelect={archiveStore.setStartDate}
              />
              <DateTimeInput
                label="End Date & Time"
                date={archiveStore.endDate}
                time={archiveStore.endTime}
                showCalendar={archiveStore.showEndCalendar}
                onDateClick={archiveStore.toggleEndCalendar}
                onTimeChange={archiveStore.setEndTime}
                onDateSelect={archiveStore.setEndDate}
              />
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wide">
                  Time Period
                </label>
                <div className="relative">
                  <select
                    value={archiveStore.timeFilter}
                    onChange={(e) => archiveStore.setTimeFilter(e.target.value)}
                    className="px-4 py-3 h-12 w-full border border-slate-500/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500/50 bg-gray-800 hover:bg-gray-600/70 transition-all duration-200 text-slate-100 font-medium shadow-sm appearance-none cursor-pointer"
                  >
                    <option disabled>Select Period</option>
                    {timeFilters.map((filter) => (
                      <option key={filter.value} value={filter.value}>
                        {filter.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="flex justify-end md:col-span-2 xl:col-span-1">
                <button
                  onClick={() => archiveStore.loadData()}
                  className="flex items-center gap-3 px-6 py-3 h-12 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-black rounded-lg transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 w-full xl:w-auto"
                >
                  <Filter size={18} />
                  Get Archive
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Data Table Section */}
        <div className="bg-gradient-to-r from-slate-800/90 to-slate-700/90 backdrop-blur-sm rounded-xl shadow-2xl border border-slate-600/50">
          {archiveStore.isLoading ? (
            <div className="flex flex-col items-center justify-center h-96">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-600 border-t-yellow-500 shadow-lg"></div>
              <p className="mt-4 text-slate-300 font-medium">Loading archive data...</p>
            </div>
          ) : (
            <>
              {/* Desktop Table with Horizontal Scroll */}
              <div className="overflow-x-auto rounded-xl">
                <table className="w-full text-sm">
                  <thead className="bg-gradient-to-r from-slate-700/80 to-slate-600/80 sticky top-0">
                    <tr>
                      <th className="px-2 py-2 text-left text-xs font-bold text-slate-200 uppercase tracking-wider border-b border-slate-500/30">ID</th>
                      <th className="px-2 py-2 text-left text-xs font-bold text-slate-200 uppercase tracking-wider border-b border-slate-500/30">System Timestamp</th>
                      <th className="px-2 py-2 text-left text-xs font-bold text-slate-200 uppercase tracking-wider border-b border-slate-500/30">Delta Time</th>
                      <th className="px-2 py-2 text-left text-xs font-bold text-slate-200 uppercase tracking-wider border-b border-slate-500/30">Last Volume</th>
                      <th className="px-2 py-2 text-left text-xs font-bold text-slate-200 uppercase tracking-wider border-b border-slate-500/30">Current Volume</th>
                      <th className="px-2 py-2 text-left text-xs font-bold text-slate-200 uppercase tracking-wider border-b border-slate-500/30">Delta Volume</th>
                      <th className="px-2 py-2 text-left text-xs font-bold text-slate-200 uppercase tracking-wider border-b border-slate-500/30">Operating Temp</th>
                      <th className="px-2 py-2 text-left text-xs font-bold text-slate-200 uppercase tracking-wider border-b border-slate-500/30">Base Temp</th>
                      <th className="px-2 py-2 text-left text-xs font-bold text-slate-200 uppercase tracking-wider border-b border-slate-500/30">Temp Unit</th>
                      <th className="px-2 py-2 text-left text-xs font-bold text-slate-200 uppercase tracking-wider border-b border-slate-500/30">Operating Press</th>
                      <th className="px-2 py-2 text-left text-xs font-bold text-slate-200 uppercase tracking-wider border-b border-slate-500/30">Base Press</th>
                      <th className="px-2 py-2 text-left text-xs font-bold text-slate-200 uppercase tracking-wider border-b border-slate-500/30">Press Unit</th>
                      <th className="px-2 py-2 text-left text-xs font-bold text-slate-200 uppercase tracking-wider border-b border-slate-500/30">Device Flow Rate</th>
                      <th className="px-2 py-2 text-left text-xs font-bold text-slate-200 uppercase tracking-wider border-b border-slate-500/30">Software Flow Rate</th>
                      <th className="px-2 py-2 text-left text-xs font-bold text-slate-200 uppercase tracking-wider border-b border-slate-500/30">CH4</th>
                      <th className="px-2 py-2 text-left text-xs font-bold text-slate-200 uppercase tracking-wider border-b border-slate-500/30">N2</th>
                      <th className="px-2 py-2 text-left text-xs font-bold text-slate-200 uppercase tracking-wider border-b border-slate-500/30">CO2</th>
                      <th className="px-2 py-2 text-left text-xs font-bold text-slate-200 uppercase tracking-wider border-b border-slate-500/30">C2H6</th>
                      <th className="px-2 py-2 text-left text-xs font-bold text-slate-200 uppercase tracking-wider border-b border-slate-500/30">C3H8</th>
                      <th className="px-2 py-2 text-left text-xs font-bold text-slate-200 uppercase tracking-wider border-b border-slate-500/30">I_C4H10</th>
                      <th className="px-2 py-2 text-left text-xs font-bold text-slate-200 uppercase tracking-wider border-b border-slate-500/30">N_C4H10</th>
                      <th className="px-2 py-2 text-left text-xs font-bold text-slate-200 uppercase tracking-wider border-b border-slate-500/30">I_C5H12</th>
                      <th className="px-2 py-2 text-left text-xs font-bold text-slate-200 uppercase tracking-wider border-b border-slate-500/30">N_C5H12</th>
                      <th className="px-2 py-2 text-left text-xs font-bold text-slate-200 uppercase tracking-wider border-b border-slate-500/30">C6H14</th>
                      <th className="px-2 py-2 text-left text-xs font-bold text-slate-200 uppercase tracking-wider border-b border-slate-500/30">C7H16</th>
                      <th className="px-2 py-2 text-left text-xs font-bold text-slate-200 uppercase tracking-wider border-b border-slate-500/30">C8H18</th>
                      <th className="px-2 py-2 text-left text-xs font-bold text-slate-200 uppercase tracking-wider border-b border-slate-500/30">C9H20</th>
                      <th className="px-2 py-2 text-left text-xs font-bold text-slate-200 uppercase tracking-wider border-b border-slate-500/30">C10H22</th>
                      <th className="px-2 py-2 text-left text-xs font-bold text-slate-200 uppercase tracking-wider border-b border-slate-500/30">H2</th>
                      <th className="px-2 py-2 text-left text-xs font-bold text-slate-200 uppercase tracking-wider border-b border-slate-500/30">H2S</th>
                      <th className="px-2 py-2 text-left text-xs font-bold text-slate-200 uppercase tracking-wider border-b border-slate-500/30">CO</th>
                      <th className="px-2 py-2 text-left text-xs font-bold text-slate-200 uppercase tracking-wider border-b border-slate-500/30">O2</th>
                      <th className="px-2 py-2 text-left text-xs font-bold text-slate-200 uppercase tracking-wider border-b border-slate-500/30">H2O</th>
                      <th className="px-2 py-2 text-left text-xs font-bold text-slate-200 uppercase tracking-wider border-b border-slate-500/30">HE</th>
                       <th className="px-2 py-2 text-left text-xs font-bold text-slate-200 uppercase tracking-wider border-b border-slate-500/30">AR</th>
                        <th className="px-2 py-2 text-left text-xs font-bold text-slate-200 uppercase tracking-wider border-b border-slate-500/30">HS</th>
                      <th className="px-2 py-2 text-left text-xs font-bold text-slate-200 uppercase tracking-wider border-b border-slate-500/30">SD</th>
                      <th className="px-2 py-2 text-left text-xs font-bold text-slate-200 uppercase tracking-wider border-b border-slate-500/30">Last Status OK</th>
                      <th className="px-2 py-2 text-left text-xs font-bold text-slate-200 uppercase tracking-wider border-b border-slate-500/30">Compress K Factor</th>
                      <th className="px-2 py-2 text-left text-xs font-bold text-slate-200 uppercase tracking-wider border-b border-slate-500/30">Last K Factor</th>
                      <th className="px-2 py-2 text-left text-xs font-bold text-slate-200 uppercase tracking-wider border-b border-slate-500/30">Delta k Factor</th>
                      <th className="px-2 py-2 text-left text-xs font-bold text-slate-200 uppercase tracking-wider border-b border-slate-500/30">Correction Z Factor</th>
                      <th className="px-2 py-2 text-left text-xs font-bold text-slate-200 uppercase tracking-wider border-b border-slate-500/30">Last Correction Z</th>
                      <th className="px-2 py-2 text-left text-xs font-bold text-slate-200 uppercase tracking-wider border-b border-slate-500/30">Delta Correction Z</th>
                      <th className="px-2 py-2 text-left text-xs font-bold text-slate-200 uppercase tracking-wider border-b border-slate-500/30">Op Vol Forward</th>
                      <th className="px-2 py-2 text-left text-xs font-bold text-slate-200 uppercase tracking-wider border-b border-slate-500/30">Op Vol Reverse</th>
                      <th className="px-2 py-2 text-left text-xs font-bold text-slate-200 uppercase tracking-wider border-b border-slate-500/30">Op Vol Net</th>
                      <th className="px-2 py-2 text-left text-xs font-bold text-slate-200 uppercase tracking-wider border-b border-slate-500/30">Int Vol Forward</th>
                      <th className="px-2 py-2 text-left text-xs font-bold text-slate-200 uppercase tracking-wider border-b border-slate-500/30">Int Vol Reverse</th>
                      <th className="px-2 py-2 text-left text-xs font-bold text-slate-200 uppercase tracking-wider border-b border-slate-500/30">Int Vol Net</th>
                      <th className="px-2 py-2 text-left text-xs font-bold text-slate-200 uppercase tracking-wider border-b border-slate-500/30">Op Total Vol Forward</th>
                      <th className="px-2 py-2 text-left text-xs font-bold text-slate-200 uppercase tracking-wider border-b border-slate-500/30">Op Total Vol Reverse</th>
                      <th className="px-2 py-2 text-left text-xs font-bold text-slate-200 uppercase tracking-wider border-b border-slate-500/30">Op Total Vol Net</th>
                      <th className="px-2 py-2 text-left text-xs font-bold text-slate-200 uppercase tracking-wider border-b border-slate-500/30">Std Vol Forward</th>
                      <th className="px-2 py-2 text-left text-xs font-bold text-slate-200 uppercase tracking-wider border-b border-slate-500/30">Std Vol Reverse</th>
                      <th className="px-2 py-2 text-left text-xs font-bold text-slate-200 uppercase tracking-wider border-b border-slate-500/30">Std Vol Net</th>
                      <th className="px-2 py-2 text-left text-xs font-bold text-slate-200 uppercase tracking-wider border-b border-slate-500/30">Std Interfer Vol Forward</th>
                      <th className="px-2 py-2 text-left text-xs font-bold text-slate-200 uppercase tracking-wider border-b border-slate-500/30">Std Interfer Vol Reverse</th>
                      <th className="px-2 py-2 text-left text-xs font-bold text-slate-200 uppercase tracking-wider border-b border-slate-500/30">Std Interfer Vol Net</th>
                      <th className="px-2 py-2 text-left text-xs font-bold text-slate-200 uppercase tracking-wider border-b border-slate-500/30">Std Total Vol Forward</th>
                      <th className="px-2 py-2 text-left text-xs font-bold text-slate-200 uppercase tracking-wider border-b border-slate-500/30">Std Total Vol Reverse</th>
                      <th className="px-2 py-2 text-left text-xs font-bold text-slate-200 uppercase tracking-wider border-b border-slate-500/30">Std Total Vol Net</th>
                      <th className="px-2 py-2 text-left text-xs font-bold text-slate-200 uppercase tracking-wider border-b border-slate-500/30">Operating Flow Rate</th>
                      <th className="px-2 py-2 text-left text-xs font-bold text-slate-200 uppercase tracking-wider border-b border-slate-500/30">Interference Flow Rate</th>
                      <th className="px-2 py-2 text-left text-xs font-bold text-slate-200 uppercase tracking-wider border-b border-slate-500/30">Standard Flow Rate</th>
                      <th className="px-2 py-2 text-left text-xs font-bold text-slate-200 uppercase tracking-wider border-b border-slate-500/30">Std Interfer Flow Rate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-600/30">
                    {archiveStore.paginatedData.map((record, index) => {
                      // Convert record object to array of values in the correct order
                      const recordArray = [
                        record.id || (archiveStore.currentPage - 1) * archiveStore.itemsPerPage + index + 1,
                        record.current_system_timestamp,
                        record.delta_time ?? '-',
                        record.last_volume_original ?? '-',
                        record.current_volume_original ?? '-',
                        record.delta_volume_original ?? '-',
                        record.operating_temperature ?? '-',
                        record.base_temperature ?? '-',
                        record.temperature_unit || '-',
                        record.operating_pressure ?? '-',
                        record.base_pressure ?? '-',
                        record.pressure_unit || '-',
                        record.device_flow_rate ?? '-',
                        record.software_flow_rate ?? '-',
                        record.CH4 ?? '-',
                        record.N2 ?? '-',
                        record.CO2 ?? '-',
                        record.C2H6 ?? '-',
                        record.C3H8 ?? '-',
                        record.I_C4H10 ?? '-',
                        record.N_C4H10 ?? '-',
                        record.I_C5H12 ?? '-',
                        record.N_C5H12 ?? '-',
                        record.C6H14 ?? '-',
                        record.C7H16 ?? '-',
                        record.C8H18 ?? '-',
                        record.C9H20 ?? '-',
                        record.C10H22 ?? '-',
                        record.H2 ?? '-',
                        record.H2S ?? '-',
                        record.CO ?? '-',
                        record.O2 ?? '-',
                        record.H2O ?? '-',
                        record.HE ?? '-',
                        record.AR ?? '-',
                        record.HS ?? '-',
                        record.SD ?? '-',
                        record.compressibility_k_factor ?? '-',
                        record.compressibility_last_k_factor ?? '-',
                        record.compressibility_delta_k_factor ?? '-',
                        record.correction_z_factor ?? '-',
                        record.correction_z_factor_last ?? '-',
                        record.correction_z_factor_delta ?? '-',
                        record.operating_volume_forward ?? '-',
                        record.operating_volume_reverse ?? '-',
                        record.operating_volume_net ?? '-',
                        record.interference_volume_forward ?? '-',
                        record.interference_volume_reverse ?? '-',
                        record.interference_volume_net ?? '-',
                        record.operating_total_volume_forward ?? '-',
                        record.operating_total_volume_reverse ?? '-',
                        record.operating_total_volume_net ?? '-',
                        record.standard_volume_forward ?? '-',
                        record.standard_volume_reverse ?? '-',
                        record.standard_volume_net ?? '-',
                        record.standard_interference_volume_forward ?? '-',
                        record.standard_interference_volume_reverse ?? '-',
                        record.standard_interference_volume_net ?? '-',
                        record.standard_total_volume_forward ?? '-',
                        record.standard_total_volume_reverse ?? '-',
                        record.standard_total_volume_net ?? '-',
                        record.operating_flow_rate ?? '-',
                        record.interference_flow_rate ?? '-',
                        record.standard_flow_rate ?? '-',
                        record.standard_interference_flow_rate ?? '-'
                      ];
                      
                      return (
                        <tr key={index} className="hover:bg-slate-600/20 transition-all duration-200 border-b border-slate-600/20">
                          {recordArray.map((field: any, fieldIndex: number) => (
                            <td key={fieldIndex} className="px-3 py-2 whitespace-nowrap text-slate-200 text-xs">
                              {fieldIndex === 3 ? 
                                new Date(field).toLocaleString('en-GB', {
                                  day: '2-digit',
                                  month: '2-digit', 
                                  year: '2-digit',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                  second: '2-digit'
                                }) : 
                                (typeof field === 'number' && field > 1000 ? field.toLocaleString() : field)
                              }
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="bg-gradient-to-r from-slate-700/50 to-slate-600/50 px-6 py-4 flex items-center justify-between border-t border-slate-500/30">
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-slate-300 font-medium">
                      Showing <span className="font-bold text-slate-100">{(archiveStore.currentPage - 1) * archiveStore.itemsPerPage + 1}</span> to{" "}
                      <span className="font-bold text-slate-100">{Math.min(archiveStore.currentPage * archiveStore.itemsPerPage, archiveStore.rawData.length)}</span> of{" "}
                      <span className="font-bold text-slate-100">{archiveStore.rawData.length}</span> records
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                      <button
                        onClick={() => archiveStore.setCurrentPage(Math.max(1, archiveStore.currentPage - 1))}
                        disabled={archiveStore.currentPage === 1}
                        className="relative inline-flex items-center px-3 py-2 rounded-l-lg border border-slate-500/50 bg-slate-600/50 text-sm font-medium text-slate-300 hover:bg-slate-600/70 disabled:opacity-40 transition-all duration-200"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      {Array.from({ length: Math.min(5, archiveStore.totalPages) }, (_, i) => {
                        const page = i + 1;
                        return (
                          <button
                            key={page}
                            onClick={() => archiveStore.setCurrentPage(page)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium transition-all duration-200 ${
                              page === archiveStore.currentPage
                                ? "z-10 bg-gradient-to-r from-yellow-500 to-amber-600 border-yellow-500 text-black font-bold shadow-lg"
                                : "bg-slate-600/50 border-slate-500/50 text-slate-300 hover:bg-slate-600/70"
                            }`}
                          >
                            {page}
                          </button>
                        );
                      })}
                      <button
                        onClick={() => archiveStore.setCurrentPage(Math.min(archiveStore.totalPages, archiveStore.currentPage + 1))}
                        disabled={archiveStore.currentPage === archiveStore.totalPages}
                        className="relative inline-flex items-center px-3 py-2 rounded-r-lg border border-slate-500/50 bg-slate-600/50 text-sm font-medium text-slate-300 hover:bg-slate-600/70 disabled:opacity-40 transition-all duration-200"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </nav>
                  </div>
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
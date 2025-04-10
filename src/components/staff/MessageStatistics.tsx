
import React, { useState } from 'react';
import { useLanguage } from "../../contexts/LanguageContext";
import { getMessages, Message } from "../../data/messages";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

// Define the time periods for filtering
type TimePeriod = 'today' | 'week' | 'month' | 'all';

// Type for staff performance data
interface StaffPerformance {
  name: string;
  completed: number;
  inprogress: number;
  unread: number;
  total: number;
}

const MessageStatistics = () => {
  const { t } = useLanguage();
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('all');
  const [chartType, setChartType] = useState<'bar' | 'pie'>('bar');

  // Colors for the different statuses
  const statusColors = {
    completed: "#22c55e", // green
    inprogress: "#f59e0b", // yellow
    unread: "#ef4444",     // red
  };

  // Get filtered messages based on time period
  const getFilteredMessages = (): Message[] => {
    const messages = getMessages();
    const now = new Date();
    
    switch (timePeriod) {
      case 'today': {
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        return messages.filter(msg => new Date(msg.timestamp) >= startOfDay);
      }
      case 'week': {
        const oneWeekAgo = new Date(now);
        oneWeekAgo.setDate(now.getDate() - 7);
        return messages.filter(msg => new Date(msg.timestamp) >= oneWeekAgo);
      }
      case 'month': {
        const oneMonthAgo = new Date(now);
        oneMonthAgo.setMonth(now.getMonth() - 1);
        return messages.filter(msg => new Date(msg.timestamp) >= oneMonthAgo);
      }
      case 'all':
      default:
        return messages;
    }
  };

  // Prepare data for charts
  const prepareStaffPerformanceData = (): StaffPerformance[] => {
    const messages = getFilteredMessages();
    const staffPerformance: Record<string, StaffPerformance> = {};
    
    // Initialize with known staff members
    const knownStaff = ["Team A", "Team B", "Team C"];
    knownStaff.forEach(staff => {
      staffPerformance[staff] = {
        name: staff,
        completed: 0,
        inprogress: 0,
        unread: 0,
        total: 0,
      };
    });
    
    // Count messages by staff and status
    messages.forEach(message => {
      const staffName = message.assignedTo || "Unassigned";
      
      // Initialize if this staff doesn't exist yet
      if (!staffPerformance[staffName]) {
        staffPerformance[staffName] = {
          name: staffName,
          completed: 0,
          inprogress: 0,
          unread: 0,
          total: 0,
        };
      }
      
      // Increment the appropriate status counter
      staffPerformance[staffName][message.status]++;
      staffPerformance[staffName].total++;
    });
    
    // Convert to array and sort by name
    return Object.values(staffPerformance)
      .sort((a, b) => a.name.localeCompare(b.name));
  };

  // Prepare data for the pie chart
  const preparePieChartData = () => {
    const staffData = prepareStaffPerformanceData();
    const totalsByStatus = {
      completed: 0,
      inprogress: 0,
      unread: 0,
    };
    
    staffData.forEach(staff => {
      totalsByStatus.completed += staff.completed;
      totalsByStatus.inprogress += staff.inprogress;
      totalsByStatus.unread += staff.unread;
    });
    
    return [
      { name: t("staff.status.completed"), value: totalsByStatus.completed, color: statusColors.completed },
      { name: t("staff.status.inprogress"), value: totalsByStatus.inprogress, color: statusColors.inprogress },
      { name: t("staff.status.unread"), value: totalsByStatus.unread, color: statusColors.unread },
    ];
  };

  const staffPerformanceData = prepareStaffPerformanceData();
  const pieChartData = preparePieChartData();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{t("staff.statistics.title")}</CardTitle>
        <CardDescription>{t("staff.statistics.description")}</CardDescription>
        
        <div className="flex justify-between items-center mt-4">
          <Tabs defaultValue="bar" onValueChange={(value) => setChartType(value as 'bar' | 'pie')}>
            <TabsList>
              <TabsTrigger value="bar">{t("staff.statistics.barChart")}</TabsTrigger>
              <TabsTrigger value="pie">{t("staff.statistics.pieChart")}</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <Tabs defaultValue="all" onValueChange={(value) => setTimePeriod(value as TimePeriod)}>
            <TabsList>
              <TabsTrigger value="today">{t("staff.statistics.today")}</TabsTrigger>
              <TabsTrigger value="week">{t("staff.statistics.week")}</TabsTrigger>
              <TabsTrigger value="month">{t("staff.statistics.month")}</TabsTrigger>
              <TabsTrigger value="all">{t("staff.statistics.all")}</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="w-full h-[400px]">
          {chartType === 'bar' ? (
            <ChartContainer
              className="h-[400px]"
              config={{
                completed: { label: t("staff.status.completed"), theme: { light: statusColors.completed, dark: statusColors.completed } },
                inprogress: { label: t("staff.status.inprogress"), theme: { light: statusColors.inprogress, dark: statusColors.inprogress } },
                unread: { label: t("staff.status.unread"), theme: { light: statusColors.unread, dark: statusColors.unread } },
              }}
            >
              <BarChart data={staffPerformanceData} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
                <XAxis dataKey="name" angle={-45} textAnchor="end" />
                <YAxis />
                <Tooltip content={<ChartTooltipContent />} />
                <Legend />
                <Bar dataKey="completed" fill={statusColors.completed} name={t("staff.status.completed")} />
                <Bar dataKey="inprogress" fill={statusColors.inprogress} name={t("staff.status.inprogress")} />
                <Bar dataKey="unread" fill={statusColors.unread} name={t("staff.status.unread")} />
              </BarChart>
            </ChartContainer>
          ) : (
            <ChartContainer
              className="h-[400px]"
              config={{
                completed: { label: t("staff.status.completed"), theme: { light: statusColors.completed, dark: statusColors.completed } },
                inprogress: { label: t("staff.status.inprogress"), theme: { light: statusColors.inprogress, dark: statusColors.inprogress } },
                unread: { label: t("staff.status.unread"), theme: { light: statusColors.unread, dark: statusColors.unread } },
              }}
            >
              <PieChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
              </PieChart>
            </ChartContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MessageStatistics;

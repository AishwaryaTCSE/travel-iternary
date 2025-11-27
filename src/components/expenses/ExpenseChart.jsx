import React, { useState, useMemo } from 'react';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LabelList, ReferenceLine
} from 'recharts';
import { FiBarChart2, FiPieChart, FiTrendingUp, FiDollarSign, FiFilter } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', 
  '#8884D8', '#82CA9D', '#FFC658', '#FF6B6B',
  '#4D96FF', '#6BCB77', '#FFD93D', '#FF9F1C'
];

const timeRanges = [
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
  { value: 'year', label: 'Year' },
];

const chartTypes = [
  { value: 'bar', label: 'Bar Chart', icon: <FiBarChart2 className="h-4 w-4" /> },
  { value: 'line', label: 'Trend', icon: <FiTrendingUp className="h-4 w-4" /> },
  { value: 'pie', label: 'Categories', icon: <FiPieChart className="h-4 w-4" /> },
];

const ExpenseChart = ({ 
  expenses = [], 
  categories = [],
  currency = 'USD',
  className = ''
}) => {
  const { t } = useTranslation();
  const [timeRange, setTimeRange] = useState('month');
  const [chartType, setChartType] = useState('bar');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Process data for charts
  const { chartData, categoryData, totalSpent } = useMemo(() => {
    if (!expenses.length) return { chartData: [], categoryData: [], totalSpent: 0 };

    const now = new Date();
    let periodCount, dateFormat, dateModifier;
    
    // Configure date handling based on selected time range
    switch(timeRange) {
      case 'week':
        periodCount = 7;
        dateFormat = { weekday: 'short' };
        dateModifier = (date, i) => {
          const d = new Date();
          d.setDate(d.getDate() - (periodCount - 1 - i));
          return d;
        };
        break;
      case 'year':
        periodCount = 12;
        dateFormat = { month: 'short' };
        dateModifier = (date, i) => {
          const d = new Date();
          d.setMonth(d.getMonth() - (periodCount - 1 - i));
          return d;
        };
        break;
      default: // month
        periodCount = 4;
        dateFormat = { month: 'short', day: 'numeric' };
        dateModifier = (date, i) => {
          const d = new Date();
          d.setDate(d.getDate() - ((periodCount - 1 - i) * 7));
          return d;
        };
    }

    // Generate chart data points
    const data = Array.from({ length: periodCount }, (_, i) => {
      const date = dateModifier(now, i);
      const dateStr = date.toLocaleDateString(undefined, dateFormat);
      
      // Filter expenses for this period
      const periodExpenses = expenses.filter(exp => {
        const expDate = new Date(exp.date);
        if (timeRange === 'week') {
          return expDate.toDateString() === date.toDateString();
        } else if (timeRange === 'month') {
          const weekStart = new Date(date);
          weekStart.setDate(weekStart.getDate() - 6);
          return expDate >= weekStart && expDate <= date;
        } else {
          return expDate.getMonth() === date.getMonth() && 
                 expDate.getFullYear() === date.getFullYear();
        }
      });
      
      // Calculate total and by category
      const total = periodExpenses.reduce((sum, exp) => sum + exp.amount, 0);
      
      // Group by category
      const byCategory = {};
      categories.forEach(cat => {
        byCategory[cat.value] = periodExpenses
          .filter(exp => exp.category === cat.value)
          .reduce((sum, exp) => sum + exp.amount, 0);
      });
      
      return {
        name: dateStr,
        date,
        total,
        ...byCategory
      };
    });

    // Calculate category totals for pie chart
    const categoryTotals = categories.map(cat => {
      const total = expenses
        .filter(exp => exp.category === cat.value)
        .reduce((sum, exp) => sum + exp.amount, 0);
      
      return {
        name: cat.label,
        value: total,
        color: cat.color || COLORS[categories.indexOf(cat) % COLORS.length],
        percentage: total > 0 ? (total / expenses.reduce((sum, exp) => sum + exp.amount, 0)) * 100 : 0
      };
    }).filter(item => item.value > 0);

    return {
      chartData: data,
      categoryData: categoryTotals,
      totalSpent: expenses.reduce((sum, exp) => sum + exp.amount, 0)
    };
  }, [expenses, timeRange, categories]);

  // Format currency for tooltips
  const formatCurrency = (value) => {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value);
  };

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-medium text-gray-900 dark:text-white">{label}</p>
          {payload.map((entry, index) => (
            <div key={`item-${index}`} className="flex items-center justify-between">
              <div className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2" 
                  style={{ backgroundColor: entry.color || COLORS[index % COLORS.length] }}
                />
                <span className="text-sm">{entry.name}</span>
              </div>
              <span className="text-sm font-medium ml-4">
                {formatCurrency(entry.value)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  // Custom legend formatter for pie chart
  const renderCustomizedLabel = ({
    cx, cy, midAngle, innerRadius, outerRadius, percent, index, name
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN) * 1.1;
    const y = cy + radius * Math.sin(-midAngle * RADIAN) * 1.1;

    return (
      <text
        x={x} y={y} fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        className="text-xs font-medium"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // Render the appropriate chart based on selected type
  const renderChart = () => {
    if (chartType === 'pie') {
      return (
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                animationDuration={1000}
              >
                {categoryData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color || COLORS[index % COLORS.length]} 
                  />
                ))}
                <LabelList 
                  dataKey="name" 
                  position="outside" 
                  offset={15} 
                  style={{ 
                    fontSize: '12px',
                    fill: '#6B7280',
                    textAnchor: 'middle'
                  }}
                />
              </Pie>
              <Tooltip 
                formatter={(value) => [
                  formatCurrency(value),
                  t('expenses.amount')
                ]}
              />
              <Legend 
                layout="vertical"
                align="right"
                verticalAlign="middle"
                formatter={(value, entry, index) => {
                  const { color } = entry;
                  const percentage = categoryData[index]?.percentage?.toFixed(1) || 0;
                  return (
                    <span className="text-xs text-gray-600 dark:text-gray-300">
                      {value} ({percentage}%)
                    </span>
                  );
                }}
                iconType="circle"
                iconSize={8}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      );
    }

    const ChartComponent = chartType === 'bar' ? BarChart : LineChart;
    const ChartElement = chartType === 'bar' ? Bar : Line;

    return (
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ChartComponent
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6B7280', fontSize: 12 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6B7280', fontSize: 12 }}
              width={60}
              tickFormatter={(value) => 
                new Intl.NumberFormat(undefined, {
                  style: 'currency',
                  currency: currency,
                  notation: 'compact',
                  compactDisplay: 'short',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 1,
                }).format(value)
              }
            />
            <Tooltip 
              content={<CustomTooltip />}
              cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
            />
            <Legend 
              formatter={(value) => (
                <span className="text-xs text-gray-600 dark:text-gray-300">
                  {value}
                </span>
              )}
              iconType="circle"
              iconSize={8}
            />
            {selectedCategory === 'all' ? (
              categories.map((category, index) => (
                <ChartElement
                  key={category.value}
                  type="monotone"
                  dataKey={category.value}
                  name={category.label}
                  stroke={category.color || COLORS[index % COLORS.length]}
                  fill={category.color || COLORS[index % COLORS.length]}
                  fillOpacity={0.7}
                  strokeWidth={2}
                  dot={chartType === 'line'}
                  activeDot={{ r: 6 }}
                />
              ))
            ) : (
              <ChartElement
                type="monotone"
                dataKey="total"
                name={categories.find(c => c.value === selectedCategory)?.label || 'Total'}
                stroke="#3B82F6"
                fill="#3B82F6"
                fillOpacity={0.7}
                strokeWidth={2}
                dot={chartType === 'line'}
                activeDot={{ r: 6 }}
              />
            )}
            <ReferenceLine y={0} stroke="#9CA3AF" strokeDasharray="3 3" />
          </ChartComponent>
        </ResponsiveContainer>
      </div>
    );
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden ${className}`}>
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {t('expenses.spendingOverview')}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('expenses.totalSpent')}: {formatCurrency(totalSpent)}
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiFilter className="h-4 w-4 text-gray-400" />
              </div>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="block w-full pl-10 pr-10 py-2 text-sm border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                {timeRanges.map((range) => (
                  <option key={range.value} value={range.value}>
                    {t(`expenses.timeRanges.${range.value}`)}
                  </option>
                ))}
              </select>
            </div>
            
            {chartType !== 'pie' && (
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiDollarSign className="h-4 w-4 text-gray-400" />
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="block w-full pl-10 pr-10 py-2 text-sm border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="all">{t('expenses.allCategories')}</option>
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
            
            <div className="inline-flex rounded-md shadow-sm" role="group">
              {chartTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setChartType(type.value)}
                  className={`inline-flex items-center px-3 py-2 text-sm font-medium ${
                    chartType === type.value
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100'
                      : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                  } border border-gray-300 dark:border-gray-600 ${
                    type.value === chartTypes[0].value ? 'rounded-l-lg' : ''
                  } ${
                    type.value === chartTypes[chartTypes.length - 1].value 
                      ? 'rounded-r-lg border-l-0' 
                      : 'border-r-0'
                  }`}
                  title={type.label}
                >
                  {type.icon}
                  <span className="ml-2 hidden sm:inline">{type.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        {expenses.length > 0 ? (
          renderChart()
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <FiDollarSign className="h-12 w-12 text-gray-400 mb-4" />
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
              {t('expenses.noExpenseData')}
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md">
              {t('expenses.addExpensesToSeeCharts')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenseChart;
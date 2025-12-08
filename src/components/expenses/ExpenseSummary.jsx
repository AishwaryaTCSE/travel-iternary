import React from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, CartesianGrid, XAxis, YAxis } from 'recharts';
import { FiDollarSign, FiPieChart, FiTrendingUp, FiTrendingDown } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', 
  '#8884D8', '#82CA9D', '#FFC658', '#FF6B6B',
  '#4D96FF', '#6BCB77', '#FFD93D', '#FF9F1C'
];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx, cy, midAngle, innerRadius, outerRadius, percent, index, name
}) => {
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

const ExpenseSummary = ({
  expenses = [],
  categories = [],
  currency = 'USD',
  timeRange = 'month',
  onTimeRangeChange,
  className = ''
}) => {
  const { t } = useTranslation();

  // Calculate total expenses
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  // Calculate expenses by category
  const categoryData = categories.map(category => {
    const categoryExpenses = expenses
      .filter(exp => exp.category === category.value)
      .reduce((sum, exp) => sum + exp.amount, 0);
    
    return {
      name: category.label,
      value: categoryExpenses,
      color: category.color || COLORS[categories.indexOf(category) % COLORS.length],
      percentage: totalExpenses > 0 ? (categoryExpenses / totalExpenses) * 100 : 0
    };
  }).filter(item => item.value > 0);

  // Calculate expenses over time (last 7 days, 4 weeks, or 12 months)
  const getTimeRangeData = () => {
    const now = new Date();
    let periodCount, periodLabel, dateFormat, dateModifier;
    
    switch(timeRange) {
      case 'week':
        periodCount = 7;
        periodLabel = t('expenses.days');
        dateFormat = { weekday: 'short' };
        dateModifier = (date, i) => {
          const d = new Date();
          d.setDate(d.getDate() - (periodCount - 1 - i));
          return d;
        };
        break;
      case 'year':
        periodCount = 12;
        periodLabel = t('expenses.months');
        dateFormat = { month: 'short' };
        dateModifier = (date, i) => {
          const d = new Date();
          d.setMonth(d.getMonth() - (periodCount - 1 - i));
          return d;
        };
        break;
      default: // month
        periodCount = 4;
        periodLabel = t('expenses.weeks');
        dateFormat = { month: 'short', day: 'numeric' };
        dateModifier = (date, i) => {
          const d = new Date();
          d.setDate(d.getDate() - ((periodCount - 1 - i) * 7));
          return d;
        };
    }

    return Array.from({ length: periodCount }, (_, i) => {
      const date = dateModifier(now, i);
      const dateStr = date.toLocaleDateString(undefined, dateFormat);
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
      }).reduce((sum, exp) => sum + exp.amount, 0);
      
      return {
        name: dateStr,
        value: periodExpenses,
        date: date
      };
    });
  };

  const timeData = getTimeRangeData();
  const totalLastPeriod = timeData.length > 1 
    ? timeData[timeData.length - 2].value 
    : 0;
  const currentTotal = timeData.length > 0 
    ? timeData[timeData.length - 1].value 
    : 0;
  const percentageChange = totalLastPeriod > 0 
    ? ((currentTotal - totalLastPeriod) / totalLastPeriod) * 100 
    : currentTotal > 0 ? 100 : 0;

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow p-6 ${className}`}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            {t('expenses.spendingOverview')}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t('expenses.spendingOverTime')}
          </p>
        </div>
        <div className="mt-2 md:mt-0">
          <div className="inline-flex rounded-md shadow-sm">
            {['week', 'month', 'year'].map((range) => (
              <button
                key={range}
                type="button"
                onClick={() => onTimeRangeChange(range)}
                className={`px-4 py-2 text-sm font-medium ${
                  timeRange === range
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600'
                } border border-gray-300 dark:border-gray-600 ${
                  range === 'week' ? 'rounded-l-md' : ''
                } ${
                  range === 'year' ? 'rounded-r-md' : 'border-r-0'
                }`}
              >
                {t(`expenses.timeRanges.${range}`)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                {t('expenses.totalSpending')}
              </h3>
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                {t(`expenses.timeRanges.${timeRange}`)}
              </span>
            </div>
            <div className="flex items-baseline">
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {new Intl.NumberFormat(undefined, {
                  style: 'currency',
                  currency: currency,
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(currentTotal)}
              </p>
              <div className={`ml-2 flex items-center text-sm font-medium ${
                percentageChange >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {percentageChange >= 0 ? (
                  <FiTrendingUp className="h-4 w-4 mr-1" />
                ) : (
                  <FiTrendingDown className="h-4 w-4 mr-1" />
                )}
                {Math.abs(percentageChange).toFixed(1)}%
              </div>
            </div>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {percentageChange >= 0 
                ? t('expenses.increaseFromLastPeriod')
                : t('expenses.decreaseFromLastPeriod')}
            </p>

            <div className="mt-6 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={timeData}
                  margin={{
                    top: 5,
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
                    tick={{ fill: '#6B7280' }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6B7280' }}
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
                    formatter={(value) => [
                      new Intl.NumberFormat(undefined, {
                        style: 'currency',
                        currency: currency,
                      }).format(value),
                      t('expenses.amount')
                    ]}
                    labelFormatter={(label, payload) => {
                      if (payload && payload[0] && payload[0].payload.date) {
                        return payload[0].payload.date.toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        });
                      }
                      return label;
                    }}
                  />
                  <Bar 
                    dataKey="value" 
                    fill="#3B82F6" 
                    radius={[4, 4, 0, 0]}
                    animationDuration={1000}
                  >
                    {timeData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={
                          index === timeData.length - 1 
                            ? '#2563EB' 
                            : index % 2 === 0 
                              ? '#3B82F6' 
                              : '#60A5FA'
                        } 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                {t('expenses.spendingByCategory')}
              </h3>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {categoryData.length} {t('common.categories')}
              </span>
            </div>

            {categoryData.length > 0 ? (
              <>
                <div className="h-64 w-full">
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
                      </Pie>
                      <Tooltip 
                        formatter={(value, name, props) => [
                          new Intl.NumberFormat(undefined, {
                            style: 'currency',
                            currency: currency,
                          }).format(value),
                          `${name} (${props.payload.percentage.toFixed(1)}%)`
                        ]}
                      />
                      <Legend 
                        layout="vertical"
                        align="right"
                        verticalAlign="middle"
                        wrapperStyle={{
                          paddingLeft: '20px',
                          fontSize: '12px',
                        }}
                        formatter={(value, entry, index) => {
                          const { color } = entry;
                          const percentage = categoryData[index]?.percentage?.toFixed(1) || 0;
                          return (
                            <span className="text-gray-700 dark:text-gray-300">
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

                <div className="mt-4 space-y-3 max-h-48 overflow-y-auto pr-2">
                  {categoryData
                    .sort((a, b) => b.value - a.value)
                    .map((category, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div 
                            className="w-3 h-3 rounded-full mr-2"
                            style={{ backgroundColor: category.color || COLORS[index % COLORS.length] }}
                          />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {category.name}
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {new Intl.NumberFormat(undefined, {
                              style: 'currency',
                              currency: currency,
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0,
                            }).format(category.value)}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {category.percentage.toFixed(1)}%
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-center p-4">
                <FiPieChart className="h-12 w-12 text-gray-400 mb-2" />
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                  {t('expenses.noSpendingData')}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {t('expenses.addExpensesToSeeBreakdown')}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseSummary;

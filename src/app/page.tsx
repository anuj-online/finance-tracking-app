'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { 
  Wallet, 
  TrendingUp, 
  Building,
  Bell,
  User
} from 'lucide-react';
import { AccountCard } from '@/components/accounts/AccountCard';
import { AccountForm } from '@/components/accounts/AccountForm';
import { Account } from '@/types/account';

const AccountTypeLabels: Record<string, string> = {
  BANK: 'Bank Account',
  CREDIT: 'Credit Card',
  INVESTMENT: 'Investment',
  CASH: 'Cash',
  OTHER: 'Other'
};

const CurrencySymbols: Record<string, string> = {
  INR: '₹',
  EUR: '€',
  USD: '$',
  GBP: '£'
};

export default function FinanceTracker() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await fetch('/api/accounts');
      const data = await response.json();
      setAccounts(data);
    } catch (error) {
      console.error('Error fetching accounts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAccount = async (accountData: Omit<Account, 'id' | 'createdAt'>) => {
    try {
      const response = await fetch('/api/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(accountData)
      });

      if (response.ok) {
        await fetchAccounts();
      }
    } catch (error) {
      console.error('Error adding account:', error);
    }
  };

  const handleUpdateAccount = async (id: string, balance: number) => {
    try {
      await fetch(`/api/accounts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ balance })
      });
      await fetchAccounts();
    } catch (error) {
      console.error('Error updating account:', error);
    }
  };

  const handleSeedData = async () => {
    try {
      const response = await fetch('/api/seed', { method: 'POST' });
      if (response.ok) {
        await fetchAccounts();
        alert('Sample data loaded successfully!');
      } else {
        alert('Failed to load sample data');
      }
    } catch (error) {
      console.error('Error seeding data:', error);
      alert('Error loading sample data');
    }
  };

  const getTotalNetWorth = () => {
    return accounts.reduce((total, account) => total + account.balance, 0);
  };

  const getCurrencyBreakdown = () => {
    const breakdown: Record<string, number> = {};
    accounts.forEach(account => {
      if (!breakdown[account.currency]) {
        breakdown[account.currency] = 0;
      }
      breakdown[account.currency] += account.balance;
    });
    return Object.entries(breakdown).map(([currency, amount]) => ({
      currency,
      amount,
      symbol: CurrencySymbols[currency]
    }));
  };

  const getAccountDistribution = () => {
    const distribution: Record<string, number> = {};
    accounts.forEach(account => {
      if (!distribution[account.type]) {
        distribution[account.type] = 0;
      }
      distribution[account.type] += account.balance;
    });
    return Object.entries(distribution).map(([type, amount]) => ({
      type: AccountTypeLabels[type] || type,
      amount,
      color: accounts.find(acc => acc.type === type)?.color || '#4361ee'
    }));
  };

  const netWorthData = [
    { month: 'Jan', amount: 1050000 },
    { month: 'Feb', amount: 1120000 },
    { month: 'Mar', amount: 1180000 },
    { month: 'Apr', amount: 1200000 },
    { month: 'May', amount: 1220000 },
    { month: 'Jun', amount: getTotalNetWorth() }
  ];

  const bankAccounts = accounts.filter(acc => acc.type === 'BANK');
  const otherAccounts = accounts.filter(acc => acc.type !== 'BANK');

  const formatCurrency = (amount: number, currency: string) => {
    const symbol = CurrencySymbols[currency] || currency;
    return `${symbol} ${amount.toLocaleString()}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Finance Tracker...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation */}
      <nav className="bg-slate-900 text-white shadow-lg">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Wallet className="w-8 h-8 text-blue-400" />
            <h1 className="text-2xl font-bold">FinanceTracker</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium">John Doe</span>
            <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
              JD
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-6">
        {/* Periodic Reminder */}
        <Alert className="mb-6 border-blue-200 bg-blue-50">
          <Bell className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <div className="flex items-center justify-between">
              <div>
                <strong className="text-blue-900">Weekly Update Reminder</strong>
                <p className="text-blue-700 text-sm">Please update your account balances for this week</p>
              </div>
              <AccountForm onSubmit={handleAddAccount}>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  Update Now
                </Button>
              </AccountForm>
            </div>
          </AlertDescription>
        </Alert>

        {/* Net Worth Summary */}
        <Card className="mb-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-6 items-center">
              <div>
                <h3 className="text-lg font-semibold mb-2 opacity-90">Total Net Worth</h3>
                <div className="flex items-baseline space-x-3">
                  <h2 className="text-3xl font-bold">
                    {formatCurrency(getTotalNetWorth(), 'INR')}
                  </h2>
                  <span className="bg-green-500 text-white px-2 py-1 rounded-full text-sm font-medium">
                    +5.2%
                  </span>
                </div>
                <div className="mt-3 space-x-4 text-sm opacity-90">
                  <span>INR: {formatCurrency(getTotalNetWorth(), 'INR')}</span>
                  <span>EUR: {formatCurrency(getTotalNetWorth() * 0.011, 'EUR')}</span>
                </div>
              </div>
              <div className="h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={netWorthData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.3)" />
                    <XAxis dataKey="month" stroke="rgba(255,255,255,0.8)" />
                    <YAxis stroke="rgba(255,255,255,0.8)" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none' }}
                      labelStyle={{ color: 'white' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="amount" 
                      stroke="white" 
                      strokeWidth={2}
                      dot={{ stroke: 'white', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Add Account Button */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Accounts</h2>
          <div className="flex space-x-2">
            <AccountForm onSubmit={handleAddAccount}>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Wallet className="w-4 h-4 mr-2" />
                Add Account
              </Button>
            </AccountForm>
            <Button 
              variant="outline" 
              onClick={handleSeedData}
              className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
            >
              Load Sample Data
            </Button>
          </div>
        </div>

        {/* Accounts Grid */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Bank Accounts */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-2 text-gray-800">
                <Building className="w-5 h-5 text-blue-600" />
                <span>Bank Accounts</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {bankAccounts.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No bank accounts yet</p>
              ) : (
                <div className="space-y-3">
                  {bankAccounts.map((account) => (
                    <AccountCard 
                      key={account.id} 
                      account={account} 
                      onUpdate={handleUpdateAccount}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Other Accounts */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-2 text-gray-800">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <span>Investments & Other</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {otherAccounts.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No other accounts yet</p>
              ) : (
                <div className="space-y-3">
                  {otherAccounts.map((account) => (
                    <AccountCard 
                      key={account.id} 
                      account={account} 
                      onUpdate={handleUpdateAccount}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Financial Overview Charts */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Account Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="text-gray-800">Account Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={getAccountDistribution()}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="amount"
                      label={({ type, amount }) => `${type}: ${formatCurrency(amount, 'INR')}`}
                    >
                      {getAccountDistribution().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(Number(value), 'INR')} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Currency Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="text-gray-800">Currency Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={getCurrencyBreakdown()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="currency" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(Number(value), 'INR')} />
                    <Bar dataKey="amount" fill="#4361ee" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
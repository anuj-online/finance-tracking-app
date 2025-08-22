'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Account } from '@/types/account';
import { 
  Building, 
  CreditCard, 
  TrendingUp, 
  Wallet, 
  PiggyBank,
  ArrowRightLeft
} from 'lucide-react';

interface AccountCardProps {
  account: Account;
  onUpdate: (id: string, balance: number) => void;
}

const AccountTypeIcons: Record<string, React.ReactNode> = {
  BANK: <Building className="w-5 h-5" />,
  CREDIT: <CreditCard className="w-5 h-5" />,
  INVESTMENT: <TrendingUp className="w-5 h-5" />,
  CASH: <Wallet className="w-5 h-5" />,
  OTHER: <PiggyBank className="w-5 h-5" />
};

const AccountTypeLabels: Record<string, string> = {
  BANK: 'Bank Account',
  CREDIT: 'Credit Card',
  INVESTMENT: 'Investment',
  CASH: 'Cash',
  OTHER: 'Other'
};

const CurrencyColors: Record<string, string> = {
  INR: 'bg-yellow-400 text-gray-900',
  EUR: 'bg-orange-500 text-white',
  USD: 'bg-green-500 text-white',
  GBP: 'bg-blue-500 text-white'
};

export function AccountCard({ account, onUpdate }: AccountCardProps) {
  const handleUpdate = () => {
    const newBalance = prompt(`Update ${account.name} balance:`, account.balance.toString());
    if (newBalance && !isNaN(parseFloat(newBalance))) {
      onUpdate(account.id, parseFloat(newBalance));
    }
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-200 border-l-4" 
          style={{ borderLeftColor: account.color }}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105"
              style={{ backgroundColor: account.color + '20' }}
            >
              {AccountTypeIcons[account.type]}
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-800 text-lg">{account.name}</h4>
              <p className="text-sm text-gray-500 mb-2">{AccountTypeLabels[account.type]}</p>
              <div className="flex items-center space-x-2">
                <Badge className={CurrencyColors[account.currency]}>
                  {account.currency}
                </Badge>
                <span className="text-xl font-bold text-gray-800">
                  {formatCurrency(account.balance, account.currency)}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={handleUpdate}
              className="whitespace-nowrap"
            >
              <ArrowRightLeft className="w-3 h-3 mr-1" />
              Update
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function formatCurrency(amount: number, currency: string): string {
  const symbols: Record<string, string> = {
    INR: '₹',
    EUR: '€',
    USD: '$',
    GBP: '£'
  };
  
  const symbol = symbols[currency] || currency;
  return `${symbol} ${amount.toLocaleString()}`;
}
'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Account } from '@/types/account';
import { Plus } from 'lucide-react';

interface AccountFormProps {
  onSubmit: (account: Omit<Account, 'id' | 'createdAt'>) => void;
  children: React.ReactNode;
}

const AccountTypeOptions = [
  { value: 'BANK', label: 'Bank Account' },
  { value: 'CREDIT', label: 'Credit Card' },
  { value: 'INVESTMENT', label: 'Investment' },
  { value: 'CASH', label: 'Cash' },
  { value: 'OTHER', label: 'Other' }
];

const CurrencyOptions = [
  { value: 'INR', label: 'INR (₹)' },
  { value: 'EUR', label: 'EUR (€)' },
  { value: 'USD', label: 'USD ($)' },
  { value: 'GBP', label: 'GBP (£)' }
];

const DefaultColors = [
  '#4361ee', '#3f37c9', '#4cc9f0', '#fb5607', '#ffbe0b', '#06ffa5'
];

export function AccountForm({ onSubmit, children }: AccountFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    currency: 'INR',
    balance: '',
    color: DefaultColors[0],
    icon: 'bi-wallet2'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.type || !formData.balance) return;

    onSubmit({
      name: formData.name,
      type: formData.type,
      currency: formData.currency,
      balance: parseFloat(formData.balance) || 0,
      color: formData.color,
      icon: formData.icon
    });

    setFormData({
      name: '',
      type: '',
      currency: 'INR',
      balance: '',
      color: DefaultColors[0],
      icon: 'bi-wallet2'
    });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Add New Account
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="px-6 pb-6">
          <div className="space-y-5">
            {/* Account Name */}
            <div className="space-y-2">
              <Label htmlFor="accountName" className="text-sm font-medium text-gray-700">
                Account Name *
              </Label>
              <Input
                id="accountName"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Savings Account"
                className="w-full h-10"
                required
              />
            </div>
            
            {/* Account Type */}
            <div className="space-y-2">
              <Label htmlFor="accountType" className="text-sm font-medium text-gray-700">
                Account Type *
              </Label>
              <Select 
                value={formData.type} 
                onValueChange={(value) => setFormData({ ...formData, type: value })}
                required
              >
                <SelectTrigger className="w-full h-10">
                  <SelectValue placeholder="Choose account type" />
                </SelectTrigger>
                <SelectContent>
                  {AccountTypeOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Currency */}
            <div className="space-y-2">
              <Label htmlFor="accountCurrency" className="text-sm font-medium text-gray-700">
                Currency *
              </Label>
              <Select 
                value={formData.currency} 
                onValueChange={(value) => setFormData({ ...formData, currency: value })}
              >
                <SelectTrigger className="w-full h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CurrencyOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Opening Balance */}
            <div className="space-y-2">
              <Label htmlFor="openingBalance" className="text-sm font-medium text-gray-700">
                Opening Balance *
              </Label>
              <div className="relative">
                <Input
                  id="openingBalance"
                  type="number"
                  step="0.01"
                  value={formData.balance}
                  onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
                  placeholder="0.00"
                  className="w-full h-10 pr-12"
                  required
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 text-sm">
                  {formData.currency}
                </div>
              </div>
            </div>

            {/* Color Selection */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700">
                Account Color
              </Label>
              <div className="flex space-x-3 justify-center">
                {DefaultColors.map((color, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`w-8 h-8 rounded-full border-2 transition-all duration-200 hover:scale-110 ${
                      formData.color === color 
                        ? 'border-gray-800 ring-2 ring-gray-300 ring-offset-2' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setFormData({ ...formData, color })}
                    title={`Color ${index + 1}`}
                    aria-label={`Select color ${index + 1}`}
                  />
                ))}
              </div>
              <div className="text-center">
                <span className="text-xs text-gray-500">
                  Selected: <span className="font-medium" style={{ color: formData.color }}>
                    {formData.color}
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 justify-end pt-6 mt-6 border-t border-gray-200">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 h-10"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="px-4 py-2 h-10 bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Account
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
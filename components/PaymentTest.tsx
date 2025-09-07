'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { PaymentButton } from '@/components/PaymentButton';
import { usePayments, formatUSDC } from '@/lib/payments';
import { MICRO_TRANSACTION_PRICES } from '@/lib/constants';
import { CheckCircle, XCircle, Loader2, Wallet, AlertTriangle } from 'lucide-react';

export function PaymentTest() {
  const { address, isConnected } = useAccount();
  const { checkBalance, isWalletConnected } = usePayments();
  const [balance, setBalance] = useState<number | null>(null);
  const [isCheckingBalance, setIsCheckingBalance] = useState(false);
  const [balanceError, setBalanceError] = useState<string>('');
  const [testResults, setTestResults] = useState<Array<{
    test: string;
    status: 'pending' | 'success' | 'error';
    message: string;
    transactionHash?: string;
  }>>([]);

  const handleCheckBalance = async () => {
    setIsCheckingBalance(true);
    setBalanceError('');
    
    try {
      const result = await checkBalance();
      if (result.error) {
        setBalanceError(result.error);
        setBalance(null);
      } else {
        setBalance(result.balance);
      }
    } catch (error) {
      setBalanceError('Failed to check balance');
      setBalance(null);
    } finally {
      setIsCheckingBalance(false);
    }
  };

  const addTestResult = (test: string, status: 'success' | 'error', message: string, transactionHash?: string) => {
    setTestResults(prev => [
      ...prev.filter(r => r.test !== test),
      { test, status, message, transactionHash }
    ]);
  };

  const testPayments = [
    {
      name: 'Featured Post',
      amount: MICRO_TRANSACTION_PRICES.FEATURED_POST,
      description: 'Test payment for featured post functionality'
    },
    {
      name: 'Advanced Filters',
      amount: MICRO_TRANSACTION_PRICES.ADVANCED_FILTERS,
      description: 'Test payment for advanced filters functionality'
    },
    {
      name: 'Resource Bump',
      amount: MICRO_TRANSACTION_PRICES.RESOURCE_BUMP,
      description: 'Test payment for resource bump functionality'
    },
    {
      name: 'Premium Search',
      amount: MICRO_TRANSACTION_PRICES.PREMIUM_SEARCH,
      description: 'Test payment for premium search functionality'
    }
  ];

  const getStatusIcon = (status: 'pending' | 'success' | 'error') => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-400" />;
      default:
        return <Loader2 className="w-5 h-5 text-yellow-400 animate-spin" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-heading text-white mb-4">X402 Payment Flow Test</h2>
        <p className="text-body text-white text-opacity-80 mb-6">
          This component tests the integration of wagmi useWalletClient with x402-axios for USDC payments on Base.
        </p>

        {/* Wallet Connection Status */}
        <div className="mb-6">
          <h3 className="text-body text-white mb-3">Wallet Connection</h3>
          <div className="flex items-center space-x-3 p-3 bg-gray-800 rounded-lg">
            <Wallet className="w-5 h-5 text-blue-400" />
            <div>
              <p className="text-body text-white">
                Status: {isConnected ? 'Connected' : 'Not Connected'}
              </p>
              {address && (
                <p className="text-caption text-white text-opacity-60">
                  Address: {address.slice(0, 6)}...{address.slice(-4)}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Balance Check */}
        <div className="mb-6">
          <h3 className="text-body text-white mb-3">USDC Balance Check</h3>
          <div className="flex items-center space-x-3 mb-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCheckBalance}
              disabled={!isWalletConnected || isCheckingBalance}
            >
              {isCheckingBalance ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Checking...
                </>
              ) : (
                'Check Balance'
              )}
            </Button>
            {balance !== null && (
              <span className="text-body text-white">
                Balance: {formatUSDC(balance)}
              </span>
            )}
          </div>
          {balanceError && (
            <div className="flex items-center space-x-2 p-3 bg-red-900 bg-opacity-20 border border-red-500 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <p className="text-body text-red-300">{balanceError}</p>
            </div>
          )}
        </div>

        {/* Payment Tests */}
        <div className="mb-6">
          <h3 className="text-body text-white mb-3">Payment Tests</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {testPayments.map((payment) => (
              <div key={payment.name} className="p-4 bg-gray-800 rounded-lg">
                <h4 className="text-body text-white mb-2">{payment.name}</h4>
                <p className="text-caption mb-3">{formatUSDC(payment.amount)}</p>
                <PaymentButton
                  amount={payment.amount}
                  description={payment.description}
                  onSuccess={(hash) => addTestResult(payment.name, 'success', 'Payment completed successfully', hash)}
                  onError={(error) => addTestResult(payment.name, 'error', error)}
                  size="sm"
                  disabled={!isWalletConnected}
                >
                  Test {payment.name}
                </PaymentButton>
              </div>
            ))}
          </div>
        </div>

        {/* Test Results */}
        {testResults.length > 0 && (
          <div>
            <h3 className="text-body text-white mb-3">Test Results</h3>
            <div className="space-y-2">
              {testResults.map((result, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-gray-800 rounded-lg">
                  {getStatusIcon(result.status)}
                  <div className="flex-1">
                    <p className="text-body text-white">{result.test}</p>
                    <p className="text-caption text-white text-opacity-80">{result.message}</p>
                    {result.transactionHash && (
                      <p className="text-xs font-mono text-green-400 mt-1 break-all">
                        TX: {result.transactionHash}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-6 p-4 bg-blue-900 bg-opacity-20 border border-blue-500 rounded-lg">
          <h4 className="text-body text-white mb-2">Test Instructions</h4>
          <ol className="text-caption text-white text-opacity-80 space-y-1 list-decimal list-inside">
            <li>Connect your wallet using the wallet button above</li>
            <li>Check your USDC balance on Base network</li>
            <li>Ensure you have sufficient USDC for testing</li>
            <li>Click any payment test button to initiate a transaction</li>
            <li>Confirm the transaction in your wallet</li>
            <li>Wait for blockchain confirmation</li>
            <li>Verify the transaction hash in the results</li>
          </ol>
        </div>
      </Card>
    </div>
  );
}

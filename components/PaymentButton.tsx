'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { usePayments, formatUSDC, type PaymentRequest } from '@/lib/payments';
import { Loader2, CreditCard, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface PaymentButtonProps {
  amount: number;
  description: string;
  onSuccess?: (transactionHash: string) => void;
  onError?: (error: string) => void;
  disabled?: boolean;
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export function PaymentButton({
  amount,
  description,
  onSuccess,
  onError,
  disabled = false,
  children,
  variant = 'primary',
  size = 'md',
}: PaymentButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'confirming' | 'success' | 'error'>('idle');
  const [transactionHash, setTransactionHash] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [balance, setBalance] = useState<number>(0);

  const { processPayment, checkBalance, waitForConfirmation, isWalletConnected } = usePayments();

  const handlePaymentClick = async () => {
    if (!isWalletConnected) {
      setErrorMessage('Please connect your wallet first');
      setPaymentStatus('error');
      setIsModalOpen(true);
      return;
    }

    // Check balance first
    const balanceResult = await checkBalance();
    setBalance(balanceResult.balance);
    
    if (balanceResult.error) {
      setErrorMessage(balanceResult.error);
      setPaymentStatus('error');
      setIsModalOpen(true);
      return;
    }

    if (balanceResult.balance < amount) {
      setErrorMessage(`Insufficient balance. You need ${formatUSDC(amount)} but only have ${formatUSDC(balanceResult.balance)}`);
      setPaymentStatus('error');
      setIsModalOpen(true);
      return;
    }

    setIsModalOpen(true);
    setPaymentStatus('idle');
  };

  const processTransaction = async () => {
    setIsProcessing(true);
    setPaymentStatus('processing');

    const paymentRequest: PaymentRequest = {
      amount,
      description,
    };

    try {
      const result = await processPayment(paymentRequest);

      if (result.success && result.transactionHash) {
        setTransactionHash(result.transactionHash);
        setPaymentStatus('confirming');

        // Wait for transaction confirmation
        const confirmed = await waitForConfirmation(result.transactionHash);
        
        if (confirmed) {
          setPaymentStatus('success');
          onSuccess?.(result.transactionHash);
        } else {
          setPaymentStatus('error');
          setErrorMessage('Transaction failed to confirm. Please check the blockchain explorer.');
          onError?.('Transaction failed to confirm');
        }
      } else {
        setPaymentStatus('error');
        setErrorMessage(result.error || 'Payment failed');
        onError?.(result.error || 'Payment failed');
      }
    } catch (error) {
      setPaymentStatus('error');
      const errorMsg = error instanceof Error ? error.message : 'Unknown error occurred';
      setErrorMessage(errorMsg);
      onError?.(errorMsg);
    } finally {
      setIsProcessing(false);
    }
  };

  const resetModal = () => {
    setIsModalOpen(false);
    setPaymentStatus('idle');
    setTransactionHash('');
    setErrorMessage('');
    setIsProcessing(false);
  };

  const renderModalContent = () => {
    switch (paymentStatus) {
      case 'idle':
        return (
          <div className="space-y-4">
            <div className="text-center">
              <CreditCard className="w-12 h-12 mx-auto mb-4 text-blue-400" />
              <h3 className="text-heading text-white mb-2">Confirm Payment</h3>
              <p className="text-body text-white text-opacity-80 mb-4">{description}</p>
              <div className="bg-gray-800 rounded-lg p-4 mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-caption">Amount:</span>
                  <span className="text-heading text-white">{formatUSDC(amount)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-caption">Your Balance:</span>
                  <span className="text-body text-white">{formatUSDC(balance)}</span>
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={resetModal}
                className="flex-1"
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={processTransaction}
                className="flex-1"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Pay Now'
                )}
              </Button>
            </div>
          </div>
        );

      case 'processing':
        return (
          <div className="text-center space-y-4">
            <Loader2 className="w-12 h-12 mx-auto animate-spin text-blue-400" />
            <h3 className="text-heading text-white">Processing Payment</h3>
            <p className="text-body text-white text-opacity-80">
              Please confirm the transaction in your wallet...
            </p>
          </div>
        );

      case 'confirming':
        return (
          <div className="text-center space-y-4">
            <Loader2 className="w-12 h-12 mx-auto animate-spin text-yellow-400" />
            <h3 className="text-heading text-white">Confirming Transaction</h3>
            <p className="text-body text-white text-opacity-80">
              Waiting for blockchain confirmation...
            </p>
            {transactionHash && (
              <div className="bg-gray-800 rounded-lg p-3">
                <p className="text-caption mb-1">Transaction Hash:</p>
                <p className="text-xs font-mono text-blue-400 break-all">
                  {transactionHash}
                </p>
              </div>
            )}
          </div>
        );

      case 'success':
        return (
          <div className="text-center space-y-4">
            <CheckCircle className="w-12 h-12 mx-auto text-green-400" />
            <h3 className="text-heading text-white">Payment Successful!</h3>
            <p className="text-body text-white text-opacity-80">
              Your payment of {formatUSDC(amount)} has been confirmed.
            </p>
            {transactionHash && (
              <div className="bg-gray-800 rounded-lg p-3">
                <p className="text-caption mb-1">Transaction Hash:</p>
                <p className="text-xs font-mono text-green-400 break-all">
                  {transactionHash}
                </p>
              </div>
            )}
            <Button variant="primary" onClick={resetModal} className="w-full">
              Close
            </Button>
          </div>
        );

      case 'error':
        return (
          <div className="text-center space-y-4">
            <XCircle className="w-12 h-12 mx-auto text-red-400" />
            <h3 className="text-heading text-white">Payment Failed</h3>
            <div className="bg-red-900 bg-opacity-20 border border-red-500 rounded-lg p-3">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-400 mr-2 flex-shrink-0" />
                <p className="text-body text-red-300">{errorMessage}</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={resetModal} className="flex-1">
                Close
              </Button>
              <Button variant="primary" onClick={() => setPaymentStatus('idle')} className="flex-1">
                Try Again
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={handlePaymentClick}
        disabled={disabled || isProcessing}
      >
        {children || `Pay ${formatUSDC(amount)}`}
      </Button>

      <Modal
        isOpen={isModalOpen}
        onClose={paymentStatus === 'processing' || paymentStatus === 'confirming' ? undefined : resetModal}
        title=""
      >
        {renderModalContent()}
      </Modal>
    </>
  );
}

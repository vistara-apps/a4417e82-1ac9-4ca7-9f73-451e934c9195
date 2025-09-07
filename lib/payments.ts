import { useWalletClient } from 'wagmi';
import { X402Client } from 'x402-axios';
import { base } from 'wagmi/chains';
import { parseUnits, formatUnits } from 'viem';

// USDC contract address on Base
export const USDC_CONTRACT_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';

// Payment types
export interface PaymentRequest {
  amount: number; // Amount in USDC (e.g., 0.5 for $0.50)
  description: string;
  recipient?: string; // Optional recipient address
}

export interface PaymentResult {
  success: boolean;
  transactionHash?: string;
  error?: string;
}

// Custom hook for payment functionality
export function usePayments() {
  const { data: walletClient } = useWalletClient();

  const initializeX402Client = () => {
    if (!walletClient) {
      throw new Error('Wallet not connected');
    }

    return new X402Client({
      walletClient,
      chainId: base.id,
      usdcAddress: USDC_CONTRACT_ADDRESS,
    });
  };

  const processPayment = async (paymentRequest: PaymentRequest): Promise<PaymentResult> => {
    try {
      if (!walletClient) {
        return {
          success: false,
          error: 'Wallet not connected. Please connect your wallet first.',
        };
      }

      const x402Client = initializeX402Client();
      
      // Convert USDC amount to wei (USDC has 6 decimals)
      const amountInWei = parseUnits(paymentRequest.amount.toString(), 6);

      // Process the payment using x402-axios
      const result = await x402Client.pay({
        amount: amountInWei,
        token: USDC_CONTRACT_ADDRESS,
        recipient: paymentRequest.recipient,
        metadata: {
          description: paymentRequest.description,
          timestamp: Date.now(),
        },
      });

      return {
        success: true,
        transactionHash: result.transactionHash,
      };
    } catch (error) {
      console.error('Payment failed:', error);
      
      let errorMessage = 'Payment failed. Please try again.';
      
      if (error instanceof Error) {
        if (error.message.includes('insufficient funds')) {
          errorMessage = 'Insufficient USDC balance. Please add funds to your wallet.';
        } else if (error.message.includes('user rejected')) {
          errorMessage = 'Payment cancelled by user.';
        } else if (error.message.includes('network')) {
          errorMessage = 'Network error. Please check your connection and try again.';
        }
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  const checkBalance = async (): Promise<{ balance: number; error?: string }> => {
    try {
      if (!walletClient) {
        return { balance: 0, error: 'Wallet not connected' };
      }

      const x402Client = initializeX402Client();
      const balance = await x402Client.getBalance(USDC_CONTRACT_ADDRESS);
      
      // Convert from wei to USDC (6 decimals)
      const balanceInUsdc = parseFloat(formatUnits(balance, 6));
      
      return { balance: balanceInUsdc };
    } catch (error) {
      console.error('Failed to check balance:', error);
      return { 
        balance: 0, 
        error: 'Failed to check balance. Please try again.' 
      };
    }
  };

  const waitForConfirmation = async (transactionHash: string): Promise<boolean> => {
    try {
      if (!walletClient) {
        throw new Error('Wallet not connected');
      }

      const x402Client = initializeX402Client();
      const receipt = await x402Client.waitForTransaction(transactionHash);
      
      return receipt.status === 'success';
    } catch (error) {
      console.error('Failed to wait for confirmation:', error);
      return false;
    }
  };

  return {
    processPayment,
    checkBalance,
    waitForConfirmation,
    isWalletConnected: !!walletClient,
  };
}

// Utility functions for payment amounts
export const getPaymentAmount = (feature: keyof typeof import('./constants').MICRO_TRANSACTION_PRICES) => {
  const { MICRO_TRANSACTION_PRICES } = require('./constants');
  return MICRO_TRANSACTION_PRICES[feature];
};

export const formatUSDC = (amount: number): string => {
  return `$${amount.toFixed(2)} USDC`;
};

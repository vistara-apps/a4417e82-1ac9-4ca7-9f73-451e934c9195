import { TurnkeyApi } from '@turnkey/http';
import { WebauthnStamper } from '@turnkey/webauthn-stamper';
import { APP_CONFIG, MICRO_TRANSACTION_PRICES } from '../constants';
import { SupabaseService } from './supabase';

export class PaymentService {
  private static turnkeyClient: TurnkeyApi | null = null;

  private static getTurnkeyClient() {
    if (!this.turnkeyClient) {
      const stamper = new WebauthnStamper({
        rpId: process.env.NEXT_PUBLIC_APP_URL || 'localhost',
      });

      this.turnkeyClient = new TurnkeyApi({
        apiBaseUrl: process.env.NEXT_PUBLIC_TURNKEY_API_BASE_URL!,
        stamper,
        apiPrivateKey: process.env.TURNKEY_API_PRIVATE_KEY!,
        apiPublicKey: process.env.TURNKEY_API_PUBLIC_KEY!,
        defaultOrganizationId: process.env.TURNKEY_ORGANIZATION_ID!,
      });
    }
    return this.turnkeyClient;
  }

  static async createWallet(userId: string) {
    try {
      const client = this.getTurnkeyClient();
      
      const response = await client.createWallet({
        type: 'WALLET_TYPE_ETHEREUM',
        walletName: `campus-connect-${userId}`,
        accounts: [{
          curve: 'CURVE_SECP256K1',
          pathFormat: 'PATH_FORMAT_BIP32',
          path: "m/44'/60'/0'/0/0",
          addressFormat: 'ADDRESS_FORMAT_ETHEREUM',
        }],
      });

      return response.wallet;
    } catch (error) {
      console.error('Error creating wallet:', error);
      throw new Error('Failed to create wallet');
    }
  }

  static async processPayment(params: {
    userId: string;
    amount: number;
    type: keyof typeof MICRO_TRANSACTION_PRICES;
    metadata?: Record<string, any>;
  }) {
    try {
      const { userId, amount, type, metadata = {} } = params;

      // Create payment record
      const payment = await SupabaseService.createPayment({
        userId,
        amount,
        currency: 'USDC',
        type,
        status: 'pending',
        metadata,
      });

      // Process USDC payment on Base
      const client = this.getTurnkeyClient();
      
      const transaction = await client.signTransaction({
        type: 'ACTIVITY_TYPE_SIGN_TRANSACTION_V2',
        organizationId: process.env.TURNKEY_ORGANIZATION_ID!,
        parameters: {
          signWith: `${userId}-wallet`,
          type: 'TRANSACTION_TYPE_ETHEREUM',
          unsignedTransaction: {
            to: APP_CONFIG.usdcAddress,
            value: '0x0',
            data: this.encodeUSDCTransfer(
              process.env.CAMPUS_CONNECT_TREASURY_ADDRESS!,
              amount
            ),
            gasLimit: '0x5208',
            gasPrice: '0x3b9aca00',
            nonce: '0x0',
            chainId: APP_CONFIG.baseChainId,
          },
        },
      });

      // Update payment with transaction hash
      await SupabaseService.updatePayment(payment.paymentId, {
        transactionHash: transaction.signedTransaction,
        status: 'completed',
      });

      return {
        success: true,
        paymentId: payment.paymentId,
        transactionHash: transaction.signedTransaction,
      };
    } catch (error) {
      console.error('Payment processing error:', error);
      throw new Error('Payment failed');
    }
  }

  static async featurePost(userId: string, postId: string, postType: 'group' | 'resource') {
    const amount = MICRO_TRANSACTION_PRICES.FEATURED_POST;
    
    const result = await this.processPayment({
      userId,
      amount,
      type: 'FEATURED_POST',
      metadata: {
        postId,
        postType,
        featuredUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
      },
    });

    if (result.success) {
      // Update the post to be featured
      if (postType === 'group') {
        await SupabaseService.featureGroup(postId, 7); // Feature for 7 days
      } else if (postType === 'resource') {
        await SupabaseService.featureResource(postId, 7); // Feature for 7 days
      }
    }

    return result;
  }

  static async purchaseAdvancedFilters(userId: string) {
    const amount = MICRO_TRANSACTION_PRICES.ADVANCED_FILTERS;
    
    return await this.processPayment({
      userId,
      amount,
      type: 'ADVANCED_FILTERS',
      metadata: {
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
      },
    });
  }

  static async bumpResource(userId: string, resourceId: string) {
    const amount = MICRO_TRANSACTION_PRICES.RESOURCE_BUMP;
    
    const result = await this.processPayment({
      userId,
      amount,
      type: 'RESOURCE_BUMP',
      metadata: {
        resourceId,
        bumpedAt: new Date().toISOString(),
      },
    });

    if (result.success) {
      // Update resource timestamp to bump it to the top
      await SupabaseService.bumpResource(resourceId);
    }

    return result;
  }

  static async createPremiumGroup(userId: string, groupId: string) {
    const amount = MICRO_TRANSACTION_PRICES.PREMIUM_GROUP;
    
    return await this.processPayment({
      userId,
      amount,
      type: 'PREMIUM_GROUP',
      metadata: {
        groupId,
        premiumFeatures: ['advanced_analytics', 'priority_support', 'custom_branding'],
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
      },
    });
  }

  private static encodeUSDCTransfer(to: string, amount: number): string {
    // ERC-20 transfer function signature: transfer(address,uint256)
    const functionSignature = '0xa9059cbb';
    
    // Convert amount to wei (USDC has 6 decimals)
    const amountInWei = (amount * 1e6).toString(16).padStart(64, '0');
    
    // Remove 0x prefix from address and pad to 64 characters
    const addressHex = to.slice(2).padStart(64, '0');
    
    return functionSignature + addressHex + amountInWei;
  }

  static async getPaymentHistory(userId: string) {
    return await SupabaseService.getPaymentHistory(userId);
  }

  static async getPaymentStatus(paymentId: string) {
    return await SupabaseService.getPayment(paymentId);
  }
}

// Extend SupabaseService with payment methods
declare module './supabase' {
  namespace SupabaseService {
    function createPayment(paymentData: {
      userId: string;
      amount: number;
      currency: string;
      type: string;
      status?: 'pending' | 'completed' | 'failed';
      transactionHash?: string | null;
      metadata?: Record<string, any>;
    }): Promise<any>;

    function updatePayment(paymentId: string, updates: {
      status?: 'pending' | 'completed' | 'failed';
      transactionHash?: string;
    }): Promise<any>;

    function getPayment(paymentId: string): Promise<any>;
    function getPaymentHistory(userId: string): Promise<any[]>;
    function featureGroup(groupId: string, days: number): Promise<any>;
    function featureResource(resourceId: string, days: number): Promise<any>;
    function bumpResource(resourceId: string): Promise<any>;
  }
}

import React from 'react';
import { loadStripe } from '@stripe/stripe-js';

interface StripePaymentProps {
  planId: string;
  planName: string;
  price: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const StripePayment: React.FC<StripePaymentProps> = ({ 
  planId, 
  planName, 
  price, 
  onSuccess, 
  onCancel 
}) => {
  const handlePayment = async () => {
    try {
      // Create checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ planId }),
      });

      const { sessionId } = await response.json();

      // Load Stripe
      const stripe = await loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_51RqSNkPjQ9HnkXy9LjfwHTYHdUGT28whTxP9OrSJA61U6qrsfKrMuryej1PgKam8AqK8zjghzsS7rIHU2i2CW7zV00Qyb7gthO');

      if (stripe) {
        // Redirect to Stripe checkout
        const { error } = await stripe.redirectToCheckout({
          sessionId,
        });

        if (error) {
          console.error('Stripe checkout error:', error);
          alert('Payment failed. Please try again.');
        }
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    }
  };

  return (
    <button
      onClick={handlePayment}
      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-full font-semibold hover:shadow-lg transition-all"
    >
      Subscribe to {planName} - ${(price / 100).toFixed(2)}/month
    </button>
  );
};

export default StripePayment; 
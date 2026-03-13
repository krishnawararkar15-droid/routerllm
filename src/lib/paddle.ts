export const initPaddle = () => {
  if (typeof window !== 'undefined' && (window as any).Paddle) {
    (window as any).Paddle.Initialize({
      token: import.meta.env.VITE_PADDLE_CLIENT_TOKEN
    });
  }
};

export const openCheckout = (priceId: string, userEmail?: string) => {
  if (typeof window !== 'undefined' && (window as any).Paddle) {
    const checkoutConfig: any = {
      items: [{ priceId, quantity: 1 }],
    };
    
    if (userEmail && userEmail.trim() !== '') {
      checkoutConfig.customer = { email: userEmail };
    }
    
    (window as any).Paddle.Checkout.open(checkoutConfig);
  }
};

export const initPaddle = () => {
  if (typeof window !== 'undefined' && (window as any).Paddle) {
    (window as any).Paddle.Initialize({
      token: import.meta.env.VITE_PADDLE_CLIENT_TOKEN
    });
  }
};

export const openCheckout = (priceId: string, userEmail: string) => {
  if (typeof window !== 'undefined' && (window as any).Paddle) {
    (window as any).Paddle.Checkout.open({
      items: [{ priceId, quantity: 1 }],
      customer: { email: userEmail },
    });
  }
};

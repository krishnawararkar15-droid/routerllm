export const initPaddle = () => {
  if (typeof window === 'undefined') return;
  
  const tryInit = () => {
    if ((window as any).Paddle) {
      (window as any).Paddle.Initialize({
        token: import.meta.env.VITE_PADDLE_CLIENT_TOKEN
      });
    } else {
      setTimeout(tryInit, 100);
    }
  };
  tryInit();
};

export const openCheckout = (priceId?: string) => {
  if (!priceId) {
    console.error('No priceId provided');
    return;
  }
  
  const tryCheckout = () => {
    if ((window as any).Paddle) {
      (window as any).Paddle.Checkout.open({
        items: [{ priceId, quantity: 1 }]
      });
    } else {
      setTimeout(tryCheckout, 100);
    }
  };
  tryCheckout();
};

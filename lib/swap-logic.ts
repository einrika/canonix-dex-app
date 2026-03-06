export interface SwapState {
  payAmount: number;
  tradeType: 'buy' | 'sell';
  slippage: number;
  reservePaxi: number;
  reservePrc20: number;
  tokenDecimals: number;
}

export interface SwapResult {
  outputAmount: number;
  priceImpact: number;
  minReceived: number;
}

export const calculateSwap = (state: SwapState): SwapResult => {
  const { payAmount, tradeType, slippage, reservePaxi, reservePrc20, tokenDecimals } = state;

  if (payAmount <= 0 || reservePaxi <= 0 || reservePrc20 <= 0) {
    return { outputAmount: 0, priceImpact: 0, minReceived: 0 };
  }

  let outputAmountBase: number;
  let priceImpact: number;
  let targetDecimals: number;

  if (tradeType === 'buy') {
    // Buy: PAXI -> TOKEN
    const fromAmountBase = payAmount * 1e6;
    const fee = fromAmountBase * 0.003;
    const amountAfterFee = fromAmountBase - fee;
    outputAmountBase = (amountAfterFee * reservePrc20) / (reservePaxi + amountAfterFee);
    priceImpact = (amountAfterFee / (reservePaxi + amountAfterFee)) * 100;
    targetDecimals = tokenDecimals;
  } else {
    // Sell: TOKEN -> PAXI
    const fromAmountBase = payAmount * Math.pow(10, tokenDecimals);
    const fee = fromAmountBase * 0.003;
    const amountAfterFee = fromAmountBase - fee;
    outputAmountBase = (amountAfterFee * reservePaxi) / (reservePrc20 + amountAfterFee);
    priceImpact = (amountAfterFee / (reservePrc20 + amountAfterFee)) * 100;
    targetDecimals = 6;
  }

  const outputAmount = outputAmountBase / Math.pow(10, targetDecimals);
  const minReceived = (outputAmountBase * (1 - slippage / 100)) / Math.pow(10, targetDecimals);

  return {
    outputAmount,
    priceImpact,
    minReceived
  };
};

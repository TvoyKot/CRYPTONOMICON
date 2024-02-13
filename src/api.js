const API_KEY = "581026cb141a055de5f56da3458b2684d81228b9ab78ce29dddea0a2c007f0f0";

const tickersHandlers = new Map(); //  {}

//TODO: refactor to use URLSearchParams
export const loadTickers = () => {
  
  if (tickersHandlers.size === 0) {
    return;
  }

  fetch(
     `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${[...tickersHandlers.keys()
     ].join(
         ","
     )}&tsyms=USD&api_key=${API_KEY}`
   ).then(r => r.json())
   .then(rawData => {
     const updatedPrices = Object.fromEntries(
         Object.entries(rawData).map(([key, value]) => [key, value.USD])
       );
       Object.entries(updatedPrices).forEach(([currency, newPrice]) => {
        const handlers = tickersHandlers.get(currency) ?? [];
        handlers.forEach(fn => fn(newPrice));
       });
});
};

    export const subscribeToTicker = (ticker, cb) => {
      const subscribers = tickersHandlers.get(ticker) || [];
      tickersHandlers.set(ticker, [...subscribers, cb]);
    };

    export const unsubscribeFromTicker = ticker => {
     tickersHandlers.delete(ticker);
    };
  setInterval(loadTickers, 5000)
    window.tickersHandlers = tickersHandlers;
    // Получить стоимость криптовалютных пар с АПИшки
    // Получить ОБНОВЛЕНИЯ стоимости криптовалютных пар с АПИшки
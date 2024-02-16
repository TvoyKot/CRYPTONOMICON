const API_KEY = "deb715229bf3dcb724c9f9f6f5a639e0b111eaf52540d1c6a2ddd31a71c7d1bb";

const tickersHandlers = new Map(); //  {}

const socket = new WebSocket(
  `wss://streamer.cryptocompare.com/v2?api_key=${API_KEY}`
  );

const AGGREGATE_INDEX = '5';


  socket.addEventListener('message', e => {
    const {TYPE: type, FROMSYMBOL: currency, PRICE: newPrice } = JSON.parse(e.data);

    if (type !== AGGREGATE_INDEX) {
      return;
    }

    const handlers = tickersHandlers.get(currency) ?? [];
    handlers.forEach(fn => fn(newPrice));
  })

function sendToWebSocket(message) {
  const stringifiedMessage = JSON.stringify(message);

  if (socket.readyState === WebSocket.OPEN) {
    socket.send(message);
    return;
  }

  socket.addEventListener('open', () => {
    socket.send(stringifiedMessage);
  },
  { once: true});
}

function subscribeToTickerOnWs (ticker) {
  sendToWebSocket({
    action: "SubAdd",
    subs: [`5~CCCAGG~${ticker}~USD`]
  });
}

function unsubscribeFromTickerOnWs (ticker) {
  sendToWebSocket({
    action: "SubRemove",
    subs: [`5~CCCAGG~${ticker}~USD`]
  });
}

    export const subscribeToTicker = (ticker, cb) => {
      const subscribers = tickersHandlers.get(ticker) || [];
      tickersHandlers.set(ticker, [...subscribers, cb]);
      subscribeToTickerOnWs(ticker);
    };

    export const unsubscribeFromTicker = ticker => {
     tickersHandlers.delete(ticker);
     unsubscribeFromTickerOnWs(ticker);
    };
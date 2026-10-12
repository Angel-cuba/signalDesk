# Technical Decisions — SignalDesk

### Stack and Architecture

I chose **React Native, Expo, and TypeScript** to build a cross-platform mobile application with a straightforward, maintainable architecture. Expo Router handles navigation, while React hooks and dedicated services separate UI state, authentication, market data, signal calculations, and notifications.

### Authentication and Storage

**Supabase Auth** manages email/password authentication and persistent sessions. User profiles, risk preferences, and watchlists are stored in Supabase, protected by Row Level Security (RLS). **Expo SecureStore** provides secure local persistence for session-related data and previously observed signal timestamps.

### Market Data and Signal Logic

SignalDesk retrieves hourly candlestick data from the public **Binance API**. Trading signals are calculated locally using completed candles and an explainable **SMA5/SMA10 crossover strategy**:

- **BUY:** SMA5 crosses above SMA10.
- **SELL:** SMA5 crosses below SMA10.
- **NEUTRAL:** No new crossover is detected.

Each signal includes its explanation and timestamp. Local notifications are generated when a newly observed BUY or SELL signal is detected for a watchlisted asset, while stored timestamps help prevent duplicate alerts.

### Scope and Future Improvements

My priority was to demonstrate the **complete functional workflow**, rather than turn SignalDesk into a continuously operating trading platform.

The initial watchlist supports three cryptocurrency pairs. Expanding this to a dynamic catalog would involve retrieving available trading pairs from Binance, adapting asset validation, and introducing a searchable selector. The existing SMA calculation would remain unchanged.

Market updates are performed on demand rather than through continuous background monitoring.

Future improvements could include automated tests, more comprehensive API error handling, dynamic asset selection, and server-side monitoring for notifications while the application is closed.

### AI Tools

I used **ChatGPT** for implementation guidance, debugging, code review, and documentation.

I reviewed and adapted its suggestions to the project's requirements, prioritizing a transparent SMA strategy, clear separation of responsibilities, and a functional implementation. More complex abstractions and features outside the assessment scope were intentionally excluded.

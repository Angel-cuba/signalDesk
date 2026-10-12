# Technical Decisions — SignalDesk

### Stack and Architecture

SignalDesk uses **React Native, Expo, and TypeScript** to deliver a cross-platform mobile application with a small, maintainable codebase. Expo Router handles navigation, while custom React hooks separate UI state from business logic. Market data retrieval, signal calculations, authentication, and notifications are implemented in dedicated services.

### Authentication and Storage

**Supabase Auth** handles email/password authentication and session management. User profiles, risk preferences, and watchlists are stored in Supabase, with access controlled through Row Level Security (RLS). **Expo SecureStore** provides secure local persistence for session-related data and previously observed signal timestamps. No exchange credentials are required.

### Market API and Signal Logic

The application retrieves public hourly candlestick data from the **Binance API**. Signals are calculated locally using completed candles and a **SMA5/SMA10 crossover strategy**: BUY when SMA5 crosses above SMA10, SELL when it crosses below, and NEUTRAL otherwise. Each result includes an explanation and timestamp.

Local notifications are triggered when a newly observed BUY or SELL signal is detected for a watchlisted asset. Stored timestamps prevent repeated notifications for the same candle.

### Trade-offs and Improvements

To stay within the assessment scope, I prioritized a working, explainable implementation over complex trading indicators or predictive AI models. Market updates are performed on demand; background monitoring and push notifications are not implemented.

Given more time, I would add automated tests for crossover scenarios, more robust market-data error handling, and server-side monitoring for notifications when the app is closed.

### AI Tools

I used **ChatGPT** as a development assistant for implementation guidance, code review, debugging, and documentation. I reviewed and adapted the suggestions to fit the existing architecture, including simplifying the signal strategy, separating responsibilities into services, and avoiding unnecessary abstractions. I also rejected additional features that were not required by the assessment.

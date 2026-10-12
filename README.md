# SignalDesk

SignalDesk is a mobile application built with React Native and Expo that allows users to monitor cryptocurrency markets and receive trading signals based on a simple, explainable technical indicator.

The project was developed as a technical assessment, focusing on authentication, user preferences, external API integration, signal generation, and local notifications.

## Features

- **Authentication:** Email/password registration, login, logout, and persistent sessions.
- **User Profile:** Update your display name and risk preference (Conservative, Balanced, or Aggressive).
- **Watchlist:** Select the cryptocurrency pairs you want to monitor.
- **Market Data:** Retrieve historical candlestick data from the public Binance API.
- **Trading Signals:** Generate BUY, SELL, or NEUTRAL signals using moving averages.
- **Signal Details:** View the signal explanation, timestamp, and SMA values.
- **Local Notifications:** Receive notifications when a new BUY or SELL signal is detected for a watchlisted asset.
- **Manual Refresh:** Request updated market data and recalculate signals.

## Tech Stack

| Technology         | Purpose                             |
| ------------------ | ----------------------------------- |
| React Native       | Mobile application                  |
| Expo               | Development and native integrations |
| TypeScript         | Type safety                         |
| Expo Router        | Navigation                          |
| Supabase           | Authentication and user profiles    |
| Binance Public API | Cryptocurrency market data          |
| Expo SecureStore   | Secure local persistence            |
| Expo Notifications | Local notifications                 |

## Getting Started

### Prerequisites

Before running SignalDesk, make sure you have:

- Node.js and npm installed.
- Git installed.
- Xcode and an iOS Simulator (macOS), or a compatible Android development environment.
- A Supabase project configured for email/password authentication and user profiles.

### 1. Clone the repository

```bash
git clone <REPOSITORY_URL>
cd signalDesk
```

Replace `<REPOSITORY_URL>` with the GitHub repository URL.

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_publishable_or_anon_key
```

Replace the placeholder values with your Supabase project configuration.

> The Supabase key used by the mobile application must be a client-safe publishable/anon key, never a service-role or secret key. Database access must be protected by Row Level Security (RLS).

### 4. Configure Supabase

SignalDesk uses Supabase Authentication and a `profiles` table to store user preferences.

The database must support the following profile information:

- User ID linked to the authenticated account.
- Display name.
- Risk preference.
- Watchlist.

Ensure that Row Level Security policies allow authenticated users to access and update only their own profiles.

### 5. Run the application

Start the Expo development server:

```bash
npx expo start
```

To launch the application on an iOS Simulator, press:

```text
i
```

Alternatively, follow the instructions displayed by Expo for your development environment.

> Native notification support depends on the Expo runtime and platform configuration. If your Expo Go version does not support the required notification functionality, use a compatible development build.

## How Trading Signals Work

SignalDesk uses a **Simple Moving Average (SMA) crossover strategy**.

The application retrieves hourly candlestick data from Binance and calculates:

- **SMA5:** Average closing price of the last 5 completed candles.
- **SMA10:** Average closing price of the last 10 completed candles.

Signals are generated using the following rules:

| Signal  | Condition                    |
| ------- | ---------------------------- |
| BUY     | SMA5 crosses above SMA10     |
| SELL    | SMA5 crosses below SMA10     |
| NEUTRAL | No new crossover is detected |

Only completed candles are used to avoid generating signals from unfinished market data.

Each signal includes its type, explanation, timestamp, and calculated SMA values.

### Example

If SMA5 was previously below SMA10 and then crosses above it, SignalDesk generates a **BUY** signal.

If the averages do not cross, the result is **NEUTRAL**, even when SMA5 remains above or below SMA10.

## Notifications

SignalDesk supports local notifications for new BUY and SELL signals.

When market data is refreshed, the application:

1. Calculates the latest signal.
2. Checks whether the corresponding market candle has already been processed.
3. Stores the latest observed candle timestamp.
4. Sends a local notification if a new BUY or SELL signal is detected.

The first observation establishes a baseline to avoid sending notifications for historical signals.

Notification state is stored locally and scoped to the authenticated user and asset to prevent repeated alerts.

**Important:** SignalDesk checks for new signals when market data is fetched. It does not continuously monitor markets while the application is closed.

## Project Structure

```text
app/
  (tabs)/             Main application screens

components/           Reusable UI components

src/
  api/                Trading signal calculations
  context/            Authentication state
  hook/               React hooks
  services/           Supabase, market data, and notifications
  types/              Shared TypeScript definitions
```

The application separates market data retrieval, signal calculations, and UI state management to keep the implementation straightforward and maintainable.

## Technical Approach

The project intentionally uses a small, explainable SMA crossover strategy rather than a complex prediction model.

Authentication and profile persistence are handled by Supabase, while Binance provides public market data without requiring exchange account credentials.

Signal calculations run locally in the application. Notifications are generated on the device when new signals are detected.

For additional implementation details, see the technical decisions document included with the submission.

## Disclaimer

**SignalDesk is a technical demonstration, not a financial advisory application.**

Trading signals are generated using a basic technical indicator for educational and assessment purposes. They should not be interpreted as investment recommendations or guarantees of future market performance.

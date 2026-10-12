# SignalDesk — Development Approach & Roadmap

## Project Goal

SignalDesk was developed to demonstrate a complete mobile application workflow: authentication, user preferences, market data integration, explainable trading signals, and local notifications.

The initial implementation focuses on validating these core interactions rather than delivering a continuously operating trading platform.

## Development Approach

A practical development process separates the validation of application logic from external integrations.

1. **Define data contracts:** Establish the structures used by market data, trading signals, and user profiles.
2. **Validate core logic:** Use controlled datasets to verify calculations and expected outcomes independently of live market conditions.
3. **Integrate external services:** Connect real market data and authentication services while preserving established contracts.
4. **Connect application workflows:** Link user preferences, watchlists, signal generation, and notifications.
5. **Verify and extend:** Test critical scenarios, address integration failures, and identify production requirements.

This approach helps isolate problems, reduces dependencies between components, and makes future changes easier to manage.

## Current Implementation

- Email/password authentication and persistent sessions.
- Editable user profiles and risk preferences.
- Watchlist with three predefined cryptocurrency pairs.
- Live market data retrieved from Binance.
- SMA5/SMA10 crossover signals with explanations.
- Local notifications for newly observed BUY/SELL signals.
- Secure local persistence of notification state.

## From MVP to Production

| Area            | Planned Evolution                                                                                     |
| --------------- | ----------------------------------------------------------------------------------------------------- |
| Asset selection | Retrieve available trading pairs dynamically from Binance and introduce a searchable selector.        |
| Signal engine   | Add automated tests using controlled candle datasets and support additional technical indicators.     |
| Market data     | Introduce caching, retry strategies, request throttling, and improved API error handling.             |
| Notifications   | Move signal monitoring to a backend service and introduce push notifications for background delivery. |
| Testing         | Add unit, integration, and end-to-end tests covering authentication, profiles, and trading signals.   |
| Observability   | Introduce structured logging, monitoring, and operational error reporting.                            |

## Architectural Considerations

The signal calculation is independent of the selected cryptocurrency pair. Expanding the watchlist therefore primarily affects asset discovery, validation, and selection rather than the SMA algorithm.

Similarly, moving from local notifications to server-driven alerts would require a background monitoring service, but the existing signal calculation provides a foundation for that evolution.

## Guiding Principle

Build and validate the smallest complete workflow first, then extend its capabilities based on verified requirements and technical priorities.

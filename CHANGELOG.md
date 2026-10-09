# Changelog

All notable changes to this project will be documented in this file.

The format is based on Keep a Changelog (https://keepachangelog.com/en/1.1.0/),
and this project adheres to Semantic Versioning (https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Global toast host: a shared, product-wide notification surface replacing
  the old server error notifier, also used for file upload/transfer notices
  and background process notices with click-to-navigate.
- Localized menu labels.

### Changed
- Module error boundary stub replaced with a shared fallback component.
- WebSocket access-token sync now happens once at app startup instead of
  being bound in the root shell.
- Material Symbols icon font now loaded once from the shell base entry.
- Unified Ant Design drawer body padding globally (kept default padding for
  submenu drawers).

### Fixed
- Duplicate React keys in toast host notification holders.
- Toast and modal close animation events on Firefox.

## [0.1.0] - 2025-09-30

### Added
- Initial micro-frontend scaffold for the base template of the infrastructure management product.
- Shell application to compose and embed large blocks from other micro-frontends.
- User management foundation (basic auth integration hooks, session/profile handling, logout entry).
- Internationalization (i18n) setup with English and Russian locales, language detection, and translation loading.
- Global application menu integrated with routing and micro-frontend layout.
- Development and production build configuration (webpack dev server, production bundling).

### Changed
- Major localization structure and message keys updated/refactored.
- Main application navigation/menu redesigned and integrated with the base layout.


# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

Nothing yet.

## [0.0.4] - 2022-03-12

### Changed
- Get default shader canvas options from a function so we can support server side rendering where `window` is undefined

## [0.0.3] - 2022-03-08

### Added
- Add protection against buildup of updates in `LoopEngine`, for example when the browser tab is throttled while in the background

### Changed
- Use 16ms updates by default

## [0.0.2] - 2022-03-06

### Fixed
- Fix build output by reverting module type change in `package.json`

## [0.0.1] - 2022-03-06

Initial release!

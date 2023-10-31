<img src="media/cover.png" width="100%" align="center" />

<br />

<div align="center">

[![Build](https://img.shields.io/github/actions/workflow/status/koi18n/koi18n/release.yml?branch=master)](https://github.com/koi18n/koi18n/actions/workflows/release.yml)
[![Tests Coverage](https://img.shields.io/coverallsCoverage/github/koi18n/koi18n)](https://coveralls.io/github/koi18n/koi18n)
[![Language](https://img.shields.io/badge/language-TypeScript-blue.svg)](https://www.typescriptlang.org)
[![License](https://img.shields.io/github/license/koi18n/koi18n)](https://www.npmjs.com/package/@koi18n/koi18n)

</div>

<div align="center">
      <b>koi18n is a modern localization framework for Javascript. Built with the open source community and optimized for developer experience in the frameworks you love.</b>
</div>

<div align="center">
  <h4>
    <a href="https://koi18n.dev">
      Website
    </a>
    <span> • </span>
    <a href="https://koi18n.dev/docs">
      Documentation
    </a>
    <span> • </span>
    <a href="https://github.dev/koi18n/koi18n/issues">
      Issues
    </a>
    <span> • </span>
    <a href="https://koi18n.dev/docs/contributing">
      Contributing
    </a>
    <span> • </span>
    <a href="https://github.dev/koi18n/koi18n/blob/master/CHANGELOG.md">
      Changelog
    </a>
  </h4>
</div>

***

## What is koi18n?

koi18n is a developer-first open-source localization framework for JavaScript that aims to remove the pain in the localization process.

Workflow can be broken down into 3 steps:

- 1️⃣ **Development**: Start by incorporating your translation source messages into your project using our dedicated SDK. Explore our comprehensive guides for specific frameworks to get started.
- 2️⃣ **Extraction** (`pnpm koi extract`): koi18n streamlines the extraction process by automatically gathering all the messages within your project.
- 3️⃣ **Translation** (`pnpm koi translate`): Once your messages are extracted, proceed to translate them into your desired locales using the translator you've defined.

More documentation available at [https://koi18n.dev](https://koi18n.dev).

## Features

- 🚀 **Speed**: Remove the pain in the localization process. Translate your products **10x faster**.
- 🧑‍💻 **Developer-focused**: One of our main goal was improving the developer experience. No more looking for keys in your source code, no more editing localisation files, and no more manual exporting data for translators.
- 🏆 **Javascript-based**: designed to be used in any javascript-based environment with specific integrations for all major frameworks: Node, React, Next, Vite...
- 🤖 **AI Translation**: Let the machines work for you. We natively support ChatGPT, Google Translate, and AWS translate (and more to come).
- ⌨️ **CLI**: Use your terminal with the CLI.
- 🕋 **Cache**: Don’t translate the same string twice. Translation cache reuses strings you’ve already translated.
- 🌱 **Lightweight**: offer your product to your audience in the way they understand better with just a few KB.
- ✂️ **Code splitting**: Split your translation files with ease. Just import the messages your user needs to see.
- 🐙 **GIT**: Use your well-known version-control systems for storing translations.
- 💎 **TypeScript**: Full-written in TypeScript.
- ⭐️ **MIT Licensed**: Free for personal and commercial use.

## Packages

| Package | Description | Version | Size | Downloads |
| :------ | :---- |  :-----: | :--: | :-------: |
| `@koi18n/dev` | The user-facing package for koi18n | [![Version](https://img.shields.io/npm/v/@koi18n/dev.svg?logo=npm)](https://www.npmjs.com/package/@koi18n/dev) | [![Size](https://img.shields.io/bundlephobia/minzip/@koi18n/dev)](https://bundlephobia.com/result?p=@koi18n/dev) | [![NPM](https://img.shields.io/npm/dm/@koi18n/dev.svg?&logo=npm)](https://www.npmjs.com/package/@koi18n/dev) |
| `@koi18n/react` | koi18n for React.js | [![Version](https://img.shields.io/npm/v/@koi18n/react.svg?logo=npm)](https://www.npmjs.com/package/@koi18n/react) | [![Size](https://img.shields.io/bundlephobia/minzip/@koi18n/react)](https://bundlephobia.com/result?p=@koi18n/react) | [![NPM](https://img.shields.io/npm/dm/@koi18n/react.svg?&logo=npm)](https://www.npmjs.com/package/@koi18n/react) |
| `@koi18n/vite` | koi18n for Vite | [![Version](https://img.shields.io/npm/v/@koi18n/vite.svg?logo=npm)](https://www.npmjs.com/package/@koi18n/vite) | [![Size](https://img.shields.io/bundlephobia/minzip/@koi18n/vite)](https://bundlephobia.com/result?p=@koi18n/vite) | [![NPM](https://img.shields.io/npm/dm/@koi18n/vite.svg?&logo=npm)](https://www.npmjs.com/package/@koi18n/vite) |
| `@koi18n/next` | koi18n for Next.js | [![Version](https://img.shields.io/npm/v/@koi18n/next.svg?logo=npm)](https://www.npmjs.com/package/@koi18n/next) | [![Size](https://img.shields.io/bundlephobia/minzip/@koi18n/next)](https://bundlephobia.com/result?p=@koi18n/next) | [![NPM](https://img.shields.io/npm/dm/@koi18n/next.svg?&logo=npm)](https://www.npmjs.com/package/@koi18n/next) |
| `@koi18n/node` | koi18n for Node.js | [![Version](https://img.shields.io/npm/v/@koi18n/node.svg?logo=npm)](https://www.npmjs.com/package/@koi18n/node) | [![Size](https://img.shields.io/bundlephobia/minzip/@koi18n/node)](https://bundlephobia.com/result?p=@koi18n/node) | [![NPM](https://img.shields.io/npm/dm/@koi18n/node.svg?&logo=npm)](https://www.npmjs.com/package/@koi18n/node) |

## Activity

![Alt](https://repobeats.axiom.co/api/embed/ae01883d171ad206316b28b61099419430155550.svg "Repobeats analytics image")

## Getting Started

Visit <a aria-label="koi18n learn" href="https://koi18n.dev/learn">https://koi18n.dev/learn</a> to get started with koi18n.

## Documentation

Visit [https://koi18n.dev/docs](https://koi18n.dev/docs) to view the full documentation.

## Community

The koi18n community can be found on [GitHub Discussions](https://github.com/koi18n/koi18n/discussions), where you can ask questions, voice ideas, and share your projects.

Our [Code of Conduct](https://github.com/koi18n/koi18n/blob/master/CODE_OF_CONDUCT.md) applies to all koi18n community channels.

## Contributing

Please see our [contributing.md](/contributing.md).

### Good First Issues

We have a list of [good first issues](https://github.com/koi18n/koi18n/labels/good%20first%20issue) that contain bugs that have a relatively limited scope. This is a great place to get started, gain experience, and get familiar with our contribution process.

## Authors

- Hugo Corta ([@hugocxl](https://github.com/hugocxl))

## License

MIT License © 2023-Present [Hugo Corta](https://github.com/hugocxl)

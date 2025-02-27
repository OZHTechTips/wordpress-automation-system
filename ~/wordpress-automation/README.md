# WordPress Automation System

A comprehensive system for automating WordPress site creation, content generation, and management.

## Features

- Create WordPress sites with custom subdomains
- Generate content using AI (OpenAI integration)
- Manage multiple WordPress sites from a single dashboard
- Track analytics and performance
- Configure settings for content generation and publishing

## Installation

1. Clone this repository:
```bash
git clone https://github.com/yourusername/wordpress-automation-system.git
cd wordpress-automation-system
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file from the example:
```bash
cp .env.example .env
```

4. Edit the `.env` file with your API keys and configuration.

5. Start the development server:
```bash
npm run dev
```

## Server API

This project works with a companion server API for WordPress site creation. See the `server-api` directory for details.

## Building for Production

```bash
npm run build
```

## License

MIT
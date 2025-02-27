# FairPlay Football Team Manager

A simple yet powerful web application for organizing football teams with balanced player distribution based on skill ratings.

![FairPlay Football Team Manager](https://github.com/imluth/FairPlay-football-team-manager/screenshot.png)

## Features

- **Player Management**
  - Add players with name and skill rating (1-10)
  - Edit player ratings
  - Remove players from the database
  - Store player data locally in the browser

- **Team Generation**
  - Automatically create balanced teams based on player ratings
  - Customize number of teams (2-8)
  - Adjust players per team (1-11)
  - Regenerate teams for different combinations

- **Match Settings**
  - Set match day, time, and venue
  - Generate shareable team lists with emojis
  - Copy team lists to clipboard for easy sharing

## Technology Stack

- **Framework**: Next.js
- **UI**: React with shadcn/ui components
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **Data Persistence**: Browser LocalStorage

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/imluth/FairPlay-football-team-manager.git
cd FairPlay-football-team-manager
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

1. **Add Players**: Enter player names and skill ratings (1-10)
2. **Select Players**: Check the boxes next to players who will participate
3. **Configure Teams**: Set the number of teams and players per team
4. **Match Details**: Enter match day, time, and ground name
5. **Generate Teams**: Click "Generate Teams" to create balanced teams
6. **Share**: Copy the generated team list to share with players

## Deployment

The application can be deployed to any static site hosting service:

```bash
npm run build
# or
yarn build
```

## Contributing

Contributions to FairPlay Football Team Manager are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Author

Created by [@im_root](https://looth.io/)
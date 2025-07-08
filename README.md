# Chart_race# Chart Race - Interactive Data Visualization

An interactive D3.js bar chart race visualization with customizable features, perfect for displaying competitive data over time.

## Features

- 🎯 **Interactive Animation**: Play, pause, and scrub through time periods
- 📊 **Customizable Data**: Upload your own CSV files or use sample data
- 🎨 **Visual Customization**: Custom backgrounds, logos, and colors
- 📱 **Responsive Design**: Works on desktop and mobile devices
- ⚡ **Fast Performance**: Optimized D3.js animations
- 🎮 **Keyboard Controls**: Space to play/pause, arrows to navigate
- 📤 **Export Options**: Save charts as SVG files

## Live Demo

Deploy to Vercel: [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/chart-race)

## Quick Start

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/chart-race.git
   cd chart-race
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

### Deploy to Vercel

#### Option 1: One-Click Deploy
Click the "Deploy with Vercel" button above and follow the prompts.

#### Option 2: Manual Deploy
1. **Fork this repository** to your GitHub account

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with your GitHub account
   - Click "New Project"
   - Import your forked repository

3. **Deploy**
   - Leave all settings as default
   - Click "Deploy"
   - Your site will be live in minutes!

#### Option 3: Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow the prompts
```

## File Structure

```
chart-race/
├── index.html              # Main HTML file
├── assets/
│   ├── chart.js            # Chart logic and D3.js implementation
│   ├── main.js             # Application initialization and utilities
│   └── styles.css          # Styling and responsive design
├── package.json            # Project dependencies
├── vercel.json             # Vercel deployment configuration
└── README.md               # This file
```

## Data Format

The chart expects CSV data in the following format:

```csv
Year,Organization,Value,Image
2020,TechCorp,150000,https://via.placeholder.com/40x40/0078d4/ffffff?text=TC
2020,InnovateLabs,120000,https://via.placeholder.com/40x40/00bcf2/ffffff?text=IL
2021,TechCorp,180000,https://via.placeholder.com/40x40/0078d4/ffffff?text=TC
2021,InnovateLabs,160000,https://via.placeholder.com/40x40/00bcf2/ffffff?text=IL
```

### Required Columns:
- **Year**: Time period (number)
- **Organization**: Entity name (string)
- **Value**: Numeric value to compare (number)
- **Image**: URL to organization logo/image (string, optional)

## Customization Options

### Settings Panel
- **Background Image**: Upload custom background images
- **Corner Logo**: Add your organization's logo
- **Animation Speed**: Adjust transition timing
- **CSV Upload**: Load your own data

### Keyboard Controls
- **Spacebar**: Play/pause animation
- **Left/Right Arrows**: Navigate between years
- **Home/End**: Jump to first/last year

### Code Customization
Edit `assets/chart.js` to modify:
- Colors and styling
- Animation behaviors
- Data processing logic
- Chart dimensions and layout

## Browser Compatibility

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile browsers: Responsive design

## Performance Notes

- Optimized for datasets up to 1000 data points
- Smooth 60fps animations
- Efficient D3.js rendering
- Responsive to window resizing

## API Reference

### BarChartRace Class

```javascript
const chart = new BarChartRace('#container', {
    animationDuration: 1000,  // Transition speed (ms)
    yearDuration: 3000,       // Time per year (ms)
    maxBars: 10,              // Maximum bars to show
    minBars: 5,               // Minimum bars to show
    colors: ['#0078d4', ...]  // Color palette
});
```

### Methods

- `play()`: Start animation
- `pause()`: Stop animation
- `goToYear(index)`: Jump to specific year
- `loadData(csvData)`: Load new dataset
- `setBackgroundImage(url)`: Change background
- `setCornerImage(url)`: Change corner logo
- `setAnimationSpeed(ms)`: Adjust timing

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use in your projects!

## Support

- 📧 Email: your.email@example.com
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/chart-race/issues)
- 📖 Documentation: [Wiki](https://github.com/yourusername/chart-race/wiki)

## Changelog

### v1.0.0
- Initial release
- Basic chart race functionality
- CSV upload support
- Customization options
- Responsive design
- Vercel deployment ready
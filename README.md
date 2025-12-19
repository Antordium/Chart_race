# Chart_race# Chart Race - Interactive Data Visualization

An interactive D3.js bar chart race visualization with customizable features, perfect for displaying competitive data over time.

## Features

- 🎯 **Interactive Animation**: Play, pause, and scrub through time periods
- 📊 **Customizable Data**: Upload your own CSV files or use sample data
- 💾 **Browser Memory Storage**: CSV data persists in localStorage across sessions
- 🎨 **Visual Customization**: Custom backgrounds, logos, and colors
- 📱 **Responsive Design**: Works on desktop and mobile devices
- ⚡ **Fast Performance**: Optimized D3.js animations
- 🎮 **Keyboard Controls**: Space to play/pause, arrows to navigate
- 📤 **Export Options**: Save charts as SVG files
- ✅ **CSV Validation**: Automatic error checking with helpful messages
- 🎨 **Editable Title**: Click the title to customize it

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

This project is ready to deploy to Vercel with zero configuration required!

#### Option 1: Vercel CLI (Recommended)
```bash
# Navigate to project directory
cd chart-race

# Install Vercel CLI globally (if not already installed)
npm i -g vercel

# Deploy to Vercel
vercel

# Follow the interactive prompts:
# - Set up and deploy? Yes
# - Which scope? Choose your account
# - Link to existing project? No
# - What's your project's name? chart-race (or your preferred name)
# - In which directory is your code located? ./ (press Enter)
# - Want to override settings? No

# Your site will be live in seconds!
```

#### Option 2: GitHub + Vercel Integration
1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/chart-race.git
   git push -u origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com) and sign in
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Click "Deploy" (no configuration needed!)

#### Option 3: Drag & Drop
1. Go to [vercel.com](https://vercel.com)
2. Drag and drop your project folder
3. Your site deploys automatically!

**Note**: No build step required - this is a static site that works out of the box!

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

### CSV Upload & Storage
- Upload your CSV file using the settings panel (⚙️ icon)
- Data is automatically saved to browser localStorage
- Your data persists even after closing the browser
- Download sample CSV from the settings panel to see the format
- CSV validation provides immediate feedback for formatting errors

## Customization Options

### Settings Panel
- **Background Image**: Upload custom background images
- **Corner Logo**: Add your organization's logo
- **Time Between Years**: Control pause duration between year changes (0.5s - 5s)
- **Bar Transition Speed**: Adjust how fast bars animate (0.2s - 2s)
- **Playback Modes**:
  - Normal: Standard speed (3s between years, 1s transitions)
  - Fast: Quicker playback (1s between years, 0.5s transitions)
  - Turbo: Blazing fast for quick overview (300ms between years, 200ms transitions)
- **Rapid Mode**: For dense datasets with many time periods
  - Ultra Rapid: 100ms intervals
  - Very Rapid: 200ms intervals
  - Rapid: 300ms intervals
  - Quick: 500ms intervals
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
- `setAnimationSpeed(ms)`: Set time between year changes
- `setTransitionSpeed(ms)`: Set bar animation duration
- `toggleTurboMode(enabled)`: Enable/disable turbo mode (300ms rapid playback)
- `setRapidMode(intervalMs)`: Set rapid mode for dense datasets (100-500ms)

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
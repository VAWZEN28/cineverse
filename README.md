# Cineverse - Movie Rating & Discovery Platform

A modern, responsive movie rating and discovery platform built with React, TypeScript, and Tailwind CSS. Rate movies, discover new films, and manage your personal movie collection.

## ✨ Features

### 🎯 Core Functionality

- **Star Rating System**: Rate movies from 1-10 stars with interactive star interface
- **Browse Collection**: Explore movies by genre, year, and rating filters
- **Search**: Search for movies by title, director, actors, or genre
- **Filter**: Advanced filtering by genre, year, and minimum rating
- **Profile**: Personal profile with ratings, liked movies, and statistics

### 🎬 Movie Management

- **Like Movies**: Heart movies you love
- **Bookmark Movies**: Save movies to watch later
- **Movie Details**: Detailed movie information with cast, crew, and synopsis
- **Personal Collections**: View your rated, liked, and saved movies

### 🎨 User Interface

- **Modern Design**: Beautiful, responsive design with cinematic aesthetics
- **Dark Theme**: Elegant dark theme optimized for movie viewing
- **Smooth Animations**: Smooth transitions and hover effects
- **Mobile Responsive**: Works perfectly on all device sizes

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd cineverse-front-end
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📱 How to Use

### Home Page
- **Hero Section**: Welcome to Cineverse with call-to-action buttons
- **Search Section**: Search for movies and apply filters
- **Featured Movies**: Trending movies displayed in a grid
- **Statistics**: Platform statistics and achievements

### Discover Page
- **Genre Filter**: Browse movies by genre using filter buttons
- **Movie Grid**: Responsive grid layout showing all movies
- **Sorting**: Movies sorted by rating for easy discovery

### My Lists Page
- **Tabs**: Switch between Liked Movies and Saved Movies
- **Statistics**: Overview of your movie collections
- **Empty States**: Helpful messages when collections are empty

### Profile Page
- **User Info**: Profile picture, name, and member information
- **Statistics Cards**: Total ratings, liked movies, saved movies, and average rating
- **Collections**: Tabs for My Ratings, Liked Movies, and Saved Movies
- **Settings**: Access to profile settings (placeholder)

### Movie Details Modal
- **Movie Information**: Complete movie details including synopsis, cast, and crew
- **Rating System**: Interactive 1-10 star rating system
- **Actions**: Like and bookmark movies directly from the modal
- **Community Rating**: See the overall community rating

## 🎯 Feature Details

### Star Rating System
- Click on stars to rate movies from 1-10
- Hover effects show preview of rating
- Ratings are saved to localStorage
- Personal ratings are displayed on movie cards

### Search & Filter
- **Search**: Real-time search across movie titles, directors, actors, and genres
- **Genre Filter**: Filter by specific genres (Action, Sci-Fi, Drama, etc.)
- **Year Filter**: Filter by release year
- **Rating Filter**: Filter by minimum rating (0-10)
- **Combined Filters**: Use multiple filters simultaneously

### Movie Collections
- **Liked Movies**: Movies you've hearted
- **Saved Movies**: Movies you've bookmarked for later
- **Rated Movies**: Movies you've given star ratings to
- **Persistent Storage**: All data saved in browser localStorage

### Responsive Design
- **Mobile First**: Optimized for mobile devices
- **Tablet Friendly**: Great experience on tablets
- **Desktop Optimized**: Full-featured desktop experience
- **Touch Friendly**: Optimized for touch interactions

## 🛠️ Technical Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Radix UI primitives with custom styling
- **Routing**: React Router DOM
- **State Management**: React hooks and localStorage
- **Build Tool**: Vite
- **Icons**: Lucide React
- **Animations**: Tailwind CSS animations

## 🎨 Design System

### Colors
- **Primary**: Golden cinema theme (#F59E0B)
- **Secondary**: Rich purple (#8B5CF6)
- **Accent**: Fiesta red (#EF4444)
- **Background**: Dark cinematic theme
- **Cards**: Subtle gradients and shadows

### Typography
- **Headings**: Bold, cinematic typography
- **Body**: Clean, readable text
- **Gradients**: Text gradients for emphasis

### Components
- **Cards**: Movie cards with hover effects
- **Buttons**: Gradient and outline variants
- **Modals**: Full-featured movie detail modals
- **Tabs**: Clean tab navigation
- **Forms**: Search and filter forms

## 📊 Data Management

### Local Storage
- User ratings
- Liked movies
- Bookmarked movies
- Persistent across browser sessions

### Sample Data
- 10 sample movies with complete information
- Realistic movie data including posters, cast, and descriptions
- Multiple genres and years represented

## 🔧 Customization

### Adding Movies
Edit `src/lib/movieService.ts` to add more movies to the sample data.

### Styling
Modify `src/index.css` to customize the design system colors and variables.

### Components
All UI components are in `src/components/ui/` and can be customized as needed.

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
1. Connect your repository to Vercel
2. Vercel will automatically detect the Vite configuration
3. Deploy with default settings

### Deploy to Netlify
1. Build the project: `npm run build`
2. Upload the `dist` folder to Netlify
3. Configure build settings if needed

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- **Unsplash** for movie poster images
- **Radix UI** for accessible component primitives
- **Tailwind CSS** for the utility-first CSS framework
- **Lucide** for beautiful icons

---

Made with ❤️ for movie lovers everywhere.

# Development Guide

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Modern browser for development

### Initial Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```

3. **Open in browser**
   Navigate to `http://localhost:3000`

## Development Workflow

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors automatically
- `npm run format` - Format code with Prettier
- `npm run analyze` - Analyze bundle size

### Code Quality

#### ESLint
- Configuration: `.eslintrc.js`
- Rules focus on modern JavaScript best practices
- Automatic fixing available with `npm run lint:fix`

#### Prettier
- Configuration: `.prettierrc`
- Ensures consistent code formatting
- Run with `npm run format`

### File Structure

```
src/
├── components/          # HTML components (future expansion)
├── styles/             # CSS files
│   └── main.css        # Main stylesheet
├── scripts/            # JavaScript modules
│   ├── main.js         # Main entry point
│   └── modules/        # Feature modules
│       ├── cursor.js   # Custom cursor management
│       ├── navigation.js # Navigation and scrolling
│       ├── animations.js # Scroll animations and effects
│       ├── forms.js    # Form handling and validation
│       ├── performance.js # Performance optimization
│       └── theme.js    # Theme switching and easter eggs
└── utils/              # Utility functions
    └── index.js        # Common helper functions
```

## Module Architecture

### Main Application (`main.js`)
- Coordinates all modules
- Handles initialization and cleanup
- Manages global event listeners

### Module System
Each module follows a consistent pattern:
- Constructor with initialization
- Public methods for external control
- Proper cleanup in destroy method
- Event listener management

### Module Communication
Modules communicate through the main app instance:
```javascript
const cursorModule = app.getModule('cursor');
cursorModule.setCursorStyle({ background: 'red' });
```

## Styling Guidelines

### CSS Architecture
- CSS Custom Properties for theming
- BEM-like naming conventions
- Mobile-first responsive design
- Modular organization by component

### CSS Variables
```css
:root {
  --color-primary: #0A0A0A;
  --color-accent-blue: #00D4FF;
  --spacing-md: 2rem;
  --transition-normal: 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
```

### Responsive Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## JavaScript Best Practices

### ES6+ Features
- Use `const` and `let` instead of `var`
- Arrow functions for callbacks
- Template literals for strings
- Destructuring for objects and arrays
- Async/await for promises

### Performance
- Debounce scroll and resize events
- Use Intersection Observer for scroll animations
- Lazy load images and non-critical resources
- Optimize animations with `will-change` property

### Error Handling
- Try-catch blocks for async operations
- Graceful fallbacks for unsupported features
- Console warnings for non-critical issues

## Testing

### Manual Testing Checklist
- [ ] All sections load correctly
- [ ] Navigation works on all devices
- [ ] Animations are smooth (60fps)
- [ ] Form validation works
- [ ] Theme switching functions
- [ ] Easter eggs are accessible
- [ ] Performance is acceptable

### Browser Testing
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## Performance Guidelines

### Core Web Vitals Targets
- **LCP**: < 2.5s
- **FID**: < 100ms
- **CLS**: < 0.1

### Optimization Techniques
- Image optimization and lazy loading
- CSS and JavaScript minification
- Critical CSS inlining
- Service worker for caching
- Code splitting and tree shaking

## Deployment

### Build Process
1. Run `npm run build`
2. Check `dist/` folder for output
3. Test build locally with `npm run preview`

### Deployment Options
- **Netlify**: Connect repository, set build command
- **Vercel**: Import repository, select Vite preset
- **GitHub Pages**: Use GitHub Actions for deployment
- **Traditional hosting**: Upload `dist/` contents

## Troubleshooting

### Common Issues

#### Development Server Not Starting
- Check if port 3000 is available
- Verify Node.js version (18+)
- Clear npm cache: `npm cache clean --force`

#### Build Errors
- Check for syntax errors in JavaScript
- Verify all imports are correct
- Ensure all dependencies are installed

#### Performance Issues
- Check for memory leaks in modules
- Verify animation frame rates
- Monitor network requests

### Debug Mode
Enable debug logging:
```javascript
// In browser console
window.PortfolioApp.debug = true;
```

## Contributing

### Code Style
- Follow ESLint and Prettier configurations
- Use meaningful variable and function names
- Add JSDoc comments for complex functions
- Keep functions small and focused

### Git Workflow
1. Create feature branch
2. Make changes following guidelines
3. Test thoroughly
4. Submit pull request
5. Code review and merge

### Pull Request Checklist
- [ ] Code follows style guidelines
- [ ] All tests pass
- [ ] No console errors
- [ ] Performance impact assessed
- [ ] Documentation updated

## Resources

### Documentation
- [Vite Documentation](https://vitejs.dev/)
- [ESLint Rules](https://eslint.org/docs/rules/)
- [Prettier Options](https://prettier.io/docs/en/options.html)
- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)

### Tools
- [Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [WebPageTest](https://www.webpagetest.org/)
- [Can I Use](https://caniuse.com/)

### Performance
- [Web Vitals](https://web.dev/vitals/)
- [Performance API](https://developer.mozilla.org/en-US/docs/Web/API/Performance)
- [Intersection Observer](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)

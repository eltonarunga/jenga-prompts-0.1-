# JengaPrompts Pro - AI Prompt Engineering Toolkit

A professional toolkit to build, test, and optimize prompts for any AI model (Text, Image, Video, Audio, Code).

## 🚀 Quick Start

### Prerequisites

- **Node.js** (version 18.0.0 or higher)
- **npm** (version 8.0.0 or higher)
- **Gemini API Key** ([Get one here](https://makersuite.google.com/app/apikey))

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-org/jengaprompts-pro.git
   cd jengaprompts-pro
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   # Copy the example environment file
   cp .env.example .env.local
   
   # Edit .env.local and add your API key
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to [http://localhost:5173](http://localhost:5173)

## 🔧 Development Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build the application for production |
| `npm run preview` | Preview the production build locally |
| `npm run start:dev` | Run both frontend and backend concurrently |
| `npm run lint` | Run ESLint to check code quality |
| `npm run lint:fix` | Auto-fix ESLint issues |
| `npm run test` | Run unit tests |
| `npm run type-check` | Check TypeScript types |

## 📁 Project Structure

```
jengaprompts-pro/
├── src/                    # Frontend source code
│   ├── components/         # React components
│   ├── pages/             # Page components
│   ├── hooks/             # Custom React hooks
│   ├── utils/             # Utility functions
│   └── types/             # TypeScript type definitions
├── api/                   # Backend API routes
├── public/                # Static assets
├── dist/                  # Built application
├── .env.local            # Environment variables (create this)
└── README.md             # This file
```

## 🌍 Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# Required
GEMINI_API_KEY=your_gemini_api_key_here

# Optional
NODE_ENV=development
PORT=5173
API_BASE_URL=http://localhost:3001
```

## 🛠️ Available Features

- **Multi-Modal Prompt Generation**: Text, Image, Video, Audio, and Code
- **Advanced Frameworks**: VICES (Images) and PAVCI (Video) methodologies
- **Quality Optimization**: Built-in prompt enhancement and validation
- **Multiple AI Models**: Support for Gemini, GPT, Claude, and more
- **Real-time Testing**: Live prompt testing and iteration
- **Export Options**: Save prompts in various formats

## 🚨 Troubleshooting

### Common Issues

**Port already in use:**
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9

# Or use a different port
npm run dev -- --port 3000
```

**API Key Issues:**
- Ensure your `.env.local` file is in the root directory
- Verify your Gemini API key is valid and has proper permissions
- Check that the file isn't named `.env.local.txt` (common Windows issue)

**Dependencies Issues:**
```bash
# Clear npm cache and reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

**TypeScript Errors:**
```bash
# Run type checking
npm run type-check

# Clear TypeScript cache
rm -rf .tsbuildinfo
```

### Performance Tips

- Use `npm run start:dev` for full-stack development
- Enable browser dev tools for debugging
- Use `npm run build && npm run preview` to test production builds

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Open test UI
npm run test:ui
```

## 📦 Production Deployment

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Preview locally:**
   ```bash
   npm run preview
   ```

3. **Deploy to your platform:**
   - Upload the `dist/` folder to your hosting service
   - Ensure environment variables are set on your hosting platform
   - Configure your web server to serve the SPA correctly

### Deployment Platforms

- **Vercel**: `vercel --prod`
- **Netlify**: Drag and drop `dist/` folder
- **Railway**: Connect GitHub repository
- **AWS S3**: Upload `dist/` to S3 bucket with static hosting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and test thoroughly
4. Commit your changes: `git commit -m 'Add amazing feature'`
5. Push to the branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [docs.jengaprompts.com](https://docs.jengaprompts.com)
- **Issues**: [GitHub Issues](https://github.com/your-org/jengaprompts-pro/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-org/jengaprompts-pro/discussions)
- **Email**: support@jengaprompts.com

## 🔄 Changelog

### v1.0.0
- Initial release with multi-modal prompt generation
- VICES and PAVCI framework implementation
- Gemini API integration

---

**Happy Prompting! 🎯**
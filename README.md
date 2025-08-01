# JengaPrompts Pro

A production-ready AI-powered prompt enhancement tool that transforms simple ideas into detailed, optimized prompts across multiple modalities (Text, Image, Video, Audio, Code).

## Features

### 🚀 Core Functionality
- **Multi-Modal Prompt Enhancement**: Support for Text, Image, Video, Audio, and Code prompts
- **Intelligent Modifiers**: Context-aware modifiers based on selected prompt mode
- **Flexible Output Formats**: Descriptive paragraphs, Simple JSON, or Detailed JSON
- **Real-time Enhancement**: Powered by OpenAI's GPT-4 for high-quality results

### 💾 Data Management
- **Local Storage**: Automatic saving of prompt history
- **Favorites System**: Mark and organize your best prompts
- **Search & Filter**: Find prompts by content or mode
- **Export Options**: Download prompts as text or JSON files

### 🎨 User Experience
- **Modern UI**: Clean, responsive design with Tailwind CSS
- **Real-time Feedback**: Toast notifications and loading states
- **Accessibility**: Full keyboard navigation and screen reader support
- **Mobile Responsive**: Optimized for all device sizes

### 🔒 Production Features
- **Input Validation**: Comprehensive validation with Zod
- **Error Handling**: Graceful error handling with user-friendly messages
- **Security Headers**: CORS, XSS protection, and content security
- **Performance**: Optimized API calls with timeout handling
- **Type Safety**: Full TypeScript implementation

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI primitives
- **Validation**: Zod
- **AI Integration**: OpenAI API
- **State Management**: React hooks with local storage
- **Icons**: Lucide React

## Getting Started

### Prerequisites
- Node.js 18+ 
- OpenAI API key

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd jenga-prompts-pro
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

Add your OpenAI API key to `.env.local`:
```
OPENAI_API_KEY=your_api_key_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Creating Enhanced Prompts

1. **Enter Your Idea**: Describe your concept in the "Core Prompt Idea" field
2. **Select Mode**: Choose from Text, Image, Video, Audio, or Code
3. **Configure Modifiers**: Adjust mode-specific settings (style, tone, format, etc.)
4. **Choose Output Structure**: Select how you want the enhanced prompt formatted
5. **Generate**: Click the generate button to create your enhanced prompt

### Managing Your Prompts

- **History**: View all your generated prompts in chronological order
- **Favorites**: Star prompts to save them for quick access
- **Search**: Find specific prompts using the search functionality
- **Export**: Download prompts as text or JSON files
- **Share**: Use the built-in sharing functionality

## API Reference

### POST /api

Enhance a prompt using AI.

**Request Body:**
```typescript
{
  corePromptIdea: string;
  promptMode: 'Text' | 'Image' | 'Video' | 'Audio' | 'Code';
  modifiers: {
    contentTone?: string;
    outputFormat?: string;
    style?: string;
    aspectRatio?: string;
    lighting?: string;
    framing?: string;
    cameraAngle?: string;
    detailLevel?: string;
    audioType?: string;
    vibeMood?: string;
    language?: string;
    task?: string;
  };
  outputStructure: 'Descriptive Paragraph' | 'Simple JSON' | 'Detailed JSON';
}
```

**Response:**
```typescript
{
  primaryResult: string;
  structuredJSON?: Record<string, any>;
  errorMessage?: string;
}
```

## Configuration

### Environment Variables

- `OPENAI_API_KEY`: Your OpenAI API key (required)
- `NODE_ENV`: Environment mode (development/production)

### Customization

The app is highly customizable:

- **Modifiers**: Add new modifier options in `lib/types.ts`
- **Prompt Modes**: Extend support for new content types
- **UI Theme**: Modify Tailwind configuration for custom styling
- **Storage**: Replace local storage with database integration

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your `OPENAI_API_KEY` environment variable
4. Deploy

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@jengaprompts.com or open an issue on GitHub.

## Roadmap

- [ ] User authentication and cloud sync
- [ ] Team collaboration features
- [ ] Advanced prompt templates
- [ ] Integration with popular AI tools
- [ ] Batch prompt processing
- [ ] Analytics and usage insights
- [ ] API rate limiting and usage tracking
- [ ] Custom AI model integration
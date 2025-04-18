# Minimalist NFT Hub

A modern, clean, and minimalist NFT marketplace built with React, TypeScript, and Tailwind CSS.

## Features

- Browse NFT collections
- Create and mint NFTs
- Buy and sell NFTs
- User profiles
- Wallet integration
- Clean and modern UI

## Environment Setup

This project uses different environment configurations for development and production:

- Development: Connects to a local backend at `http://localhost:5000/api`
- Production: Connects to the deployed backend at `https://napft-backend.onrender.com/api`

### Environment Files

- `.env.development`: Contains development environment variables
- `.env.production`: Contains production environment variables
- `.env`: Default fallback environment variables

### Environment Security

For security, all environment files (`.env`, `.env.development`, `.env.production`) containing sensitive information are not tracked in Git. The repository includes an `.env.example` file that shows the structure of required environment variables without actual values.

To set up your local environment:

1. Copy the example file to create your own `.env` file:
   ```bash
   cp .env.example .env
   ```

2. Fill in your actual API keys and secrets in the `.env` file.

3. Never commit your actual environment files to Git. They are already listed in `.gitignore`.

4. If you add new environment variables to your project, update the `.env.example` file (without real values) so other contributors know what variables are needed.

## Development

To start the development server:

```bash
npm install
npm run dev
```

This will use the development environment variables.

## Production

To build for production:

```bash
npm run build
```

This will use the production environment variables, including connecting to the deployed backend.

## Deployment

### Backend
The backend is deployed at:
- https://napft-backend.onrender.com

### Frontend
The frontend is deployed on Hostinger:

1. Build the project:
```bash
npm run build
```

2. Upload the contents of the `dist` folder to your Hostinger hosting account:
   - Log in to your Hostinger control panel
   - Navigate to File Manager
   - Upload the entire contents of the `dist` directory to your public_html folder

3. Important files to verify:
   - `.htaccess` - Ensures that all routes are properly handled for the SPA
   - `index.html` - The entry point for your application
   - All assets in the `assets` directory

#### Troubleshooting Hostinger Deployment
If you encounter issues with routing or API calls:

1. Verify that the `.htaccess` file was properly uploaded and is working
2. Check browser console for any CORS errors
3. Make sure your backend on Render is properly configured to accept requests from your Hostinger domain
4. If needed, add your Hostinger domain to the CORS allowed origins in your Express backend:

```javascript
// In your backend server.js or app.js
app.use(cors({
  origin: ['https://your-hostinger-domain.com', 'http://localhost:8080'],
  credentials: true
}));
```

## License

MIT

## Project info

**URL**: https://lovable.dev/projects/21b87e23-912d-44e3-b9d7-f161cf4a9a47

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/21b87e23-912d-44e3-b9d7-f161cf4a9a47) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone (https://github.com/ahmadparizaad/minimalist-nft-hub.git)

# Step 2: Navigate to the project directory.
cd minimalist-nft-hub

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with .

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/21b87e23-912d-44e3-b9d7-f161cf4a9a47) and click on Share -> Publish.

## I want to use a custom domain - is that possible?

We don't support custom domains (yet). If you want to deploy your project under your own domain then we recommend using Netlify. Visit our docs for more details: [Custom domains](https://docs.lovable.dev/tips-tricks/custom-domain/)

# Equilix - Next.js Application

This is a Next.js application for Equilix, a personal wellness and reflection space.

## Running Locally

To get started, run the development server:

1.  **Install dependencies**: `npm install`
2.  **Set up environment variables**: Create a `.env` file in the root of the project and add your Google AI API key:
    ```
    GEMINI_API_KEY=your_api_key_here
    ```
3.  **Run the app**: `npm run dev`

The application will be available at `http://localhost:9002`.

## Deployment to Vercel

To deploy your application to Vercel, follow these steps:

1.  **Push your code** to a Git repository (e.g., GitHub, GitLab).
2.  **Import your project** into Vercel from your Git repository.
3.  **Configure Environment Variables**:
    *   In your Vercel project settings, navigate to **Settings > Environment Variables**.
    *   Add a new environment variable:
        *   **Name**: `GEMINI_API_KEY`
        *   **Value**: Paste your Google AI (Gemini) API key here.
4.  **Deploy**: Vercel will automatically build and deploy your application.

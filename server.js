// This file acts as the main entry point for platforms (like Hostinger, cPanel, etc.)
// that expect a root-level 'server.js' file for Node.js applications.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const bundlePath = path.join(__dirname, 'dist', 'server.cjs');

if (fs.existsSync(bundlePath)) {
  // Import the compiled server-side bundle
  await import('./dist/server.cjs');
} else {
  console.error("=================================================================");
  console.error("ERROR: dist/server.cjs was not found!");
  console.error("Starting a dynamic build or fallback instructions server...");
  console.error("=================================================================");

  // Dynamically import express to serve a helpful setup page
  import('express').then((expressModule) => {
    const express = expressModule.default;
    const app = express();
    const port = process.env.PORT || 3000;

    app.get('*', (req, res) => {
      res.status(500).send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Deployment Setup Required | InvestorJi</title>
          <style>
            body {
              font-family: system-ui, -apple-system, sans-serif;
              background-color: #f8fafc;
              color: #1e293b;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              margin: 0;
              padding: 20px;
            }
            .card {
              background: white;
              max-width: 600px;
              width: 100%;
              padding: 40px;
              border-radius: 12px;
              box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -4px rgba(0, 0, 0, 0.05);
              border: 1px solid #e2e8f0;
            }
            h1 {
              color: #0f172a;
              font-size: 24px;
              margin-top: 0;
              margin-bottom: 12px;
              font-weight: 700;
              letter-spacing: -0.025em;
            }
            p {
              font-size: 16px;
              line-height: 1.6;
              color: #475569;
              margin-bottom: 24px;
            }
            .code-block {
              background: #f1f5f9;
              padding: 16px;
              border-radius: 8px;
              font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
              font-size: 14px;
              color: #0f172a;
              border: 1px solid #cbd5e1;
              overflow-x: auto;
              margin-bottom: 24px;
            }
            .badge {
              display: inline-block;
              background: #fef3c7;
              color: #d97706;
              font-size: 12px;
              font-weight: 600;
              padding: 4px 12px;
              border-radius: 9999px;
              margin-bottom: 16px;
            }
            .info {
              background-color: #f0f9ff;
              border-left: 4px solid #0284c7;
              padding: 16px;
              border-radius: 4px;
              font-size: 14px;
              color: #0369a1;
            }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="badge">Deploy Setup Needed</div>
            <h1>Almost there! Let's build your app</h1>
            <p>Your application code has uploaded successfully, but the compiled production bundle (<code>dist/server.cjs</code>) is missing.</p>
            
            <p><strong>To resolve this issue, please follow these steps:</strong></p>
            
            <div class="code-block">
              # 1. Access your server terminal via SSH (or local computer)<br>
              # 2. Run the install & build commands:<br>
              npm install && npm run build
            </div>

            <div class="info">
              <strong>Why did this happen?</strong><br>
              Some hosting providers (like Hostinger, cPanel, or Plesk) only install packages but don't automatically trigger the build script. By running <code>npm run build</code>, Vite and Esbuild will generate the optimized website files!
            </div>
          </div>
        </body>
        </html>
      `);
    });

    app.listen(port, () => {
      console.log(`Instructions server running on port ${port}. Open your site URL to view setup steps.`);
    });
  }).catch((err) => {
    console.error("Failed to start instructions server:", err);
    process.exit(1);
  });
}

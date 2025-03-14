# GitHub Repository Setup Instructions

This file provides instructions for setting up this repository on GitHub.

## Option 1: Using a Personal Access Token (Recommended)

1. **Create a Personal Access Token on GitHub**:
   - Go to GitHub.com → Settings → Developer settings → Personal access tokens → Generate new token
   - Select "Tokens (classic)"
   - Give it a name like "MCP Postman Setup"
   - Select scopes: `repo`, `workflow`, `delete_repo` (if needed)
   - Generate the token and copy it immediately

2. **Configure Git with Your Token**:
   ```bash
   git remote set-url origin https://freebeiro:<YOUR_TOKEN>@github.com/freebeiro/mcp-postman.git
   ```
   Replace `<YOUR_TOKEN>` with the token you generated.

3. **Push Your Code**:
   ```bash
   git push -u origin main
   ```

## Option 2: Using SSH Authentication

If you have SSH keys configured with GitHub:

1. **Change the Remote URL**:
   ```bash
   git remote set-url origin git@github.com:freebeiro/mcp-postman.git
   ```

2. **Push Your Code**:
   ```bash
   git push -u origin main
   ```

## Option 3: Manual Upload

If the above options don't work, you can:

1. **Create a Repository** at https://github.com/new
   - Name: mcp-postman
   - Description: A Model Context Protocol (MCP) server built with Cloudflare Workers
   - Set to Public or Private as preferred
   - Do NOT initialize with README, .gitignore, or license

2. **Clone the Empty Repository**:
   ```bash
   git clone https://github.com/freebeiro/mcp-postman.git new-mcp-postman
   cd new-mcp-postman
   ```

3. **Copy Files** from this project to the new directory (excluding .git folder)

4. **Commit and Push**:
   ```bash
   git add .
   git commit -m "Initial commit"
   git push -u origin main
   ```

## Using the Bundle

A git bundle file (`mcp-postman.bundle`) has been created that contains all commits. To use it:

1. **On a new machine**:
   ```bash
   git clone mcp-postman.bundle mcp-postman-from-bundle
   cd mcp-postman-from-bundle
   git remote set-url origin https://github.com/freebeiro/mcp-postman.git
   git push -u origin main
   ```

## After Successfully Pushing to GitHub

Remember to:

1. Update the `.env` file with your actual Cloudflare API token
2. Run `npm install` to install dependencies
3. Run `npx workers-mcp setup` if starting with a fresh clone 
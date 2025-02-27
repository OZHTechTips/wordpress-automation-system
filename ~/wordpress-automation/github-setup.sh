#!/bin/bash

# This script helps set up and push to a GitHub repository
# Usage: ./github-setup.sh <github_username> <repository_name>

# Exit on error
set -e

if [ "$#" -ne 2 ]; then
    echo "Usage: $0 <github_username> <repository_name>"
    echo "Example: $0 johndoe wordpress-automation-system"
    exit 1
fi

GITHUB_USERNAME=$1
REPO_NAME=$2

echo "Setting up GitHub repository for $REPO_NAME..."

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "Git is not installed. Installing git..."
    sudo apt update
    sudo apt install -y git
fi

# Check if repository already exists
if [ -d .git ]; then
    echo "Git repository already initialized."
else
    echo "Initializing git repository..."
    git init
    git add .
    git commit -m "Initial commit for WordPress Automation System"
fi

# Configure git if needed
if [ -z "$(git config --get user.name)" ]; then
    echo "Please enter your name for git configuration:"
    read GIT_NAME
    git config --global user.name "$GIT_NAME"
fi

if [ -z "$(git config --get user.email)" ]; then
    echo "Please enter your email for git configuration:"
    read GIT_EMAIL
    git config --global user.email "$GIT_EMAIL"
fi

# Create GitHub repository (requires GitHub CLI or manual creation)
echo "Please create a new repository on GitHub:"
echo "1. Go to https://github.com/new"
echo "2. Enter repository name: $REPO_NAME"
echo "3. Choose public or private"
echo "4. Do NOT initialize with README, .gitignore, or license"
echo "5. Click 'Create repository'"
echo ""
echo "Press Enter when you've created the repository..."
read

# Add GitHub remote
echo "Adding GitHub remote..."
git remote add origin "https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"

# Push to GitHub
echo "Pushing to GitHub..."
git push -u origin master || git push -u origin main

echo "Repository successfully pushed to GitHub!"
echo "Your repository is available at: https://github.com/$GITHUB_USERNAME/$REPO_NAME"
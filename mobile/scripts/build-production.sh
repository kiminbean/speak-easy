#!/bin/bash
set -e

echo "🚀 SpeakEasy Production Build Script"
echo "======================================"

cd "$(dirname "$0")/.."

if ! command -v eas &> /dev/null; then
    echo "❌ EAS CLI not found. Installing..."
    npm install -g eas-cli
fi

echo ""
echo "📋 Checking EAS login status..."
if ! eas whoami &> /dev/null; then
    echo "🔐 Please login to your Expo account:"
    eas login
fi

echo ""
echo "🔗 Checking project configuration..."
if grep -q "your-project-id" app.json; then
    echo "⚙️  Initializing EAS project..."
    eas init
fi

echo ""
echo "📱 Select build platform:"
echo "  1) iOS only"
echo "  2) Android only"
echo "  3) Both platforms"
read -p "Enter choice (1-3): " choice

case $choice in
    1)
        echo ""
        echo "🍎 Building for iOS..."
        eas build --platform ios --profile production
        ;;
    2)
        echo ""
        echo "🤖 Building for Android..."
        eas build --platform android --profile production
        ;;
    3)
        echo ""
        echo "📱 Building for all platforms..."
        eas build --platform all --profile production
        ;;
    *)
        echo "❌ Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "✅ Build submitted! Check status at: https://expo.dev"

#!/bin/bash
# AstroCare macOS DMG Packaging Helper
# Requires 'create-dmg' utility: brew install create-dmg

set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
APP_PATH="$SCRIPT_DIR/AstroCare.app"
DMG_PATH="$SCRIPT_DIR/AstroCare-2.0.0.dmg"

if ! command -v create-dmg &> /dev/null; then
    echo "Using hdiutil to create standard macOS disk image..."
    hdiutil create -volname "AstroCare" -srcfolder "$APP_PATH" -ov -format UDZO "$DMG_PATH"
else
    echo "Creating styled DMG using create-dmg..."
    create-dmg \
      --volname "AstroCare Installer" \
      --window-pos 200 120 \
      --window-size 600 400 \
      --icon-size 100 \
      --icon "AstroCare.app" 175 120 \
      --hide-extension "AstroCare.app" \
      --app-drop-link 425 120 \
      "$DMG_PATH" \
      "$APP_PATH"
fi

echo "✅ DMG generated successfully: $DMG_PATH"

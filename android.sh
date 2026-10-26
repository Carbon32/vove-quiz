#!/bin/bash

set -e

if [ ! -d "android" ]; then
    echo "Adding Android platform."
    npx cap add android
fi

echo "Building web application."
npm run build

echo "Syncing Android project."
npx cap sync android

echo "Compiling debug APK."
cd android

if [[ "$OSTYPE" == msys* || "$OSTYPE" == cygwin* || "$OSTYPE" == win32* ]]; then
    ./gradlew.bat clean
    ./gradlew.bat assembleDebug
else # For Linux
    chmod +x ./gradlew
    ./gradlew clean
    ./gradlew assembleDebug
fi

echo "Build completed successfully"
echo "APK: android/app/build/outputs/apk/debug/app-debug.apk"

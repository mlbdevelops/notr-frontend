#!/data/data/com.termux/files/usr/bin/bash
# Termux script to set Capacitor Android splash screen with black background + existing logo

APP_DIR="android/app/src/main/res"
SPLASH_LOGO="splash.png"  # Your logo already in drawable

# --- CREATE launch_background.xml ---
echo "[1/3] Creating launch_background.xml..."
cat > $APP_DIR/drawable/launch_background.xml <<EOL
<layer-list xmlns:android="http://schemas.android.com/apk/res/android">
    <!-- Solid black background -->
    <item android:drawable="@color/splash_background" />

    <!-- Foreground splash logo -->
    <item>
        <bitmap
            android:gravity="center"
            android:src="@drawable/${SPLASH_LOGO%.*}" />
    </item>
</layer-list>
EOL

# --- UPDATE colors.xml ---
echo "[2/3] Updating colors.xml..."
COLORS_FILE="$APP_DIR/values/colors.xml"
if ! grep -q "splash_background" $COLORS_FILE; then
    sed -i '/<resources>/a \    <color name="splash_background">#000000</color>' $COLORS_FILE
fi

# --- UPDATE capacitor.config.json ---
echo "[3/3] Updating capacitor.config.json..."
CONFIG_FILE="capacitor.config.json"
jq '.plugins.SplashScreen.backgroundColor="#000000" | .plugins.SplashScreen.androidScaleType="CENTER" | .plugins.SplashScreen.showSpinner=false' $CONFIG_FILE > tmp.json && mv tmp.json $CONFIG_FILE

echo "✅ Black splash screen setup complete!"
echo " - Logo: $SPLASH_LOGO"
echo " - Background: black"
echo " - Status bar: black (use light icons)"

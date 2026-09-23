import React from 'react';
import { View, Text, StyleSheet, Platform, Image } from 'react-native';

const RAZORPAY_SVG_DATA_URI = `data:image/svg+xml;utf8,` + encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 24" fill="none">
  <path d="M3 22.5756L4.57044 16.7193L13.9519 10.6624L10.7718 22.5756H3Z" fill="#0C2340"/>
  <path d="M9.71749 12.3339L10.7149 8.66299L21 2L15.4844 22.5753L11.6926 22.5722L15.4262 8.64209L9.71749 12.3339Z" fill="#2B85FF"/>
  <text x="25" y="18.5" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="800" font-size="14" fill="#0C2340" letter-spacing="-0.3">Razorpay</text>
</svg>
`);

const RAZORPAY_GLYPH_ONLY_DATA_URI = `data:image/svg+xml;utf8,` + encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
  <path d="M3 22.5756L4.57044 16.7193L13.9519 10.6624L10.7718 22.5756H3Z" fill="#0C2340"/>
  <path d="M9.71749 12.3339L10.7149 8.66299L21 2L15.4844 22.5753L11.6926 22.5722L15.4262 8.64209L9.71749 12.3339Z" fill="#2B85FF"/>
</svg>
`);

export default function RazorpayLogo({ showText = true, width = 78, height = 18 }) {
  if (Platform.OS === 'web') {
    return (
      <div style={{ display: 'inline-flex', alignItems: 'center' }}>
        <svg
          width={showText ? width : 18}
          height={height}
          viewBox={showText ? '0 0 100 24' : '0 0 24 24'}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Left Dark Navy Polygon */}
          <path
            d="M3 22.5756L4.57044 16.7193L13.9519 10.6624L10.7718 22.5756H3Z"
            fill="#0C2340"
          />
          {/* Right Vibrant Blue Blade / Polygon */}
          <path
            d="M9.71749 12.3339L10.7149 8.66299L21 2L15.4844 22.5753L11.6926 22.5722L15.4262 8.64209L9.71749 12.3339Z"
            fill="#2B85FF"
          />
          {showText && (
            <text
              x="25"
              y="18.5"
              fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
              fontWeight="800"
              fontSize="14"
              fill="#0C2340"
              letterSpacing="-0.3"
            >
              Razorpay
            </text>
          )}
        </svg>
      </div>
    );
  }

  // Native Image fallback with vector data URI
  return (
    <Image
      source={{ uri: showText ? RAZORPAY_SVG_DATA_URI : RAZORPAY_GLYPH_ONLY_DATA_URI }}
      style={{ width: showText ? width : 18, height }}
      resizeMode="contain"
    />
  );
}

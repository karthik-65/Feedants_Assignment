import React from 'react';
import { View, Platform, Image } from 'react-native';

const MEGAPHONE_SVG_DATA_URI = `data:image/svg+xml;utf8,` + encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 34 34" fill="none">
  <!-- Rounded back chamber -->
  <rect x="5.5" y="10" width="7" height="9" rx="3.5" stroke="#2EC4B6" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- Main flared megaphone body -->
  <path d="M12.5 11.5L24 7.5V21.5L12.5 17.5" stroke="#2EC4B6" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- Front opening oval -->
  <ellipse cx="24" cy="14.5" rx="2" ry="7" stroke="#2EC4B6" stroke-width="2.4"/>
  <!-- Small back knob -->
  <path d="M25.5 13.5C26.5 13.8 27 14.2 27 14.5C27 14.8 26.5 15.2 25.5 15.5" stroke="#2EC4B6" stroke-width="2.4" stroke-linecap="round"/>
  <!-- Handle -->
  <path d="M10 19V24C10 25.5 11.5 26.5 13 26.5C14.5 26.5 15.5 25.5 15.5 24V18" stroke="#2EC4B6" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`);

export default function MegaphoneIcon({ size = 32 }) {
  if (Platform.OS === 'web') {
    return (
      <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox="0 0 34 34"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Rounded back chamber */}
          <rect
            x="5.5"
            y="10"
            width="7"
            height="9"
            rx="3.5"
            stroke="#2EC4B6"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Main flared cone */}
          <path
            d="M12.5 11.5L24 7.5V21.5L12.5 17.5"
            stroke="#2EC4B6"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Front opening oval */}
          <ellipse cx="24" cy="14.5" rx="2" ry="7" stroke="#2EC4B6" strokeWidth="2.4" />
          {/* Small back knob */}
          <path
            d="M25.5 13.5C26.5 13.8 27 14.2 27 14.5C27 14.8 26.5 15.2 25.5 15.5"
            stroke="#2EC4B6"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          {/* Handle */}
          <path
            d="M10 19V24C10 25.5 11.5 26.5 13 26.5C14.5 26.5 15.5 25.5 15.5 24V18"
            stroke="#2EC4B6"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    );
  }

  return (
    <Image
      source={{ uri: MEGAPHONE_SVG_DATA_URI }}
      style={{ width: size, height: size }}
      resizeMode="contain"
    />
  );
}

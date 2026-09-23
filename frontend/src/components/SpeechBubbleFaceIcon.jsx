import React from 'react';
import { View, Platform, Image } from 'react-native';

const SPEECH_BUBBLE_SVG_DATA_URI = `data:image/svg+xml;utf8,` + encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none">
  <!-- Speech bubble with tail -->
  <path
    d="M7 6C4.79 6 3 7.79 3 10V15C3 17.21 4.79 19 7 19H8.5V23L13 19H21C23.21 19 25 17.21 25 15V10C25 7.79 23.21 6 21 6H7Z"
    fill="none"
    stroke="#0B192C"
    stroke-width="2.2"
    stroke-linecap="round"
    stroke-linejoin="round"
  />
  <!-- Two eye dots inside bubble -->
  <circle cx="10" cy="12.5" r="1.6" fill="#0B192C"/>
  <circle cx="17.5" cy="12.5" r="1.6" fill="#0B192C"/>
</svg>
`);

export default function SpeechBubbleFaceIcon({ size = 24 }) {
  if (Platform.OS === 'web') {
    return (
      <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox="0 0 28 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Speech bubble with tail */}
          <path
            d="M7 6C4.79 6 3 7.79 3 10V15C3 17.21 4.79 19 7 19H8.5V23L13 19H21C23.21 19 25 17.21 25 15V10C25 7.79 23.21 6 21 6H7Z"
            fill="none"
            stroke="#0B192C"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Two dots inside bubble */}
          <circle cx="10" cy="12.5" r="1.6" fill="#0B192C" />
          <circle cx="17.5" cy="12.5" r="1.6" fill="#0B192C" />
        </svg>
      </div>
    );
  }

  return (
    <Image
      source={{ uri: SPEECH_BUBBLE_SVG_DATA_URI }}
      style={{ width: size, height: size }}
      resizeMode="contain"
    />
  );
}

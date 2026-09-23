import React from 'react';
import { View, Platform, Image } from 'react-native';

const SHIELD_CHECK_SVG_DATA_URI = `data:image/svg+xml;utf8,` + encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
  <path d="M12 2.2L4.5 5.2V11.5C4.5 16.5 7.8 21.1 12 22C16.2 21.1 19.5 16.5 19.5 11.5V5.2L12 2.2Z" fill="#F0F4F8" stroke="#0B192C" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M8.5 11.8L10.8 14.2L15.5 9.5" stroke="#0B192C" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`);

export default function ShieldCheckIcon({ size = 16 }) {
  if (Platform.OS === 'web') {
    return (
      <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Shield outline with soft fill */}
          <path
            d="M12 2.2L4.5 5.2V11.5C4.5 16.5 7.8 21.1 12 22C16.2 21.1 19.5 16.5 19.5 11.5V5.2L12 2.2Z"
            fill="#F0F4F8"
            stroke="#0B192C"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Bold dark navy checkmark inside */}
          <path
            d="M8.5 11.8L10.8 14.2L15.5 9.5"
            stroke="#0B192C"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    );
  }

  return (
    <Image
      source={{ uri: SHIELD_CHECK_SVG_DATA_URI }}
      style={{ width: size, height: size }}
      resizeMode="contain"
    />
  );
}

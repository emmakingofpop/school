'use client';

import { getAnalytics, isSupported } from 'firebase/analytics';
import { app } from './firebase';

export const initAnalytics = async () => {
  if (typeof window !== 'undefined') {
    const supported = await isSupported();
    if (supported) {
      const analytics = getAnalytics(app);
      console.log('✅ Firebase Analytics initialized');
      return analytics;
    } else {
      console.log('❌ Firebase Analytics not supported');
    }
  }
  return null;
};

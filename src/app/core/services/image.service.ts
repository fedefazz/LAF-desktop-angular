import { Injectable } from '@angular/core';
import { IMAGES } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  
  /**
   * Get the main company logo
   */
  getMainLogo(): string {
    return IMAGES.LOGO_MAIN;
  }

  /**
   * Get the short version of the company logo
   */
  getShortLogo(): string {
    return IMAGES.LOGO_SHORT;
  }

  /**
   * Get the alternative company logo
   */
  getAltLogo(): string {
    return IMAGES.LOGO_ALT;
  }

  /**
   * Get a company-specific logo by name
   */
  getCompanyLogo(company: 'bolsapel' | 'daily' | 'kaltura' | 'youtube'): string {
    const logoMap = {
      bolsapel: IMAGES.LOGOS.BOLSAPEL,
      daily: IMAGES.LOGOS.DAILY,
      kaltura: IMAGES.LOGOS.KALTURA,
      youtube: IMAGES.LOGOS.YOUTUBE
    };
    
    return logoMap[company] || IMAGES.LOGO_MAIN;
  }

  /**
   * Get a placeholder image by type
   */
  getPlaceholder(type: 'user' | 'picture' | 'favicon' | 'logo-short' | 'logo-old' | 'logo-short-old'): string {
    const placeholderMap = {
      user: IMAGES.PLACEHOLDERS.USER,
      picture: IMAGES.PLACEHOLDERS.PICTURE,
      favicon: IMAGES.PLACEHOLDERS.FAVICON,
      'logo-short': IMAGES.PLACEHOLDERS.LOGO_SHORT,
      'logo-old': IMAGES.PLACEHOLDERS.LOGO_OLD,
      'logo-short-old': IMAGES.PLACEHOLDERS.LOGO_SHORT_OLD
    };
    
    return placeholderMap[type] || IMAGES.PLACEHOLDERS.PICTURE;
  }

  /**
   * Get a background image
   */
  getBackgroundImage(format: 'jpg' | 'png' = 'jpg'): string {
    return format === 'jpg' ? IMAGES.BACKGROUND_JPG : IMAGES.BACKGROUND_PNG;
  }

  /**
   * Check if an image exists (basic URL validation)
   */
  isValidImagePath(path: string): boolean {
    return path.startsWith('assets/images/') && 
           (path.includes('.png') || path.includes('.jpg') || path.includes('.jpeg') || path.includes('.gif') || path.includes('.svg'));
  }

  /**
   * Get user avatar placeholder with initials
   */
  getUserAvatar(userName?: string): string {
    // Use the default user placeholder from the original project
    return this.getPlaceholder('user');
  }

  /**
   * Get avatar URL with fallback logic
   * @param profileImagePath - The profile image path from the API
   * @param apiBaseUrl - The base URL of the API
   * @returns The complete avatar URL or default placeholder
   */
  getAvatarUrl(profileImagePath?: string | null, apiBaseUrl?: string): string {
    console.log('getAvatarUrl - profileImagePath:', profileImagePath);
    console.log('getAvatarUrl - apiBaseUrl:', apiBaseUrl);
    
    if (!profileImagePath) {
      console.log('getAvatarUrl - No profileImagePath, returning placeholder');
      return IMAGES.PLACEHOLDERS.USER;
    }

    // Si es una URL completa, usarla tal como está
    if (profileImagePath.startsWith('http')) {
      console.log('getAvatarUrl - Full URL detected, returning as-is:', profileImagePath);
      return profileImagePath;
    }

    // Limpiar la ruta si empieza con barra
    const cleanPath = profileImagePath.startsWith('/') ? profileImagePath.substring(1) : profileImagePath;
    
    // Si es una ruta relativa y tenemos baseUrl, construir la URL completa
    if (apiBaseUrl) {
      const fullUrl = `${apiBaseUrl}/${cleanPath}`;
      console.log('getAvatarUrl - Constructed URL:', fullUrl);
      return fullUrl;
    }

    // Fallback al placeholder por defecto
    console.log('getAvatarUrl - No apiBaseUrl, returning placeholder');
    return IMAGES.PLACEHOLDERS.USER;
  }

  /**
   * Check if avatar should use placeholder (is default user.png)
   */
  isDefaultAvatar(avatarUrl?: string): boolean {
    return !avatarUrl || avatarUrl === IMAGES.PLACEHOLDERS.USER;
  }
}

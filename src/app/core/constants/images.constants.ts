export const IMAGES = {
  // Logos principales
  LOGO_MAIN: 'assets/images/logo.png',
  LOGO_SHORT: 'assets/images/logo-short.png',
  LOGO_ALT: 'assets/images/_logo.png',
  LOGO_BOLSAPEL: 'assets/images/logo/bolsapel.png',
  LOGO_HORIZONTAL: 'assets/images/logo/logohorizontal.png',
  ISOLOGO: 'assets/images/logo/isologo.png',
  
  // Fondos
  BACKGROUND_JPG: 'assets/images/bg.jpg',
  BACKGROUND_PNG: 'assets/images/bg.png',
  
  // Logos de empresas
  LOGOS: {
    BOLSAPEL: 'assets/images/logo/bolsapel.png',
    DAILY: 'assets/images/logo/daily.png',
    KALTURA: 'assets/images/logo/kaltura.png',
    YOUTUBE: 'assets/images/logo/youtube.png'
  },
  
  // Placeholders e iconos
  PLACEHOLDERS: {
    USER: 'assets/images/placeholders/user.png',
    PICTURE: 'assets/images/placeholders/picture.png',
    FAVICON: 'assets/images/placeholders/favicon.png',
    LOGO_SHORT: 'assets/images/placeholders/logo-short.png',
    LOGO_OLD: 'assets/images/placeholders/logo_old.png',
    LOGO_SHORT_OLD: 'assets/images/placeholders/logo-short_old.png'
  }
} as const;

export type ImagePaths = typeof IMAGES;

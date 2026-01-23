/**
 * Утилиты для шаринга в социальных сетях
 */

/**
 * Получить URL для шаринга в Telegram
 */
export function getTelegramShareUrl(url: string, text: string): string {
  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(text);
  return `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`;
}

/**
 * Получить URL для шаринга в WhatsApp
 */
export function getWhatsAppShareUrl(url: string, text: string): string {
  const fullText = `${text} ${url}`;
  const encodedText = encodeURIComponent(fullText);
  return `https://wa.me/?text=${encodedText}`;
}

/**
 * Получить URL для шаринга в VK
 */
export function getVKShareUrl(url: string, title: string, image?: string): string {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  let shareUrl = `https://vk.com/share.php?url=${encodedUrl}&title=${encodedTitle}`;

  if (image) {
    const encodedImage = encodeURIComponent(image);
    shareUrl += `&image=${encodedImage}`;
  }

  return shareUrl;
}

/**
 * Скопировать текст в буфер обмена
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback для старых браузеров
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.select();

      try {
        document.execCommand('copy');
        document.body.removeChild(textArea);
        return true;
      } catch (err) {
        document.body.removeChild(textArea);
        return false;
      }
    }
  } catch (err) {
    console.error('Failed to copy to clipboard:', err);
    return false;
  }
}

/**
 * Проверить доступность нативного share API
 */
export function canUseNativeShare(): boolean {
  return typeof navigator !== 'undefined' && 'share' in navigator;
}

/**
 * Использовать нативный share API (для мобильных устройств)
 */
export async function shareViaNavigator(data: {
  url: string;
  title: string;
  text?: string;
}): Promise<void> {
  if (!canUseNativeShare()) {
    throw new Error('Native share API is not available');
  }

  try {
    await navigator.share({
      title: data.title,
      text: data.text || '',
      url: data.url,
    });
  } catch (err) {
    // User cancelled or error occurred
    console.warn('Share cancelled or failed:', err);
    throw err;
  }
}

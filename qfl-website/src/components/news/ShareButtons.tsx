'use client';

import { useState } from 'react';
import { Share2, Link as LinkIcon, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import {
  getTelegramShareUrl,
  getWhatsAppShareUrl,
  copyToClipboard,
  canUseNativeShare,
  shareViaNavigator,
} from '@/lib/utils/share';

interface ShareButtonsProps {
  url: string;
  title: string;
  description?: string;
  className?: string;
}

export function ShareButtons({ url, title, description, className = '' }: ShareButtonsProps) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    const success = await copyToClipboard(url);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleNativeShare = async () => {
    try {
      await shareViaNavigator({
        url,
        title,
        text: description,
      });
    } catch (err) {
      // User cancelled or error
      console.warn('Share cancelled');
    }
  };

  const shareButtons = [
    {
      name: 'Telegram',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.693-1.653-1.124-2.678-1.8-1.185-.781-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.015-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.329-.913.489-1.302.481-.428-.008-1.252-.241-1.865-.44-.752-.244-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.477-1.635.099-.002.321.023.465.141.122.098.155.23.171.324.016.093.036.305.02.471z" />
        </svg>
      ),
      href: getTelegramShareUrl(url, title),
      color: 'bg-[#0088cc] hover:bg-[#0077b3]',
    },
    {
      name: 'WhatsApp',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
      ),
      href: getWhatsAppShareUrl(url, title),
      color: 'bg-[#25D366] hover:bg-[#20bd5a]',
    },
  ];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <span className="text-sm font-medium text-gray-600 dark:text-slate-400">
        {t('news.share', 'Поделиться')}:
      </span>

      <div className="flex items-center gap-2">
        {/* Native Share (Mobile) */}
        {canUseNativeShare() && (
          <motion.button
            onClick={handleNativeShare}
            className="p-2 rounded-lg bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300"
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(229, 231, 235, 1)' }}
            whileTap={{ scale: 0.95 }}
            aria-label={t('news.share', 'Поделиться')}
          >
            <Share2 className="w-5 h-5" />
          </motion.button>
        )}

        {/* Social Media Buttons */}
        {shareButtons.map((button) => (
          <motion.a
            key={button.name}
            href={button.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`p-2 rounded-lg text-white ${button.color.split(' ')[0]}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label={`${t('news.share', 'Поделиться')} ${button.name}`}
          >
            {button.icon}
          </motion.a>
        ))}

        {/* Copy Link Button */}
        <motion.button
          onClick={handleCopyLink}
          className="p-2 rounded-lg bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 relative"
          whileHover={{ scale: 1.05, backgroundColor: 'rgba(229, 231, 235, 1)' }}
          whileTap={{ scale: 0.95 }}
          aria-label={t('news.copyLink', 'Скопировать ссылку')}
        >
          <AnimatePresence mode="wait">
            {copied ? (
              <motion.div
                key="check"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
              </motion.div>
            ) : (
              <motion.div
                key="link"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                <LinkIcon className="w-5 h-5" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Copy Success Message */}
      <AnimatePresence>
        {copied && (
          <motion.span
            className="text-sm text-green-600 dark:text-green-400"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
          >
            {t('news.linkCopied', 'Ссылка скопирована!')}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}

'use client';

import { Download, FileText, File } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { DocumentItem } from '@/types';

interface DocumentCardProps {
  document: DocumentItem;
}

export function DocumentCard({ document }: DocumentCardProps) {
  const { t } = useTranslation('league');

  // Determine if it's a PDF
  const isPdf = document.url?.toLowerCase().endsWith('.pdf');

  return (
    <>
      <motion.div
        initial="rest"
        whileHover="hover"
        className="group bg-white dark:bg-dark-surface rounded-xl border border-gray-100 dark:border-dark-border p-5 flex items-center gap-5 hover:border-primary/20 dark:hover:border-accent-cyan/30 transition-colors"
        variants={{
          rest: {
            boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
            transition: { duration: 0.3 },
          },
          hover: {
            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
            transition: { duration: 0.3 },
          },
        }}
      >
        {/* File Type Icon */}
        <motion.div
          className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${
            isPdf ? 'bg-red-500/10' : 'bg-primary/10'
          }`}
          variants={{
            rest: { backgroundColor: isPdf ? 'rgba(239, 68, 68, 0.1)' : 'rgba(30, 77, 140, 0.1)' },
            hover: { backgroundColor: isPdf ? 'rgba(239, 68, 68, 0.2)' : 'rgba(30, 77, 140, 0.2)' },
          }}
        >
          {isPdf ? (
            <div className="relative">
              <File className="w-7 h-7 text-red-500" />
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[8px] font-bold text-red-500">PDF</span>
            </div>
          ) : (
            <FileText className="w-7 h-7 text-primary dark:text-accent-cyan" />
          )}
        </motion.div>

        {/* Document Info */}
        <div className="flex-1 min-w-0">
          <h3
            className="font-semibold text-gray-900 dark:text-white group-hover:text-primary dark:group-hover:text-accent-cyan line-clamp-2 leading-snug transition-colors"
          >
            {document.title}
          </h3>
        </div>

        {/* Download Button */}
        <motion.a
          href={document.url}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ backgroundColor: '#E5B73B', color: '#1E4D8C' }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl font-medium flex-shrink-0"
          transition={{ duration: 0.3 }}
        >
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">{t('documents.download')}</span>
        </motion.a>
      </motion.div>
    </>
  );
}

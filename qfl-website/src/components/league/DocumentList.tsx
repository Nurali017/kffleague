'use client';

import { FileText } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { DocumentCard } from './DocumentCard';
import { DocumentItem } from '@/types';
import { staggerContainer, fadeInUp } from '@/lib/motion';

interface DocumentListProps {
  documents: DocumentItem[];
}

export function DocumentList({ documents }: DocumentListProps) {
  const { t } = useTranslation('league');

  if (documents.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-12 text-center">
        <FileText className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
        <p className="text-gray-500 dark:text-gray-400">
          {t('documents.noDocuments')}
        </p>
      </div>
    );
  }

  return (
    <motion.div
      className="space-y-4"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {documents.map((doc, index) => (
        <motion.div
          key={index}
          variants={fadeInUp}
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          whileHover={{ x: 4, scale: 1.01, transition: { type: 'spring', stiffness: 400 } }}
        >
          <DocumentCard document={doc} />
        </motion.div>
      ))}
    </motion.div>
  );
}

'use client';

import { Mail, Phone, MapPin, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ContactInfoProps {
  emails: string[];
  phones?: string[];
  address?: string;
  contentText?: string;
  contactPerson?: {
    name: string;
    position: string;
  };
}

export function ContactInfo({ emails, phones, address, contentText, contactPerson }: ContactInfoProps) {
  const { t } = useTranslation('league');

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
      <h2 className="text-xl font-bold text-[#1E4D8C] dark:text-blue-400 mb-6">
        {t('contacts.contactUs')}
      </h2>

      {contentText && (
        <p className="text-gray-600 dark:text-gray-400 mb-6">{contentText}</p>
      )}

      <div className="space-y-4">
        {/* Emails */}
        {emails.map((email) => (
          <a
            key={email}
            href={`mailto:${email}`}
            className="flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:text-[#1E4D8C] dark:hover:text-blue-400 transition-colors group"
          >
            <div className="w-10 h-10 rounded-full bg-[#1E4D8C]/10 dark:bg-blue-400/10 flex items-center justify-center group-hover:bg-[#1E4D8C]/20 transition-colors">
              <Mail className="w-5 h-5 text-[#1E4D8C] dark:text-blue-400" />
            </div>
            <span>{email}</span>
          </a>
        ))}

        {/* Phones */}
        {phones?.map((phone) => (
          <a
            key={phone}
            href={`tel:${phone.replace(/\s/g, '')}`}
            className="flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:text-[#1E4D8C] dark:hover:text-blue-400 transition-colors group"
          >
            <div className="w-10 h-10 rounded-full bg-[#1E4D8C]/10 dark:bg-blue-400/10 flex items-center justify-center group-hover:bg-[#1E4D8C]/20 transition-colors">
              <Phone className="w-5 h-5 text-[#1E4D8C] dark:text-blue-400" />
            </div>
            <span>{phone}</span>
          </a>
        ))}

        {/* Address */}
        {address && (
          <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
            <div className="w-10 h-10 rounded-full bg-[#1E4D8C]/10 dark:bg-blue-400/10 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-[#1E4D8C] dark:text-blue-400" />
            </div>
            <span>{address}</span>
          </div>
        )}

        {/* Contact Person */}
        {contactPerson && (
          <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
            <div className="w-10 h-10 rounded-full bg-[#1E4D8C]/10 dark:bg-blue-400/10 flex items-center justify-center">
              <User className="w-5 h-5 text-[#1E4D8C] dark:text-blue-400" />
            </div>
            <div className="flex flex-col">
              <span className="font-medium">{contactPerson.name}</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">{contactPerson.position}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

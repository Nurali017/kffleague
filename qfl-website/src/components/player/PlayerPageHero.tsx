import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { PlayerDetail } from '@/types/player';
import { TeamDetail } from '@/types/team';
import { HeroBackground } from '@/components/ui/HeroBackground';
import { cn } from '@/lib/utils/cn';
import { PlayerPageVariant } from './playerPageVariants';

interface PlayerPageHeroProps {
  player: PlayerDetail;
  team?: TeamDetail | null;
  variant?: PlayerPageVariant;
}

function getAge(dob?: string | null) {
  if (!dob) return null;
  const birthDate = new Date(dob);
  if (Number.isNaN(birthDate.getTime())) return null;
  const ageDifMs = Date.now() - birthDate.getTime();
  const ageDate = new Date(ageDifMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

function toFlagEmoji(countryCode?: string | null) {
  if (!countryCode) return null;
  const normalizedCode = countryCode.trim().toUpperCase();
  if (!/^[A-Z]{2}$/.test(normalizedCode)) return null;
  return String.fromCodePoint(...[...normalizedCode].map((char) => 127397 + char.charCodeAt(0)));
}

export function PlayerPageHero({ player, team, variant = 'clarity' }: PlayerPageHeroProps) {
  const { t, i18n } = useTranslation('player');
  const lang = i18n.language?.substring(0, 2) === 'kz' ? 'kz' : 'ru';
  const age = getAge(player.date_of_birth);
  const dateValue = player.date_of_birth
    ? new Date(player.date_of_birth).toLocaleDateString(lang === 'kz' ? 'kk-KZ' : 'ru-RU')
    : '-';
  const country =
    player.country?.name ||
    player.nationality ||
    t('defaultCountry', { defaultValue: lang === 'kz' ? 'Қазақстан' : 'Казахстан' });
  const countryCode = player.country?.code ? String(player.country.code).toUpperCase() : null;
  const metaItems = [
    {
      label: t('dateOfBirth', { defaultValue: lang === 'kz' ? 'Туған күні' : 'Дата рождения' }),
      value: age != null
        ? `${dateValue} · ${age} ${t('years', { defaultValue: lang === 'kz' ? 'жас' : 'лет' })}`
        : dateValue,
    },
    {
      label: t('heightWeight', { defaultValue: lang === 'kz' ? 'Бой, салмақ' : 'Рост, вес' }),
      value: `${player.height ? `${player.height} см` : '-'} / ${player.weight ? `${player.weight} кг` : '-'}`,
    },
    {
      label: t('citizenship', { defaultValue: lang === 'kz' ? 'Азаматтығы' : 'Гражданство' }),
      value: country,
    },
  ];
  const birthMeta = metaItems[0];
  const citizenshipMeta = metaItems[2];
  const teamNameRaw = team?.name || player.team_name;
  const teamName = teamNameRaw?.trim()
    ? teamNameRaw
    : t('unknownTeam', { defaultValue: 'Команда' });
  const teamId = team?.id || player.team_id;
  const isStudio = variant === 'studio';
  const isData = variant === 'data';
  const countryFlagUrl = player.country?.flag_url || null;
  const countryFlagEmoji = toFlagEmoji(countryCode);

  const initials = `${player.first_name?.[0] || ''}${player.last_name?.[0] || ''}`.toUpperCase();

  if (isData) {
    return (
      <section className="w-full border-b border-slate-200 bg-white dark:border-dark-border dark:bg-dark-surface">
        <div className="mx-auto max-w-[1400px] px-4 py-6 md:px-10 md:py-8">
          <div className="mb-4">
            <Link
              href={teamId ? `/team/${teamId}` : '/teams'}
              className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:border-primary/40 hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 dark:border-dark-border dark:bg-dark-surface dark:text-slate-200 dark:hover:border-accent-cyan dark:hover:text-cyan-200 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-dark-surface md:text-sm"
            >
              <ArrowLeft className="h-4 w-4" />
              {t('backToTeam', { defaultValue: lang === 'kz' ? 'Командаға қайту' : 'Вернуться в команду' })}
            </Link>
          </div>

          <div className="grid gap-5 md:grid-cols-[220px_1fr] md:gap-8">
            <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-100 to-slate-50 dark:border-dark-border dark:from-slate-800 dark:to-slate-900">
              <div className="relative h-[220px] w-full md:h-[260px]">
                {player.photo_url ? (
                  <Image
                    src={player.photo_url}
                    alt={`${player.first_name} ${player.last_name}`}
                    fill
                    className="object-contain object-bottom"
                    sizes="(max-width: 768px) 220px, 260px"
                    priority
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <span className="text-5xl font-black text-slate-400 dark:text-slate-500">{initials}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-dark-border dark:bg-dark-surface/70 md:p-5">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-black leading-tight text-slate-900 dark:text-white md:text-4xl">
                    {player.first_name} {player.last_name}
                  </h1>
                  {player.jersey_number != null && (
                    <span className="inline-flex h-9 min-w-9 items-center justify-center rounded-full bg-primary px-3 text-sm font-black text-white dark:bg-cyan-600 md:h-10 md:text-base">
                      #{player.jersey_number}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 ring-1 ring-slate-200 dark:bg-dark-bg dark:text-slate-200 dark:ring-slate-700 md:text-sm">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    {teamName}
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 ring-1 ring-slate-200 dark:bg-dark-bg dark:text-slate-200 dark:ring-slate-700 md:text-sm">
                    {player.position || t('position', { defaultValue: 'Позиция не указана' })}
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 ring-1 ring-slate-200 dark:bg-dark-bg dark:text-slate-200 dark:ring-slate-700 md:text-sm">
                    <span>{birthMeta.label}: {birthMeta.value}</span>
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 ring-1 ring-slate-200 dark:bg-dark-bg dark:text-slate-200 dark:ring-slate-700 md:text-sm">
                    {countryFlagUrl ? (
                      <img
                        src={countryFlagUrl}
                        alt={`${country} flag`}
                        className="h-3 w-5 rounded-[2px] object-cover ring-1 ring-slate-200 dark:ring-slate-600"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : countryFlagEmoji ? (
                      <span aria-hidden className="text-sm leading-none">
                        {countryFlagEmoji}
                      </span>
                    ) : null}
                    <span>{citizenshipMeta.label}: {citizenshipMeta.value}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full overflow-hidden text-white">
      <HeroBackground />
      <div
        className={cn(
          'pointer-events-none absolute inset-0',
          isStudio
            ? 'bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.22),transparent_55%)]'
            : 'bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.14),transparent_55%)]'
        )}
      />
      <div className="relative z-10 mx-auto max-w-[1400px] px-4 py-6 md:px-10 md:py-8 lg:py-10">
        <div className="mb-5">
          <Link
            href={teamId ? `/team/${teamId}` : '/teams'}
            className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-2 text-sm font-semibold text-white/90 transition-colors hover:bg-white/25 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('backToTeam', { defaultValue: lang === 'kz' ? 'Командаға қайту' : 'Вернуться в команду' })}
          </Link>
        </div>

        <div
          className="grid items-end gap-6 rounded-3xl px-4 py-5 md:grid-cols-[1fr_auto] md:px-8 md:py-7"
        >
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-black leading-tight md:text-5xl">
                {player.first_name} {player.last_name}
              </h1>
              {player.jersey_number != null && (
                <span className="inline-flex h-10 min-w-10 items-center justify-center rounded-full bg-white px-3 text-base font-black text-primary">
                  #{player.jersey_number}
                </span>
              )}
            </div>

            <div className="mb-5 flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold ring-1 ring-white/20 md:text-sm">
                <span className="h-2 w-2 rounded-full bg-emerald-300" />
                {teamName}
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold ring-1 ring-white/20 md:text-sm">
                {player.position || t('position', { defaultValue: 'Позиция не указана' })}
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold ring-1 ring-white/20 md:text-sm">
                <span>{birthMeta.label}: {birthMeta.value}</span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold ring-1 ring-white/20 md:text-sm">
                {countryFlagUrl ? (
                  <img
                    src={countryFlagUrl}
                    alt={`${country} flag`}
                    className="h-3 w-5 rounded-[2px] object-cover ring-1 ring-white/20"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : countryFlagEmoji ? (
                  <span aria-hidden className="text-sm leading-none">
                    {countryFlagEmoji}
                  </span>
                ) : null}
                <span>{citizenshipMeta.label}: {citizenshipMeta.value}</span>
              </div>
            </div>
          </div>

          <div className={cn('relative mx-auto w-[220px] md:mx-0', isStudio ? 'md:w-[320px]' : 'md:w-[280px]')}>
            <div
              className={cn(
                'absolute inset-x-4 bottom-1 h-20 rounded-full blur-2xl',
                isStudio ? 'bg-white/30' : 'bg-white/20'
              )}
            />
            <div className={cn('relative', isStudio ? 'h-[280px] md:h-[360px]' : 'h-[240px] md:h-[320px]')}>
              {player.photo_url ? (
                <Image
                  src={player.photo_url}
                  alt={`${player.first_name} ${player.last_name}`}
                  fill
                  className="object-contain object-bottom drop-shadow-2xl"
                  sizes="(max-width: 768px) 220px, 320px"
                  priority
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center rounded-2xl bg-white/15">
                  <span className="text-6xl font-black text-white/60">{initials}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import { redirect } from 'next/navigation';

/**
 * Stats landing page - redirects to teams statistics
 */
export default function StatsPage({
    searchParams,
}: {
    searchParams?: Record<string, string | string[] | undefined>;
}) {
    const params = new URLSearchParams();

    Object.entries(searchParams ?? {}).forEach(([key, value]) => {
        if (Array.isArray(value)) {
            value.forEach((v) => {
                if (v) params.append(key, v);
            });
            return;
        }
        if (value) params.set(key, value);
    });

    const query = params.toString();
    redirect(query ? `/stats/teams?${query}` : '/stats/teams');
}

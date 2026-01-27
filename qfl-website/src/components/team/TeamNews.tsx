import { MOCKED_NEWS } from '@/lib/mock/teams';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function TeamNews() {
    const featured = MOCKED_NEWS.find(n => n.is_featured) || MOCKED_NEWS[0];
    const others = MOCKED_NEWS.filter(n => n.id !== featured.id);

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-gray-900">Latest News</h2>
                <Link href="#" className="flex items-center gap-1 text-sm font-bold text-gray-500 hover:text-primary transition-colors">
                    All news <ArrowRight className="w-4 h-4" />
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="group cursor-pointer">
                    <div className="rounded-2xl overflow-hidden mb-4 relative aspect-[16/9]">
                        <img src={featured.image} alt={featured.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-6 left-6 right-6">
                            <span className="text-xs text-white/80 font-bold mb-2 block">{featured.date}</span>
                            <h3 className="text-2xl md:text-3xl font-black text-white leading-tight">
                                {featured.title}
                            </h3>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    {others.map((news) => (
                        <div key={news.id} className="flex gap-4 group cursor-pointer border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                            <div className="w-32 h-24 rounded-lg overflow-hidden shrink-0">
                                <img src={news.image} alt={news.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 group-hover:text-primary transition-colors mb-2 leading-snug">
                                    {news.title}
                                </h4>
                                <span className="text-xs text-gray-400 font-medium">{news.date}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

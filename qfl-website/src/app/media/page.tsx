import { redirect } from 'next/navigation';

/**
 * Media landing page - redirects to official YouTube channel.
 */
export default function MediaPage() {
  redirect('https://youtube.com/@qpl_kz');
}

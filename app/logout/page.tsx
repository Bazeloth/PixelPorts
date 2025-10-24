import { redirect } from 'next/navigation';

export default function LogoutPage() {
    // This route is no longer responsible for signing out. It simply redirects home.
    redirect('/');
}

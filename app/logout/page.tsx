import { signOutAction } from '@/app/logout/actions';

export default async function LogoutPage() {
    await signOutAction();
    return null; // unreachable due to redirect
}

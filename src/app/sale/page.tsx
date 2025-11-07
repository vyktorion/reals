import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

// Detectează device și redirectează către desktop/mobile
export default function SalePage()  {
    redirect('/sale/desktop');
}
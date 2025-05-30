'use client';

import React from 'react';
import BookingsList from '@/components/admin/bookings/bookingsList';
import { useTranslations } from 'next-intl';

export default function BookingsPage() {
    const t = useTranslations();

    return (
        <div>
            <BookingsList />
        </div>
    );
}

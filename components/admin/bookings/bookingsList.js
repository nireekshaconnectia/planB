import React, { useState, useEffect, useCallback } from 'react';
import styles from './bookingsList.module.css';
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';

export default function BookingsList() {
    const [bookings, setBookings] = useState([]);
    const [statistics, setStatistics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { data: session } = useSession();
    const t = useTranslations();

    const fetchBookings = useCallback(async () => {
        if (!session?.user?.token) return;
        
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rooms/admin/bookings`, {
                headers: {
                    'Authorization': `Bearer ${session.user.token}`,
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch bookings');
            }

            const result = await response.json();
            if (result.success) {
                setBookings(result.data || []);
                
            } else {
                throw new Error(result.message || 'Failed to fetch bookings');
            }
        } catch (err) {
            setError(err.message);
            console.error('Error fetching bookings:', err);
        } finally {
            setLoading(false);
        }
    }, [session?.user?.token]);

    const fetchStatistics = useCallback(async () => {
        if (!session?.user?.token) return;

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rooms/admin/bookings/statistics`, {
                headers: {
                    'Authorization': `Bearer ${session.user.token}`,
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch statistics');
            }

            const data = await response.json();
            setStatistics(data);
        } catch (err) {
            console.error('Error fetching statistics:', err);
        }
    }, [session?.user?.token]);

    useEffect(() => {
        let mounted = true;

        const loadData = async () => {
            if (!mounted) return;
            
            setLoading(true);
            setError(null);
            
            try {
                await Promise.all([
                    fetchBookings(),
                    fetchStatistics()
                ]);
            } catch (err) {
                if (mounted) {
                    setError(err.message);
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        if (session?.user?.token) {
            loadData();
        }

        return () => {
            mounted = false;
        };
    }, [session?.user?.token, fetchBookings, fetchStatistics]);

    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch (err) {
            console.error('Error formatting date:', err);
            return dateString;
        }
    };

    const formatTime = (timeString) => {
        try {
            // Convert 24-hour format to 12-hour format
            const [hours, minutes] = timeString.split(':');
            const hour = parseInt(hours, 10);
            const ampm = hour >= 12 ? 'PM' : 'AM';
            const hour12 = hour % 12 || 12;
            return `${hour12}:${minutes} ${ampm}`;
        } catch (err) {
            console.error('Error formatting time:', err);
            return timeString;
        }
    };

    const getStatusColor = (status) => {
        if (!status) return '';
        
        switch (status.toLowerCase()) {
            case 'confirmed':
                return styles.statusConfirmed;
            case 'pending':
                return styles.statusPending;
            case 'cancelled':
                return styles.statusCancelled;
            case 'completed':
                return styles.statusCompleted;
            default:
                return '';
        }
    };

    if (!session?.user?.token) {
        return <div className={styles.error}>{t('Please login to view bookings')}</div>;
    }

    if (loading) return <div className={styles.loading}>{t('loading')}</div>;
    if (error) return <div className={styles.error}>{error}</div>;

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>{t('Bookings')}</h1>
            
            {statistics && (
                <div className={styles.statistics}>
                    <div className={styles.statCard}>
                        <h3>{t('Total Bookings')}</h3>
                        <p>{statistics.totalBookings || 0}</p>
                    </div>
                    <div className={styles.statCard}>
                        <h3>{t('Active Bookings')}</h3>
                        <p>{statistics.activeBookings || 0}</p>
                    </div>
                    <div className={styles.statCard}>
                        <h3>{t('Today Bookings')}</h3>
                        <p>{statistics.todayBookings || 0}</p>
                    </div>
                </div>
            )}

            <div className={styles.bookingsList}>
                {bookings && bookings.length > 0 ? (
                    bookings.map((booking) => (
                        <div key={booking._id} className={styles.bookingCard}>
                            <div className={styles.bookingHeader}>
                                <h3>{t('Booking')} #{booking._id?.slice(-6) || 'N/A'}</h3>
                                <span className={`${styles.status} ${getStatusColor(booking.status)}`}>
                                    {t(booking.status || 'Unknown')}
                                </span>
                            </div>
                            <div className={styles.bookingDetails}>
                                <div className={styles.section}>
                                    <h4>{t('Customer Details')}</h4>
                                    <div className={styles.detail}>
                                        <strong>{t('Name')}:</strong>
                                        <span>{booking.user?.name || booking.firstName || booking.customerName || 'N/A'}</span>
                                    </div>
                                    <div className={styles.detail}>
                                        <strong>{t('Phone')}:</strong>
                                        <span>{booking.user?.phone || booking.phone || booking.customerPhone || 'N/A'}</span>
                                    </div>
                                </div>

                                <div className={styles.section}>
                                    <h4>{t('Room Details')}</h4>
                                    <div className={styles.detail}>
                                        <strong>{t('Room')}:</strong>
                                        <span>{booking.room?.name || 'N/A'}</span>
                                    </div>
                                    <div className={styles.detail}>
                                        <strong>{t('Capacity')}:</strong>
                                        <span>{booking.room?.capacity || 'N/A'} {t('persons')}</span>
                                    </div>
                                    {booking.room?.amenities?.length > 0 && (
                                        <div className={styles.facilities}>
                                            <strong>{t('Amenities')}:</strong>
                                            <div className={styles.facilityTags}>
                                                {booking.room.amenities.map((amenity, index) => (
                                                    <span key={index} className={styles.facilityTag}>
                                                        {amenity}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className={styles.section}>
                                    <h4>{t('booking-details')}</h4>
                                    <div className={styles.detail}>
                                        <strong>{t('Date')}:</strong>
                                        <span>{formatDate(booking.bookingDate)}</span>
                                    </div>
                                    <div className={styles.detail}>
                                        <strong>{t('time-slot')}:</strong>
                                        <span>{formatTime(booking.startTime)} - {formatTime(booking.endTime)}</span>
                                    </div>
                                    <div className={styles.detail}>
                                        <strong>{t('purpose')}:</strong>
                                        <span>{booking.purpose || 'N/A'}</span>
                                    </div>
                                    <div className={styles.detail}>
                                        <strong>{t('created-at')}:</strong>
                                        <span>{formatDate(booking.createdAt)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className={styles.noBookings}>
                        {t('No bookings found')}
                    </div>
                )}
            </div>
        </div>
    );
} 
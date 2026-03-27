// bookingsList.js
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
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/room-bookings`, {
                headers: {
                    'Authorization': `Bearer ${session.user.token}`,
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch bookings');
            }

            const result = await response.json();
            
            // Handle different response structures
            if (result.success && result.data) {
                setBookings(result.data);
            } else if (result.data && result.data.bookings) {
                setBookings(result.data.bookings);
            } else if (Array.isArray(result)) {
                setBookings(result);
            } else if (result.data && Array.isArray(result.data)) {
                setBookings(result.data);
            } else {
                setBookings([]);
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
            // Set default statistics if API fails
            setStatistics({
                totalBookings: bookings.length,
                activeBookings: bookings.filter(b => b.status === 'approved' || b.status === 'confirmed').length,
                todayBookings: bookings.filter(b => {
                    const today = new Date().toDateString();
                    const bookingDate = new Date(b.bookingDate).toDateString();
                    return bookingDate === today;
                }).length
            });
        }
    }, [bookings.length]);

    useEffect(() => {
        let mounted = true;

        const loadData = async () => {
            if (!mounted) return;
            
            setLoading(true);
            setError(null);
            
            try {
                await fetchBookings();
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
        } else {
            setLoading(false);
        }

        return () => {
            mounted = false;
        };
    }, [session?.user?.token, fetchBookings]);

    // Calculate statistics from bookings data
    useEffect(() => {
        if (bookings.length > 0 && !statistics) {
            const calculatedStats = {
                totalBookings: bookings.length,
                activeBookings: bookings.filter(b => 
                    b.status === 'approved' || 
                    b.status === 'confirmed' || 
                    b.paymentStatus === 'paid'
                ).length,
                todayBookings: bookings.filter(b => {
                    const today = new Date().toDateString();
                    const bookingDate = new Date(b.bookingDate).toDateString();
                    return bookingDate === today;
                }).length,
                pendingPayments: bookings.filter(b => b.paymentStatus === 'pending').length
            };
            setStatistics(calculatedStats);
        }
    }, [bookings, statistics]);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return 'Invalid Date';
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
        if (!timeString) return 'N/A';
        try {
            // Handle different time formats
            if (timeString.includes(':')) {
                const [hours, minutes] = timeString.split(':');
                const hour = parseInt(hours, 10);
                const ampm = hour >= 12 ? 'PM' : 'AM';
                const hour12 = hour % 12 || 12;
                return `${hour12}:${minutes} ${ampm}`;
            }
            return timeString;
        } catch (err) {
            console.error('Error formatting time:', err);
            return timeString;
        }
    };

    const getStatusColor = (status, paymentStatus) => {
        if (!status) return '';
        
        // Prioritize payment status if available
        if (paymentStatus === 'pending') return styles.statusPending;
        if (paymentStatus === 'paid') return styles.statusConfirmed;
        if (paymentStatus === 'failed') return styles.statusCancelled;
        
        switch (status.toLowerCase()) {
            case 'confirmed':
            case 'approved':
                return styles.statusConfirmed;
            case 'pending':
                return styles.statusPending;
            case 'cancelled':
            case 'rejected':
                return styles.statusCancelled;
            case 'completed':
                return styles.statusCompleted;
            default:
                return '';
        }
    };

    const getStatusText = (status, paymentStatus) => {
        if (paymentStatus === 'pending') return t('pending-payment');
        if (paymentStatus === 'paid') return t('paid');
        if (paymentStatus === 'failed') return t('payment-failed');
        
        switch (status?.toLowerCase()) {
            case 'confirmed':
            case 'approved':
                return t('confirmed');
            case 'pending':
                return t('pending');
            case 'cancelled':
            case 'rejected':
                return t('cancelled');
            case 'completed':
                return t('completed');
            default:
                return t(status || 'unknown');
        }
    };

    const getCustomerName = (booking) => {
        return booking.customerName || 
               booking.user?.name || 
               booking.firstName || 
               'N/A';
    };

    const getCustomerPhone = (booking) => {
        return booking.customerPhone || 
               booking.user?.phone || 
               booking.phone || 
               'N/A';
    };

    const getCustomerEmail = (booking) => {
        return booking.customerEmail || 
               booking.user?.email || 
               'N/A';
    };

    const getRoomName = (booking) => {
        return booking.room?.name || 
               booking.roomName || 
               'N/A';
    };

    const getRoomCapacity = (booking) => {
        return booking.room?.capacity || 
               booking.capacity || 
               'N/A';
    };

    const getRoomAmenities = (booking) => {
        return booking.room?.amenities || 
               booking.amenities || 
               booking.room?.facilities || 
               [];
    };

    const getBookingPurpose = (booking) => {
        return booking.purpose || 
               booking.bookingPurpose || 
               'N/A';
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
                    {statistics.pendingPayments !== undefined && (
                        <div className={styles.statCard}>
                            <h3>{t('Pending Payments')}</h3>
                            <p>{statistics.pendingPayments}</p>
                        </div>
                    )}
                </div>
            )}

            <div className={styles.bookingsList}>
                {bookings && bookings.length > 0 ? (
                    bookings.map((booking) => (
                        <div key={booking._id || booking.id} className={styles.bookingCard}>
                            <div className={styles.bookingHeader}>
                                <h3>{t('Booking')} #{booking._id?.slice(-6) || booking.id?.slice(-6) || 'N/A'}</h3>
                                <span className={`${styles.status} ${getStatusColor(booking.status, booking.paymentStatus)}`}>
                                    {getStatusText(booking.status, booking.paymentStatus)}
                                </span>
                            </div>
                            <div className={styles.bookingDetails}>
                                <div className={styles.section}>
                                    <h4>{t('Customer Details')}</h4>
                                    <div className={styles.detail}>
                                        <strong>{t('Name')}:</strong>
                                        <span>{getCustomerName(booking)}</span>
                                    </div>
                                    <div className={styles.detail}>
                                        <strong>{t('Phone')}:</strong>
                                        <span>{getCustomerPhone(booking)}</span>
                                    </div>
                                    <div className={styles.detail}>
                                        <strong>{t('Email')}:</strong>
                                        <span>{getCustomerEmail(booking)}</span>
                                    </div>
                                </div>

                                <div className={styles.section}>
                                    <h4>{t('Room Details')}</h4>
                                    <div className={styles.detail}>
                                        <strong>{t('Room')}:</strong>
                                        <span>{getRoomName(booking)}</span>
                                    </div>
                                    <div className={styles.detail}>
                                        <strong>{t('Capacity')}:</strong>
                                        <span>{getRoomCapacity(booking)} {t('persons')}</span>
                                    </div>
                                    {getRoomAmenities(booking).length > 0 && (
                                        <div className={styles.facilities}>
                                            <strong>{t('Amenities')}:</strong>
                                            <div className={styles.facilityTags}>
                                                {getRoomAmenities(booking).map((amenity, index) => (
                                                    <span key={index} className={styles.facilityTag}>
                                                        {typeof amenity === 'string' ? amenity : amenity.name || amenity}
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
                                        <span>{getBookingPurpose(booking)}</span>
                                    </div>
                                    {booking.amount && (
                                        <div className={styles.detail}>
                                            <strong>{t('Amount')}:</strong>
                                            <span>₹{booking.amount}</span>
                                        </div>
                                    )}
                                    {booking.paymentStatus && (
                                        <div className={styles.detail}>
                                            <strong>{t('Payment Status')}:</strong>
                                            <span className={booking.paymentStatus === 'paid' ? styles.statusConfirmed : styles.statusPending}>
                                                {t(booking.paymentStatus)}
                                            </span>
                                        </div>
                                    )}
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
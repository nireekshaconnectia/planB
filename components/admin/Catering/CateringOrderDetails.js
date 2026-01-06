"use client";
import PopupWrapper from "@/components/popup/popupWrapper";
import styles from './CateringOrderDetails.module.css';

export default function CateringOrderDetails({ isOpen, onClose, order }) {
    if (!order) return null;

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch (err) {
            return dateString;
        }
    };

    const formatTime = (timeString) => {
        if (!timeString) return 'N/A';
        try {
            const [hours, minutes] = timeString.split(':');
            const hour = parseInt(hours, 10);
            const ampm = hour >= 12 ? 'PM' : 'AM';
            const hour12 = hour % 12 || 12;
            return `${hour12}:${minutes} ${ampm}`;
        } catch (err) {
            return timeString;
        }
    };

    const getStatusColor = (status) => {
        if (!status) return '#666';
        const statusLower = status.toLowerCase();
        const colors = {
            pending: '#FFA500',
            confirmed: '#2196F3',
            preparing: '#FF4500',
            out_for_delivery: '#9C27B0',
            delivered: '#32CD32',
            completed: '#32CD32',
            cancelled: '#DC143C',
            paid: '#32CD32',
            failed: '#DC143C',
            refunded: '#FFA500'
        };
        return colors[statusLower] || '#666';
    };

    const orderId = order.orderId || order._id || order.id;
    const status = order.status || order.orderStatus || 'pending';
    const paymentStatus = order.paymentStatus || order.paymentDetails?.status || order.payment?.status || 'pending';
    const total = order.total || order.amount || order.amountPaid || order.paymentDetails?.amountPaid || 0;

    return (
        <PopupWrapper isOpen={isOpen} onClose={onClose} title="Order Details">
            <div className={styles.orderDetails}>
                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>Order Information</h3>
                    <div className={styles.detailRow}>
                        <span className={styles.label}>Order ID:</span>
                        <span className={styles.value}>#{orderId}</span>
                    </div>
                    <div className={styles.detailRow}>
                        <span className={styles.label}>Status:</span>
                        <span 
                            className={styles.value} 
                            style={{ color: getStatusColor(status) }}
                        >
                            {status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' ')}
                        </span>
                    </div>
                    <div className={styles.detailRow}>
                        <span className={styles.label}>Payment Status:</span>
                        <span 
                            className={styles.value} 
                            style={{ color: getStatusColor(paymentStatus) }}
                        >
                            {paymentStatus.charAt(0).toUpperCase() + paymentStatus.slice(1)}
                        </span>
                    </div>
                    {order.createdAt && (
                        <div className={styles.detailRow}>
                            <span className={styles.label}>Order Date:</span>
                            <span className={styles.value}>{formatDate(order.createdAt)}</span>
                        </div>
                    )}
                </div>

                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>Customer Information</h3>
                    <div className={styles.detailRow}>
                        <span className={styles.label}>Name:</span>
                        <span className={styles.value}>
                            {order.user?.name || order.firstName || order.customerName || 'N/A'}
                        </span>
                    </div>
                    <div className={styles.detailRow}>
                        <span className={styles.label}>Phone:</span>
                        <span className={styles.value}>
                            {order.user?.phone || order.phone || 'N/A'}
                        </span>
                    </div>
                    {order.email && (
                        <div className={styles.detailRow}>
                            <span className={styles.label}>Email:</span>
                            <span className={styles.value}>
                                {order.user?.email || order.email}
                            </span>
                        </div>
                    )}
                </div>

                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>Package Details</h3>
                    {order.selectedPackage && (
                        <div className={styles.detailRow}>
                            <span className={styles.label}>Package:</span>
                            <span className={styles.value}>{order.selectedPackage}</span>
                        </div>
                    )}
                    {order.numberOfPeople && (
                        <div className={styles.detailRow}>
                            <span className={styles.label}>Number of People:</span>
                            <span className={styles.value}>{order.numberOfPeople}</span>
                        </div>
                    )}
                    {order.selectedOptional && order.selectedOptional.length > 0 && (
                        <div className={styles.detailRow}>
                            <span className={styles.label}>Optional Items:</span>
                            <div className={styles.value}>
                                {Array.isArray(order.selectedOptional) 
                                    ? (
                                        <ul className={styles.optionalList}>
                                            {order.selectedOptional.map((item, idx) => (
                                                <li key={idx}>{item}</li>
                                            ))}
                                        </ul>
                                    )
                                    : <span>{order.selectedOptional}</span>
                                }
                            </div>
                        </div>
                    )}
                </div>

                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>Delivery Information</h3>
                    {order.deliveryDate && (
                        <div className={styles.detailRow}>
                            <span className={styles.label}>Delivery Date:</span>
                            <span className={styles.value}>{formatDate(order.deliveryDate)}</span>
                        </div>
                    )}
                    {order.deliveryTime && (
                        <div className={styles.detailRow}>
                            <span className={styles.label}>Delivery Time:</span>
                            <span className={styles.value}>{formatTime(order.deliveryTime)}</span>
                        </div>
                    )}
                    {order.location && (
                        <div className={styles.detailRow}>
                            <span className={styles.label}>Location:</span>
                            <span className={styles.value}>{order.location}</span>
                        </div>
                    )}
                    {order.detailedAddress && (
                        <div className={styles.detailRow}>
                            <span className={styles.label}>Detailed Address:</span>
                            <span className={styles.value}>{order.detailedAddress}</span>
                        </div>
                    )}
                    {order.address && (
                        <div className={styles.detailRow}>
                            <span className={styles.label}>Address:</span>
                            <span className={styles.value}>
                                {typeof order.address === 'object' 
                                    ? `${order.address.line1 || ''} ${order.address.city || ''} ${order.address.country || ''}`.trim()
                                    : order.address
                                }
                            </span>
                        </div>
                    )}
                </div>

                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>Pricing</h3>
                    <div className={styles.detailRow}>
                        <span className={styles.label}>Subtotal:</span>
                        <span className={styles.value}>QR {order.subtotal || 0}</span>
                    </div>
                    {order.deliveryCharge && (
                        <div className={styles.detailRow}>
                            <span className={styles.label}>Delivery Charge:</span>
                            <span className={styles.value}>QR {order.deliveryCharge}</span>
                        </div>
                    )}
                    {order.discount && order.discount > 0 && (
                        <div className={styles.detailRow}>
                            <span className={styles.label}>Discount:</span>
                            <span className={styles.value}>QR {order.discount}</span>
                        </div>
                    )}
                    <div className={styles.detailRow}>
                        <span className={styles.label}>Total:</span>
                        <span className={styles.totalValue}>QR {total}</span>
                    </div>
                </div>

                {order.specialInstructions && (
                    <div className={styles.section}>
                        <h3 className={styles.sectionTitle}>Special Instructions</h3>
                        <p className={styles.instructions}>{order.specialInstructions}</p>
                    </div>
                )}

                {order.additionalNote && (
                    <div className={styles.section}>
                        <h3 className={styles.sectionTitle}>Additional Notes</h3>
                        <p className={styles.instructions}>{order.additionalNote}</p>
                    </div>
                )}

                {order.paymentMethod && (
                    <div className={styles.section}>
                        <h3 className={styles.sectionTitle}>Payment Information</h3>
                        <div className={styles.detailRow}>
                            <span className={styles.label}>Payment Method:</span>
                            <span className={styles.value}>{order.paymentMethod}</span>
                        </div>
                    </div>
                )}
            </div>
        </PopupWrapper>
    );
}

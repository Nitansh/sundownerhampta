import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ROOMS, PACKAGES } from '../data';
import type { Room, Package } from '../data';
import { Calendar, Users, Percent, Gift, Check, ShieldCheck, Mail, CreditCard, Sparkles, Loader } from 'lucide-react';
import confetti from 'canvas-confetti';

interface BookingEngineProps {
  selectedRoomId: string;
  selectedPackage: Package | null;
  onSelectPackage: (pkg: Package) => void;
  clearSelection: () => void;
}

export const BookingEngine: React.FC<BookingEngineProps> = ({
  selectedRoomId,
  selectedPackage,
  onSelectPackage,
  clearSelection
}) => {
  // Booking Form State
  const [roomType, setRoomType] = useState<string>('attic-suite');
  const [checkIn, setCheckIn] = useState<string>('');
  const [checkOut, setCheckOut] = useState<string>('');
  const [guests, setGuests] = useState<number>(2);
  const [specialRequests, setSpecialRequests] = useState<string>('');
  const [coupon, setCoupon] = useState<string>('');
  
  // App States
  const [appliedDiscount, setAppliedDiscount] = useState<{ code: string; percent: number } | null>(null);
  const [couponError, setCouponError] = useState<string>('');
  const [bookingMode, setBookingMode] = useState<'room' | 'package'>('room');
  
  // Checkout & Success States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccessData, setBookingSuccessData] = useState<any | null>(null);

  // Sync incoming props
  useEffect(() => {
    if (selectedRoomId) {
      setRoomType(selectedRoomId);
      setBookingMode('room');
      // Set default dates if empty
      setDefaultDates();
    }
  }, [selectedRoomId]);

  useEffect(() => {
    if (selectedPackage) {
      setBookingMode('package');
      setDefaultDates(selectedPackage.duration.includes('3') ? 3 : 2);
    }
  }, [selectedPackage]);

  const setDefaultDates = (daysCount = 2) => {
    const today = new Date();
    const checkinDate = new Date(today);
    checkinDate.setDate(today.getDate() + 3); // checkin 3 days from now
    
    const checkoutDate = new Date(checkinDate);
    checkoutDate.setDate(checkinDate.getDate() + daysCount);

    setCheckIn(checkinDate.toISOString().split('T')[0]);
    setCheckOut(checkoutDate.toISOString().split('T')[0]);
  };

  // Set initial default dates if blank
  useEffect(() => {
    if (!checkIn || !checkOut) {
      setDefaultDates();
    }
  }, []);

  // Pricing calculations
  const getSelectedRoom = (): Room => {
    return ROOMS.find(r => r.id === roomType) || ROOMS[0];
  };

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 1;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  };

  const getSubtotal = () => {
    if (bookingMode === 'package' && selectedPackage) {
      return selectedPackage.price;
    } else {
      const room = getSelectedRoom();
      return room.price * calculateNights();
    }
  };

  const getDiscountAmount = () => {
    if (!appliedDiscount) return 0;
    return getSubtotal() * (appliedDiscount.percent / 100);
  };

  const getTax = () => {
    const taxable = getSubtotal() - getDiscountAmount();
    return taxable * 0.12; // 12% GST
  };

  const getGrandTotal = () => {
    return getSubtotal() - getDiscountAmount() + getTax();
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    const code = coupon.trim().toUpperCase();

    if (code === 'HAMPTA10') {
      setAppliedDiscount({ code: 'HAMPTA10', percent: 10 });
    } else if (code === 'DIGITALNOMAD') {
      setAppliedDiscount({ code: 'DIGITALNOMAD', percent: 15 });
    } else {
      setCouponError('Invalid voucher code. Try HAMPTA10 or DIGITALNOMAD');
      setAppliedDiscount(null);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedDiscount(null);
    setCoupon('');
    setCouponError('');
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate Payment and API processing
    setTimeout(() => {
      setIsSubmitting(false);
      
      const referenceId = 'SNH-' + Math.floor(100000 + Math.random() * 900000);
      
      setBookingSuccessData({
        referenceId,
        checkIn,
        checkOut,
        guests,
        bookingType: bookingMode === 'package' ? `Package: ${selectedPackage?.name}` : `Room: ${getSelectedRoom().name}`,
        nights: bookingMode === 'package' ? selectedPackage?.duration : `${calculateNights()} Nights`,
        grandTotal: getGrandTotal(),
        specialRequests: specialRequests || 'None'
      });

      // Confetti burst!
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }
      });
    }, 2500);
  };

  const handleCloseSuccess = () => {
    setBookingSuccessData(null);
    clearSelection();
    setDefaultDates();
    setSpecialRequests('');
    handleRemoveCoupon();
  };

  const nights = calculateNights();
  const room = getSelectedRoom();
  const subtotal = getSubtotal();
  const discount = getDiscountAmount();
  const tax = getTax();
  const grandTotal = getGrandTotal();

  return (
    <section id="booking" className="booking-section section-padding">
      <div className="container">
        <div className="section-title">
          <span className="subtitle">Instant Live Reservation</span>
          <h2>Secure Your Himalayan Escape</h2>
        </div>

        <div className="booking-layout-grid">
          {/* Form Side */}
          <div className="booking-form-card glass-panel">
            <div className="booking-mode-selector">
              <button
                type="button"
                className={`mode-tab ${bookingMode === 'room' ? 'active' : ''}`}
                onClick={() => {
                  setBookingMode('room');
                  clearSelection();
                }}
              >
                Book by Room
              </button>
              <button
                type="button"
                className={`mode-tab ${bookingMode === 'package' ? 'active' : ''}`}
                onClick={() => {
                  setBookingMode('package');
                  if (!selectedPackage) {
                    onSelectPackage(PACKAGES[0]);
                  }
                }}
              >
                Book Package
              </button>
            </div>

            <form onSubmit={handleBookingSubmit} className="booking-form">
              {bookingMode === 'room' ? (
                <div className="form-group">
                  <label htmlFor="room-select">Room Category</label>
                  <select
                    id="room-select"
                    value={roomType}
                    onChange={(e) => setRoomType(e.target.value)}
                  >
                    {ROOMS.map(r => (
                      <option key={r.id} value={r.id}>
                        {r.name} (₹{r.price.toLocaleString('en-IN')}/night)
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="form-group selected-package-display">
                  <label>Selected Package</label>
                  <div className="package-details-banner">
                    <h4>{selectedPackage?.name || PACKAGES[0].name}</h4>
                    <p>{selectedPackage?.duration || PACKAGES[0].duration} &bull; ₹{(selectedPackage?.price || PACKAGES[0].price).toLocaleString('en-IN')}</p>
                    <button 
                      type="button" 
                      onClick={() => {
                        setBookingMode('room');
                        clearSelection();
                      }}
                      className="change-selection-btn"
                    >
                      Change to Rooms
                    </button>
                  </div>
                </div>
              )}

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="check-in">Check-In Date</label>
                  <div className="input-icon-wrapper">
                    <Calendar className="input-icon" size={18} />
                    <input
                      id="check-in"
                      type="date"
                      value={checkIn}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setCheckIn(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="check-out">Check-Out Date</label>
                  <div className="input-icon-wrapper">
                    <Calendar className="input-icon" size={18} />
                    <input
                      id="check-out"
                      type="date"
                      value={checkOut}
                      min={checkIn || new Date().toISOString().split('T')[0]}
                      onChange={(e) => setCheckOut(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="guests-count">Guests</label>
                  <div className="input-icon-wrapper">
                    <Users className="input-icon" size={18} />
                    <select
                      id="guests-count"
                      value={guests}
                      onChange={(e) => setGuests(Number(e.target.value))}
                    >
                      <option value="1">1 Guest</option>
                      <option value="2">2 Guests</option>
                      <option value="3">3 Guests</option>
                      <option value="4">4 Guests</option>
                      <option value="5">5+ Guests (Requires Contact)</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="promo-field">Promo Code</label>
                  <div className="input-icon-wrapper">
                    <Percent className="input-icon" size={18} />
                    <input
                      id="promo-field"
                      type="text"
                      placeholder="e.g. HAMPTA10"
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value)}
                      disabled={!!appliedDiscount}
                    />
                  </div>
                </div>
              </div>

              {!appliedDiscount ? (
                <button 
                  type="button" 
                  onClick={handleApplyCoupon} 
                  className="btn btn-secondary apply-btn"
                  disabled={!coupon}
                >
                  Apply Voucher
                </button>
              ) : (
                <div className="coupon-success-tag">
                  <Check size={14} />
                  <span>Voucher <strong>{appliedDiscount.code}</strong> Applied ({appliedDiscount.percent}% Off)</span>
                  <button type="button" className="remove-coupon" onClick={handleRemoveCoupon}>Remove</button>
                </div>
              )}

              {couponError && <p className="coupon-error">{couponError}</p>}

              <div className="form-group">
                <label htmlFor="requests-field">Special Requests / Trekking requirements</label>
                <textarea
                  id="requests-field"
                  rows={3}
                  placeholder="Need heater setup? Want to book Hampta Pass trek guide? Let us know..."
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-gold w-full checkout-submit-btn pulse-gold-effect"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader className="spinner" size={18} />
                    Securing Connection...
                  </>
                ) : (
                  <>
                    <CreditCard size={18} />
                    Book & Pay ₹{grandTotal.toLocaleString('en-IN')}
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Pricing Breakdown / Summary Side */}
          <div className="booking-summary-card glass-panel-dark">
            <h3 className="summary-title">Reservation Invoice Summary</h3>
            
            <div className="summary-details">
              <div className="summary-row">
                <span className="label">Rate Calculation</span>
                <span className="value">
                  {bookingMode === 'package' 
                    ? `${selectedPackage?.name || PACKAGES[0].name} Package`
                    : `${room.name} (${nights} night${nights > 1 ? 's' : ''})`
                  }
                </span>
              </div>

              <div className="summary-row">
                <span className="label">Check-in</span>
                <span className="value">{checkIn || 'Not Selected'}</span>
              </div>

              <div className="summary-row">
                <span className="label">Check-out</span>
                <span className="value">{checkOut || 'Not Selected'}</span>
              </div>
            </div>

            <div className="summary-breakdown">
              <div className="breakdown-row">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>

              {discount > 0 && (
                <div className="breakdown-row discount">
                  <span>Discount ({appliedDiscount?.code})</span>
                  <span>-₹{discount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="breakdown-row">
                <span>Taxes & GST (12%)</span>
                <span>₹{tax.toLocaleString('en-IN')}</span>
              </div>

              <div className="breakdown-row grand-total">
                <span>Total Amount</span>
                <span>₹{grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="booking-trust-points">
              <div className="trust-item">
                <ShieldCheck size={18} />
                <span>100% Encrypted Safe Checkout</span>
              </div>
              <div className="trust-item">
                <Gift size={18} />
                <span>Vouchers active: <strong>HAMPTA10</strong> (10% off) | <strong>DIGITALNOMAD</strong> (15% off)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal Simulation */}
      <AnimatePresence>
        {bookingSuccessData && (
          <div className="success-overlay">
            <motion.div 
              className="success-modal glass-panel"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              <div className="success-header">
                <div className="success-check-badge">
                  <Sparkles size={32} className="sparkle-icon" />
                </div>
                <h2>Booking Confirmed!</h2>
                <p className="success-tag">See you in Hampta Valley, {guests > 1 ? 'everyone' : 'traveler'}!</p>
              </div>

              <div className="success-details-grid">
                <div className="success-detail-row">
                  <span className="label">Reference ID</span>
                  <span className="value code">{bookingSuccessData.referenceId}</span>
                </div>
                <div className="success-detail-row">
                  <span className="label">Stay Booking</span>
                  <span className="value">{bookingSuccessData.bookingType}</span>
                </div>
                <div className="success-detail-row">
                  <span className="label">Duration</span>
                  <span className="value">{bookingSuccessData.nights}</span>
                </div>
                <div className="success-detail-row">
                  <span className="label">Stay Dates</span>
                  <span className="value">{bookingSuccessData.checkIn} to {bookingSuccessData.checkOut}</span>
                </div>
                <div className="success-detail-row">
                  <span className="label">Total Paid</span>
                  <span className="value price">₹{bookingSuccessData.grandTotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="success-detail-row full-width">
                  <span className="label">Special Instructions</span>
                  <span className="value note">"{bookingSuccessData.specialRequests}"</span>
                </div>
              </div>

              <div className="email-sim-alert">
                <Mail size={18} />
                <p>A confirmation receipt and detailed packing list has been sent to your simulated guest email.</p>
              </div>

              <button onClick={handleCloseSuccess} className="btn btn-primary w-full close-success-btn">
                Close & Return Home
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .booking-section {
          background-color: var(--warm-beige);
        }

        .booking-layout-grid {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 3rem;
          margin-top: 2rem;
          align-items: start;
        }

        @media (max-width: 992px) {
          .booking-layout-grid {
            grid-template-columns: 1fr;
            gap: 2.5rem;
          }
        }

        .booking-form-card {
          border-radius: var(--radius-lg);
          border: 1px solid var(--beige-border);
          overflow: hidden;
        }

        .booking-mode-selector {
          display: flex;
          background-color: var(--beige-dark);
          border-bottom: 1px solid var(--beige-border);
        }

        .mode-tab {
          flex: 1;
          padding: 1.25rem;
          font-family: var(--font-sans);
          font-size: 1rem;
          font-weight: 500;
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          transition: var(--transition-fast);
        }

        .mode-tab.active {
          background-color: var(--warm-beige);
          color: var(--forest-green);
          font-weight: 600;
        }

        .booking-form {
          padding: 2.5rem;
        }

        @media (max-width: 576px) {
          .booking-form {
            padding: 1.5rem;
          }
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        @media (max-width: 480px) {
          .form-row {
            grid-template-columns: 1fr;
            gap: 0;
          }
        }

        .form-group {
          margin-bottom: 1.5rem;
          width: 100%;
        }

        .input-icon-wrapper {
          position: relative;
          width: 100%;
        }

        .input-icon {
          position: absolute;
          left: 1.25rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
          pointer-events: none;
        }

        .input-icon-wrapper input,
        .input-icon-wrapper select {
          padding-left: 3.25rem;
        }

        .apply-btn {
          padding: 0.6rem 1.2rem;
          font-size: 0.8rem;
          margin-bottom: 1.5rem;
        }

        .coupon-success-tag {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background-color: rgba(48, 77, 48, 0.1);
          color: var(--forest-green);
          padding: 0.5rem 1rem;
          border-radius: var(--radius-sm);
          font-size: 0.85rem;
          margin-bottom: 1.5rem;
          border: 1px solid rgba(48, 77, 48, 0.2);
        }

        .remove-coupon {
          background: none;
          border: none;
          color: var(--sunset-orange);
          font-weight: 600;
          cursor: pointer;
          margin-left: 0.5rem;
          font-size: 0.85rem;
        }

        .coupon-error {
          color: var(--sunset-orange);
          font-size: 0.85rem;
          margin-bottom: 1.5rem;
          font-weight: 500;
        }

        .selected-package-display {
          background-color: var(--beige-dark);
          padding: 1.25rem;
          border-radius: var(--radius-sm);
          border: 1px solid var(--beige-border);
        }

        .package-details-banner h4 {
          font-size: 1.15rem;
          color: var(--forest-green);
          margin-bottom: 0.25rem;
        }

        .package-details-banner p {
          font-size: 0.9rem;
          margin-bottom: 0.75rem;
        }

        .change-selection-btn {
          background: none;
          border: none;
          color: var(--sunset-orange);
          font-weight: 600;
          font-size: 0.85rem;
          cursor: pointer;
          padding: 0;
          text-decoration: underline;
        }

        .checkout-submit-btn {
          padding: 1.1rem;
          font-size: 1rem;
        }

        .spinner {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Summary Side */
        .booking-summary-card {
          border-radius: var(--radius-lg);
          padding: 3rem;
          color: var(--snow-white);
        }

        @media (max-width: 576px) {
          .booking-summary-card {
            padding: 1.5rem;
          }
        }

        .summary-title {
          font-size: 1.6rem;
          color: var(--luxury-gold);
          border-bottom: 1px solid rgba(255, 255, 255, 0.15);
          padding-bottom: 1rem;
          margin-bottom: 2rem;
        }

        .summary-details {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.15);
          padding-bottom: 2rem;
          margin-bottom: 2rem;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
        }

        .summary-row .label {
          font-size: 0.9rem;
          color: var(--beige-dark);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .summary-row .value {
          font-weight: 600;
          font-size: 0.95rem;
          text-align: right;
        }

        .summary-breakdown {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.15);
          padding-bottom: 2rem;
          margin-bottom: 2rem;
        }

        .breakdown-row {
          display: flex;
          justify-content: space-between;
          font-size: 1.05rem;
        }

        .breakdown-row.discount {
          color: var(--sunset-orange);
          font-weight: 600;
        }

        .breakdown-row.grand-total {
          font-size: 1.5rem;
          font-family: var(--font-serif);
          font-weight: 700;
          color: var(--luxury-gold);
        }

        .booking-trust-points {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .trust-item {
          display: flex;
          gap: 0.75rem;
          align-items: flex-start;
          font-size: 0.85rem;
          color: var(--beige-dark);
        }

        .trust-item strong {
          color: var(--luxury-gold);
        }

        /* Success Overlay */
        .success-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(10, 20, 14, 0.85);
          backdrop-filter: blur(8px);
          z-index: 1500;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }

        .success-modal {
          width: 100%;
          max-width: 650px;
          border-radius: var(--radius-lg);
          padding: 3rem;
          background: var(--warm-beige);
          text-align: center;
          border: 1px solid var(--luxury-gold);
          box-shadow: var(--shadow-premium);
        }

        @media (max-width: 576px) {
          .success-modal {
            padding: 1.5rem;
          }
        }

        .success-check-badge {
          width: 80px;
          height: 80px;
          border-radius: var(--radius-full);
          background-color: var(--forest-green);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
          box-shadow: 0 8px 24px rgba(20, 42, 29, 0.25);
        }

        .sparkle-icon {
          color: var(--luxury-gold);
        }

        .success-tag {
          font-size: 1.1rem;
          color: var(--text-muted);
          margin-top: 0.25rem;
        }

        .success-details-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.25rem;
          background: var(--beige-dark);
          padding: 1.5rem;
          border-radius: var(--radius-md);
          margin: 2rem 0;
          text-align: left;
          border: 1px solid var(--beige-border);
        }

        @media (max-width: 480px) {
          .success-details-grid {
            grid-template-columns: 1fr;
          }
        }

        .success-detail-row {
          display: flex;
          flex-direction: column;
        }

        .success-detail-row.full-width {
          grid-column: span 2;
        }

        @media (max-width: 480px) {
          .success-detail-row.full-width {
            grid-column: span 1;
          }
        }

        .success-detail-row .label {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-muted);
          margin-bottom: 0.15rem;
        }

        .success-detail-row .value {
          font-weight: 600;
          font-size: 0.95rem;
          color: var(--forest-green);
        }

        .success-detail-row .value.code {
          font-family: monospace;
          color: var(--sunset-orange);
          letter-spacing: 0.05em;
          font-size: 1.05rem;
        }

        .success-detail-row .value.price {
          color: var(--luxury-gold-dark);
          font-size: 1.15rem;
          font-weight: 700;
        }

        .success-detail-row .value.note {
          font-weight: 400;
          font-style: italic;
          font-size: 0.9rem;
        }

        .email-sim-alert {
          display: flex;
          gap: 0.75rem;
          align-items: center;
          background: rgba(20, 42, 29, 0.05);
          border: 1px solid rgba(20, 42, 29, 0.1);
          padding: 1rem;
          border-radius: var(--radius-sm);
          text-align: left;
          margin-bottom: 2rem;
        }

        .email-sim-alert p {
          font-size: 0.85rem;
          color: var(--forest-green);
          font-weight: 500;
        }

        .close-success-btn {
          padding: 1.1rem;
        }
      `}</style>
    </section>
  );
};

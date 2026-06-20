import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ROOMS, PACKAGES } from '../data';
import type { Room, Package } from '../data';
import { 
  Calendar, Users, Gift, Check, ShieldCheck, Mail, 
  CreditCard, Sparkles, Loader, ArrowRight, ArrowLeft, Car, 
  Utensils, Compass, Coffee, Download, CheckCircle2,
  Bookmark, Send
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface BookingEngineProps {
  selectedRoomId: string;
  selectedPackage: Package | null;
  onSelectPackage: (pkg: Package) => void;
  clearSelection: () => void;
}

type BookingStep = 'select' | 'details' | 'customize' | 'itinerary' | 'checkout' | 'success';

export const BookingEngine: React.FC<BookingEngineProps> = ({
  selectedRoomId,
  selectedPackage,
  onSelectPackage,
  clearSelection
}) => {
  // Wizard Steps & Mode
  const [bookingStep, setBookingStep] = useState<BookingStep>('select');
  const [bookingMode, setBookingMode] = useState<'room' | 'package'>('room');
  
  // Selection States
  const [roomType, setRoomType] = useState<string>('attic-suite');
  const [checkIn, setCheckIn] = useState<string>('');
  const [checkOut, setCheckOut] = useState<string>('');
  const [guests, setGuests] = useState<number>(2);
  const [groupType, setGroupType] = useState<string>('couple');

  // Customization States
  const [transport, setTransport] = useState<'none' | 'manali' | 'airport'>('none');
  const [mealPlan, setMealPlan] = useState<'cp' | 'map' | 'ap'>('cp');
  const [customActivities, setCustomActivities] = useState<string[]>([]);
  const [enhancements, setEnhancements] = useState<string[]>([]);
  const [dietaryStyle, setDietaryStyle] = useState<string>('standard');
  const [dietaryNotes, setDietaryNotes] = useState<string>('');
  const [specialRequests, setSpecialRequests] = useState<string>('');

  // Contact States
  const [personalName, setPersonalName] = useState<string>('');
  const [personalEmail, setPersonalEmail] = useState<string>('');
  const [personalPhone, setPersonalPhone] = useState<string>('');

  // Payment states
  const [cardNumber, setCardNumber] = useState<string>('');
  const [cardExpiry, setCardExpiry] = useState<string>('');
  const [cardCVV, setCardCVV] = useState<string>('');
  
  // Coupon & Submit States
  const [coupon, setCoupon] = useState<string>('');
  const [appliedDiscount, setAppliedDiscount] = useState<{ code: string; percent: number } | null>(null);
  const [couponError, setCouponError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccessData, setBookingSuccessData] = useState<any | null>(null);

  // Email simulation states
  const [showEmailPreview, setShowEmailPreview] = useState(false);
  const [emailSending, setEmailSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  // Activity Swap State for Itinerary
  const [swappedActivities, setSwappedActivities] = useState<Record<number, string>>({});

  // Sync props when selected from main page
  useEffect(() => {
    if (selectedRoomId) {
      setRoomType(selectedRoomId);
      setBookingMode('room');
      setDefaultDates();
      setBookingStep('details');
      scrollToBooking();
    }
  }, [selectedRoomId]);

  useEffect(() => {
    if (selectedPackage) {
      setBookingMode('package');
      // Set package duration (Adventure = 3 nights, Romace = 2 nights, Nomad = 14 nights)
      const nightsCount = selectedPackage.id === 'pkg-nomad' ? 14 : selectedPackage.id === 'pkg-honeymoon' ? 2 : 3;
      setDefaultDates(nightsCount);
      setBookingStep('details');
      scrollToBooking();
    }
  }, [selectedPackage]);

  const scrollToBooking = () => {
    const el = document.getElementById('booking');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const setDefaultDates = (daysCount = 3) => {
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

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 3;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 3;
  };

  const getSelectedRoom = (): Room => {
    return ROOMS.find(r => r.id === roomType) || ROOMS[0];
  };

  const getSelectedPackage = (): Package => {
    return selectedPackage || PACKAGES[0];
  };

  // Pricing Logic
  const getBasePrice = () => {
    if (bookingMode === 'package') {
      return getSelectedPackage().price;
    } else {
      return getSelectedRoom().price * calculateNights();
    }
  };

  const getCustomizationPrice = () => {
    let price = 0;
    const nights = calculateNights();

    // Transport
    if (transport === 'manali') price += 1200;
    if (transport === 'airport') price += 3500;

    // Meal Plan Upgrade (CP is included, MAP is +1200, AP is +2200 per guest per night)
    if (mealPlan === 'map') price += 1200 * guests * nights;
    if (mealPlan === 'ap') price += 2200 * guests * nights;

    // Excursions & Guides (One-off activity charges)
    if (customActivities.includes('trek')) price += 2500;
    if (customActivities.includes('snowboard')) price += 3000;
    if (customActivities.includes('hike')) price += 1800;
    if (customActivities.includes('farm')) price += 1000 * guests;

    // Enhancements (Per stay or per night)
    if (enhancements.includes('starlink')) price += 500 * nights;
    if (enhancements.includes('bonfire')) price += 1500;
    if (enhancements.includes('telescope')) price += 1000;
    if (enhancements.includes('decor')) price += 2000;

    return price;
  };

  const getSubtotal = () => {
    return getBasePrice() + getCustomizationPrice();
  };

  const getDiscountAmount = () => {
    if (!appliedDiscount) return 0;
    return getSubtotal() * (appliedDiscount.percent / 100);
  };

  const getTax = () => {
    return (getSubtotal() - getDiscountAmount()) * 0.12; // 12% GST
  };

  const getGrandTotal = () => {
    return getSubtotal() - getDiscountAmount() + getTax();
  };

  // Coupon handling
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

  // Activity selections
  const toggleActivity = (actId: string) => {
    if (customActivities.includes(actId)) {
      setCustomActivities(customActivities.filter(a => a !== actId));
    } else {
      setCustomActivities([...customActivities, actId]);
    }
  };

  const toggleEnhancement = (enhId: string) => {
    if (enhancements.includes(enhId)) {
      setEnhancements(enhancements.filter(e => e !== enhId));
    } else {
      setEnhancements([...enhancements, enhId]);
    }
  };

  // Itinerary Generation based on selections
  const generateItineraryDays = () => {
    const nights = calculateNights();
    const days = [];
    const mainType = bookingMode === 'package' ? getSelectedPackage().type : 'custom';

    // Day 1
    days.push({
      day: 1,
      title: 'Arrival & Valley Welcome',
      morning: 'Arrive in Manali. Pick up by private SUV if transport was selected.',
      afternoon: swappedActivities[1] === 'B' 
        ? 'Acclimatization forest trek on Sethan Ridge (9,200 ft) to adjust to altitude.' 
        : 'Sip hot butter tea in our panoramic glass lounge and check in to your suite.',
      evening: enhancements.includes('bonfire')
        ? 'Traditional Himachali multi-course dinner paired with a cozy private bonfire session.'
        : 'Fresh farm-to-table organic dinner served around our common wood-fired stove.',
      options: {
        afternoon: [
          { id: 'A', label: 'Relax in Glass Lounge' },
          { id: 'B', label: 'Ridge Forest Walk' }
        ]
      }
    });

    // Middle Days
    for (let i = 2; i <= nights; i++) {
      if (i === 2) {
        // Main activity day
        let defaultMorning = 'Sunrise deck meditation, followed by organic orchard breakfasts.';
        let defaultAfternoon = 'Traditional apple orchard walk & local village tour.';
        let alternateAfternoon = 'Visit to the ancient Sethan Buddhist Monastery & snow landscapes.';

        if (customActivities.includes('trek') || mainType === 'adventure') {
          defaultAfternoon = 'Guided high-altitude trek crossing cascading streams to Sethan Dome ridge.';
          alternateAfternoon = 'Trek to Chikka waterfalls base along the Hampta Pass route.';
        } else if (customActivities.includes('snowboard')) {
          defaultAfternoon = 'Backcountry snowboarding tutorial and powder trials in Sethan Valley.';
          alternateAfternoon = 'Guided snowshoeing expedition through frozen mountain meadows.';
        }

        days.push({
          day: i,
          title: 'Himalayan Exploration',
          morning: defaultMorning,
          afternoon: swappedActivities[2] === 'B' ? alternateAfternoon : defaultAfternoon,
          evening: enhancements.includes('telescope')
            ? 'Stargazing session with a high-end computerized telescope under pitch-black skies.'
            : 'Folk tales storytelling round-table with warm cider/tea.',
          options: {
            afternoon: [
              { id: 'A', label: 'Primary Excursion' },
              { id: 'B', label: 'Secondary Route' }
            ]
          }
        });
      } else if (i === 3) {
        // Leisure/Art day
        days.push({
          day: i,
          title: 'Artisanal & Nature Trails',
          morning: 'Freshly brewed French-press coffee with visual views of the Solang peaks.',
          afternoon: swappedActivities[3] === 'B'
            ? 'Rock bouldering session on the massive granite blocks of Sethan Valley.'
            : 'Interactive Himachali Siddu cooking workshop and woolen weaving demonstration.',
          evening: 'Sunset photography session on the valley deck, followed by grilled BBQ dinner.',
          options: {
            afternoon: [
              { id: 'A', label: 'Cooking & Craft Workshop' },
              { id: 'B', label: 'Granite Bouldering' }
            ]
          }
        });
      } else {
        // Additional nights
        days.push({
          day: i,
          title: `Peak Living - Day ${i}`,
          morning: 'Organic breakfast buffet.',
          afternoon: swappedActivities[i] === 'B'
            ? 'Personal work/leisure time with Starlink connectivity in the common lounge.'
            : 'Bird watching walk through cedar sanctuaries (spotting Golden Eagles & Monals).',
          evening: 'Gathering around the lounge fireplace, exchanging music and tales.',
          options: {
            afternoon: [
              { id: 'A', label: 'Forest Bird Watching' },
              { id: 'B', label: 'Workspace / Quiet Lounge' }
            ]
          }
        });
      }
    }

    // Departure Day
    days.push({
      day: nights + 1,
      title: 'Farewell Peaks',
      morning: 'Morning tea overlooking snow caps, followed by standard checkout (11:00 AM).',
      afternoon: transport !== 'none'
        ? 'SUV transfer drop-off to Manali Town or Bhuntar Airport.'
        : 'Farewell greetings from our hosts, starting onward journey.',
      evening: 'Arrive home with warm mountain memories.',
      options: null
    });

    return days;
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!personalName || !personalEmail || !personalPhone) {
      alert('Please fill in your contact information');
      return;
    }
    setIsSubmitting(true);

    // Simulate Payment processing
    setTimeout(() => {
      setIsSubmitting(false);
      const referenceId = 'SNH-' + Math.floor(100000 + Math.random() * 900000);
      
      const bookedData = {
        referenceId,
        checkIn,
        checkOut,
        guests,
        groupType,
        bookingType: bookingMode === 'package' ? `Package: ${getSelectedPackage().name}` : `Room: ${getSelectedRoom().name}`,
        nights: `${calculateNights()} Nights`,
        grandTotal: getGrandTotal(),
        personalName,
        personalEmail,
        personalPhone,
        dietaryStyle,
        dietaryNotes,
        specialRequests,
        days: generateItineraryDays()
      };

      setBookingSuccessData(bookedData);
      setBookingStep('success');

      // Confetti burst!
      confetti({
        particleCount: 160,
        spread: 90,
        origin: { y: 0.5 }
      });
    }, 2000);
  };

  // Calendar ICS Generator
  const downloadICS = () => {
    if (!bookingSuccessData) return;

    const { referenceId, checkIn, checkOut, bookingType, guests, days } = bookingSuccessData;
    const startStr = checkIn.replace(/-/g, '');
    const endStr = checkOut.replace(/-/g, '');
    
    // Check-in 12:00 PM, Check-out 11:00 AM
    const dtStart = `${startStr}T120000`;
    const dtEnd = `${endStr}T110000`;
    
    const itineraryText = days.map((d: any) => {
      return `Day ${d.day}: ${d.title}\\n- Morning: ${d.morning}\\n- Afternoon: ${d.afternoon}\\n- Evening: ${d.evening}`;
    }).join('\\n\\n');

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Sundowner Hampta//NONSGML Stay Booking//EN',
      'BEGIN:VEVENT',
      `UID:${referenceId}@sundownerhampta.com`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
      `DTSTART:${dtStart}`,
      `DTEND:${dtEnd}`,
      `SUMMARY:Stay at Sundowner Hampta (Ref: ${referenceId})`,
      `DESCRIPTION:Your mountain escape is confirmed!\\n\\nDetails:\\n- Accommodation: ${bookingType}\\n- Guests: ${guests}\\n- Reference ID: ${referenceId}\\n\\nItinerary Details:\\n${itineraryText}\\n\\nAddress: Sundowner Hampta, Sethan Ridge, Hampta Valley, Manali, HP 175143`,
      'LOCATION:Sundowner Hampta Lodge, Sethan Ridge, Hampta Valley, Manali, Himachal Pradesh',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `sundowner_booking_${referenceId}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSimulateEmail = () => {
    setEmailSending(true);
    setTimeout(() => {
      setEmailSending(false);
      setEmailSent(true);
    }, 1500);
  };

  const handleReset = () => {
    setBookingStep('select');
    clearSelection();
    setDefaultDates();
    setCustomActivities([]);
    setEnhancements([]);
    setTransport('none');
    setMealPlan('cp');
    setSwappedActivities({});
    setBookingSuccessData(null);
    setPersonalName('');
    setPersonalEmail('');
    setPersonalPhone('');
    setCardNumber('');
    setCardExpiry('');
    setCardCVV('');
    setSpecialRequests('');
    setDietaryNotes('');
    setCoupon('');
    setAppliedDiscount(null);
    setEmailSent(false);
    setShowEmailPreview(false);
  };

  const nights = calculateNights();
  const subtotal = getSubtotal();
  const discount = getDiscountAmount();
  const tax = getTax();
  const grandTotal = getGrandTotal();
  const currentDays = generateItineraryDays();

  // Wizard Nav Controls
  const steps = [
    { key: 'select', label: '1. Accommodation' },
    { key: 'details', label: '2. Dates & Guests' },
    { key: 'customize', label: '3. Personalize' },
    { key: 'itinerary', label: '4. Itinerary' },
    { key: 'checkout', label: '5. Pay & Review' },
  ];

  return (
    <section id="booking" className="booking-section section-padding">
      <div className="container">
        <div className="section-title">
          <span className="subtitle">Interactive Planner</span>
          <h2>Craft Your Himalayan Experience</h2>
        </div>

        {/* Custom Progress Stepper */}
        {bookingStep !== 'success' && (
          <div className="stepper-bar-container glass-panel">
            <div className="stepper-bar">
              {steps.map((s, idx) => {
                const isActive = bookingStep === s.key;
                const isPassed = steps.findIndex(st => st.key === bookingStep) > idx;
                return (
                  <div key={s.key} className={`step-node ${isActive ? 'active' : ''} ${isPassed ? 'passed' : ''}`}>
                    <div className="node-icon">
                      {isPassed ? <Check size={14} /> : idx + 1}
                    </div>
                    <span className="node-label">{s.label}</span>
                    {idx < steps.length - 1 && <div className="node-line" />}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="booking-layout-grid-custom">
          {/* Main Wizard Area */}
          <div className="wizard-main-content">
            <AnimatePresence mode="wait">
              
              {/* STEP 1: SELECT ROOM/PACKAGE */}
              {bookingStep === 'select' && (
                <motion.div
                  key="step-select"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="wizard-pane"
                >
                  <h3 className="pane-title">Choose Your Boarding Mode</h3>
                  <div className="booking-mode-selector-custom">
                    <button
                      type="button"
                      className={`mode-btn ${bookingMode === 'room' ? 'active' : ''}`}
                      onClick={() => setBookingMode('room')}
                    >
                      <Bookmark size={18} />
                      Custom Room Selection
                    </button>
                    <button
                      type="button"
                      className={`mode-btn ${bookingMode === 'package' ? 'active' : ''}`}
                      onClick={() => setBookingMode('package')}
                    >
                      <Sparkles size={18} />
                      Curated Retreat Packages
                    </button>
                  </div>

                  {bookingMode === 'room' ? (
                    <div className="selection-cards-grid">
                      {ROOMS.map(r => {
                        const isSelected = roomType === r.id;
                        return (
                          <div key={r.id} className={`selection-card glass-panel ${isSelected ? 'selected' : ''}`}>
                            <div className="card-image" style={{ backgroundImage: `url(${r.image})` }} />
                            <div className="card-info">
                              <h4>{r.name}</h4>
                              <p className="card-desc">{r.description}</p>
                              <div className="card-meta">
                                <span>{r.size} &bull; {r.occupancy}</span>
                                <span className="price-tag">₹{r.price.toLocaleString('en-IN')}<small>/night</small></span>
                              </div>
                              <button 
                                type="button" 
                                className={`btn w-full ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
                                onClick={() => setRoomType(r.id)}
                              >
                                {isSelected ? <Check size={16} /> : 'Select Room'}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="selection-cards-grid">
                      {PACKAGES.map(p => {
                        const isSelected = selectedPackage?.id === p.id;
                        return (
                          <div key={p.id} className={`selection-card glass-panel ${isSelected ? 'selected' : ''}`}>
                            <div className="card-image" style={{ backgroundImage: `url(${p.image})` }} />
                            <div className="card-info">
                              <span className="pkg-tag">{p.tagline}</span>
                              <h4>{p.name}</h4>
                              <p className="card-desc">{p.description}</p>
                              <div className="card-meta">
                                <span>{p.duration}</span>
                                <span className="price-tag">₹{p.price.toLocaleString('en-IN')}</span>
                              </div>
                              <button 
                                type="button" 
                                className={`btn w-full ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
                                onClick={() => onSelectPackage(p)}
                              >
                                {isSelected ? <Check size={16} /> : 'Select Package'}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <div className="wizard-actions">
                    <button 
                      type="button" 
                      onClick={() => setBookingStep('details')}
                      className="btn btn-primary ml-auto"
                    >
                      Next: Stay Details
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: STAY DATES & GUESTS */}
              {bookingStep === 'details' && (
                <motion.div
                  key="step-details"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="wizard-pane glass-panel"
                >
                  <h3 className="pane-title">Define Your Stay Schedule</h3>
                  
                  <div className="form-grid">
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
                          <option value="5">5+ Guests (Requires Coordination)</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="group-type">Group Composition</label>
                      <div className="input-icon-wrapper">
                        <Compass className="input-icon" size={18} />
                        <select
                          id="group-type"
                          value={groupType}
                          onChange={(e) => setGroupType(e.target.value)}
                        >
                          <option value="couple">Couple Escape</option>
                          <option value="solo">Solo Adventure</option>
                          <option value="family">Family Heritage</option>
                          <option value="friends">Friends Reunion</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="wizard-actions">
                    <button 
                      type="button" 
                      onClick={() => setBookingStep('select')}
                      className="btn btn-secondary"
                    >
                      <ArrowLeft size={16} />
                      Back
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setBookingStep('customize')}
                      className="btn btn-primary"
                    >
                      Next: Personalize Stay
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: CUSTOMIZATION OPTIONS */}
              {bookingStep === 'customize' && (
                <motion.div
                  key="step-customize"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="wizard-pane glass-panel"
                >
                  <h3 className="pane-title">Personalize Your Himalayan Escape</h3>
                  <p className="pane-subtitle-desc">Select transportation, dining plans, mountain excursions, and workspace upgrades tailored to your stay.</p>

                  <div className="customization-blocks">
                    
                    {/* 1. SUV Transport Pickups */}
                    <div className="custom-section">
                      <div className="section-header-custom">
                        <Car size={20} className="section-ico" />
                        <h4>SUV Pickup & Transfers</h4>
                      </div>
                      <div className="options-horizontal">
                        <label className={`radio-card ${transport === 'none' ? 'active' : ''}`}>
                          <input type="radio" name="transport" value="none" checked={transport === 'none'} onChange={() => setTransport('none')} />
                          <div className="radio-card-content">
                            <h5>No Transport</h5>
                            <p>Self-drive or local bus</p>
                            <span className="price-label">Free</span>
                          </div>
                        </label>
                        <label className={`radio-card ${transport === 'manali' ? 'active' : ''}`}>
                          <input type="radio" name="transport" value="manali" checked={transport === 'manali'} onChange={() => setTransport('manali')} />
                          <div className="radio-card-content">
                            <h5>Manali Mall Road</h5>
                            <p>SUV Pickup from city center</p>
                            <span className="price-label">₹1,200</span>
                          </div>
                        </label>
                        <label className={`radio-card ${transport === 'airport' ? 'active' : ''}`}>
                          <input type="radio" name="transport" value="airport" checked={transport === 'airport'} onChange={() => setTransport('airport')} />
                          <div className="radio-card-content">
                            <h5>Bhuntar Airport</h5>
                            <p>Direct Kullu airport pickup</p>
                            <span className="price-label">₹3,500</span>
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* 2. Dining Meal Plans */}
                    <div className="custom-section">
                      <div className="section-header-custom">
                        <Utensils size={20} className="section-ico" />
                        <h4>Himachali Kitchen Meal Plans</h4>
                      </div>
                      <div className="options-horizontal">
                        <label className={`radio-card ${mealPlan === 'cp' ? 'active' : ''}`}>
                          <input type="radio" name="mealPlan" value="cp" checked={mealPlan === 'cp'} onChange={() => setMealPlan('cp')} />
                          <div className="radio-card-content">
                            <h5>Breakfast Plan (CP)</h5>
                            <p>Organic morning breakfast</p>
                            <span className="price-label">Included</span>
                          </div>
                        </label>
                        <label className={`radio-card ${mealPlan === 'map' ? 'active' : ''}`}>
                          <input type="radio" name="mealPlan" value="map" checked={mealPlan === 'map'} onChange={() => setMealPlan('map')} />
                          <div className="radio-card-content">
                            <h5>Half Board (MAP)</h5>
                            <p>Breakfast + Gourmet Dinner</p>
                            <span className="price-label">+₹1,200/guest/night</span>
                          </div>
                        </label>
                        <label className={`radio-card ${mealPlan === 'ap' ? 'active' : ''}`}>
                          <input type="radio" name="mealPlan" value="ap" checked={mealPlan === 'ap'} onChange={() => setMealPlan('ap')} />
                          <div className="radio-card-content">
                            <h5>Full Board (AP)</h5>
                            <p>All meals: Breakfast, Lunch, Dinner</p>
                            <span className="price-label">+₹2,200/guest/night</span>
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* 3. Mountain Excursions & Equipment */}
                    <div className="custom-section">
                      <div className="section-header-custom">
                        <Compass size={20} className="section-ico" />
                        <h4>Guided Wilderness Excursions</h4>
                      </div>
                      <div className="options-checkboxes">
                        <div className={`checkbox-card ${customActivities.includes('trek') ? 'active' : ''}`} onClick={() => toggleActivity('trek')}>
                          <div className="chk-check">
                            {customActivities.includes('trek') && <Check size={14} />}
                          </div>
                          <div className="chk-content">
                            <h5>Hampta Pass Day Guide (₹2,500)</h5>
                            <p>Private professional guide for valley passes and waterfalls</p>
                          </div>
                        </div>

                        <div className={`checkbox-card ${customActivities.includes('snowboard') ? 'active' : ''}`} onClick={() => toggleActivity('snowboard')}>
                          <div className="chk-check">
                            {customActivities.includes('snowboard') && <Check size={14} />}
                          </div>
                          <div className="chk-content">
                            <h5>Snowboarding Backcountry Lesson (₹3,000)</h5>
                            <p>Beginner tutorial in Sethan valley with boards, boots, and safety gear</p>
                          </div>
                        </div>

                        <div className={`checkbox-card ${customActivities.includes('farm') ? 'active' : ''}`} onClick={() => toggleActivity('farm')}>
                          <div className="chk-check">
                            {customActivities.includes('farm') && <Check size={14} />}
                          </div>
                          <div className="chk-content">
                            <h5>Apple Orchard Tour & Siddu Workshop (₹1,000/guest)</h5>
                            <p>Pick seasonal fruits and learn to steam authentic Himachali wheat buns</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 4. Special Lodge Enhancements */}
                    <div className="custom-section">
                      <div className="section-header-custom">
                        <Coffee size={20} className="section-ico" />
                        <h4>Lodge Enhancements</h4>
                      </div>
                      <div className="options-checkboxes">
                        <div className={`checkbox-card ${enhancements.includes('starlink') ? 'active' : ''}`} onClick={() => toggleEnhancement('starlink')}>
                          <div className="chk-check">
                            {enhancements.includes('starlink') && <Check size={14} />}
                          </div>
                          <div className="chk-content">
                            <h5>Starlink Nomadic Workstation (₹500/night)</h5>
                            <p>Unlimited high-speed satellite internet and backup power dock</p>
                          </div>
                        </div>

                        <div className={`checkbox-card ${enhancements.includes('bonfire') ? 'active' : ''}`} onClick={() => toggleEnhancement('bonfire')}>
                          <div className="chk-check">
                            {enhancements.includes('bonfire') && <Check size={14} />}
                          </div>
                          <div className="chk-content">
                            <h5>Private Deck Bonfire & BBQ (₹1,500)</h5>
                            <p>Cozy firewood circle with grill basket on your cabin deck</p>
                          </div>
                        </div>

                        <div className={`checkbox-card ${enhancements.includes('telescope') ? 'active' : ''}`} onClick={() => toggleEnhancement('telescope')}>
                          <div className="chk-check">
                            {enhancements.includes('telescope') && <Check size={14} />}
                          </div>
                          <div className="chk-content">
                            <h5>Stargazing Guide & Telescope (₹1,000)</h5>
                            <p>1-hour celestial navigation session under zero light pollution</p>
                          </div>
                        </div>

                        <div className={`checkbox-card ${enhancements.includes('decor') ? 'active' : ''}`} onClick={() => toggleEnhancement('decor')}>
                          <div className="chk-check">
                            {enhancements.includes('decor') && <Check size={14} />}
                          </div>
                          <div className="chk-content">
                            <h5>Romantic Celebration Setup (₹2,000)</h5>
                            <p>Chalet custom floral arrangements and local organic apple wine bottle</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 5. Food Style & Allergies */}
                    <div className="custom-section">
                      <div className="section-header-custom">
                        <Utensils size={20} className="section-ico" />
                        <h4>Dietary Profile & Special Requests</h4>
                      </div>
                      <div className="diet-form-grid">
                        <div className="form-group">
                          <label htmlFor="diet-preference">Dietary Preference</label>
                          <select id="diet-preference" value={dietaryStyle} onChange={(e) => setDietaryStyle(e.target.value)}>
                            <option value="standard">Standard (No preferences)</option>
                            <option value="vegetarian">Pure Vegetarian</option>
                            <option value="vegan">Strict Vegan</option>
                            <option value="gluten-free">Gluten-Free</option>
                            <option value="eggetarian">Eggetarian</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label htmlFor="diet-allergies">Allergies (if any)</label>
                          <input 
                            id="diet-allergies" 
                            type="text" 
                            placeholder="e.g. Peanuts, Dairy, Mushrooms..." 
                            value={dietaryNotes}
                            onChange={(e) => setDietaryNotes(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="form-group" style={{ marginTop: '1rem' }}>
                        <label htmlFor="custom-requests">Lodge requests / instructions</label>
                        <textarea 
                          id="custom-requests" 
                          rows={3} 
                          placeholder="e.g. Setup room heater, room key coordination, extra bed inquiries..."
                          value={specialRequests}
                          onChange={(e) => setSpecialRequests(e.target.value)}
                        />
                      </div>
                    </div>

                  </div>

                  <div className="wizard-actions">
                    <button 
                      type="button" 
                      onClick={() => setBookingStep('details')}
                      className="btn btn-secondary"
                    >
                      <ArrowLeft size={16} />
                      Back
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setBookingStep('itinerary')}
                      className="btn btn-primary"
                    >
                      Next: Build Itinerary
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 4: INTERACTIVE ITINERARY GENERATION */}
              {bookingStep === 'itinerary' && (
                <motion.div
                  key="step-itinerary"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="wizard-pane"
                >
                  <div className="itinerary-header">
                    <h3 className="pane-title">Your Tailored Day-by-Day Itinerary</h3>
                    <p className="pane-subtitle-desc">Based on your checkout selections. Feel free to click buttons below to swap or customize activities.</p>
                  </div>

                  <div className="itinerary-timeline">
                    {currentDays.map((d) => {
                      return (
                        <div key={d.day} className="timeline-day-card glass-panel">
                          <div className="day-badge-container">
                            <span className="day-num">Day {d.day}</span>
                            <span className="day-tag">{d.title}</span>
                          </div>
                          
                          <div className="day-schedule-body">
                            <div className="schedule-slot">
                              <span className="time-lbl">Morning</span>
                              <p className="slot-desc">{d.morning}</p>
                            </div>

                            <div className="schedule-slot highlight">
                              <span className="time-lbl">Afternoon Excursion</span>
                              <p className="slot-desc">{d.afternoon}</p>
                              
                              {/* Interactive Swapper */}
                              {d.options && (
                                <div className="itinerary-option-toggle">
                                  <span className="swap-icon"><Compass size={12} /> Customize:</span>
                                  <div className="toggle-buttons">
                                    {d.options.afternoon.map(opt => {
                                      const currentVal = swappedActivities[d.day] || 'A';
                                      const isSelected = currentVal === opt.id;
                                      return (
                                        <button
                                          key={opt.id}
                                          type="button"
                                          className={`toggle-sub-btn ${isSelected ? 'active' : ''}`}
                                          onClick={() => setSwappedActivities({
                                            ...swappedActivities,
                                            [d.day]: opt.id
                                          })}
                                        >
                                          {opt.label}
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}
                            </div>

                            <div className="schedule-slot">
                              <span className="time-lbl">Evening & Dinner</span>
                              <p className="slot-desc">{d.evening}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="wizard-actions">
                    <button 
                      type="button" 
                      onClick={() => setBookingStep('customize')}
                      className="btn btn-secondary"
                    >
                      <ArrowLeft size={16} />
                      Back
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setBookingStep('checkout')}
                      className="btn btn-primary"
                    >
                      Next: Review & Checkout
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 5: REVIEW & CHECKOUT */}
              {bookingStep === 'checkout' && (
                <motion.div
                  key="step-checkout"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="wizard-pane glass-panel"
                >
                  <h3 className="pane-title">Finalize Your Reservation</h3>

                  <form onSubmit={handleBookingSubmit} className="checkout-final-form">
                    
                    {/* User Info Fields */}
                    <div className="checkout-section">
                      <h4>1. Lead Guest Information</h4>
                      <div className="form-grid">
                        <div className="form-group">
                          <label htmlFor="guest-name">Full Name</label>
                          <input 
                            id="guest-name" 
                            type="text" 
                            required 
                            placeholder="e.g. Nitansh Verma" 
                            value={personalName} 
                            onChange={(e) => setPersonalName(e.target.value)}
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="guest-email">Email Address</label>
                          <div className="input-icon-wrapper">
                            <Mail className="input-icon" size={16} />
                            <input 
                              id="guest-email" 
                              type="email" 
                              required 
                              placeholder="e.g. nitansh@example.com" 
                              value={personalEmail} 
                              onChange={(e) => setPersonalEmail(e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="form-group">
                          <label htmlFor="guest-phone">Phone Number</label>
                          <input 
                            id="guest-phone" 
                            type="tel" 
                            required 
                            placeholder="e.g. +91 98765 43210" 
                            value={personalPhone} 
                            onChange={(e) => setPersonalPhone(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Payment Section */}
                    <div className="checkout-section">
                      <h4>2. Payment Details (Simulated Gateway)</h4>
                      <div className="card-input-box">
                        <div className="form-group">
                          <label htmlFor="card-num">Credit / Debit Card Number</label>
                          <div className="input-icon-wrapper">
                            <CreditCard className="input-icon" size={16} />
                            <input 
                              id="card-num" 
                              type="text" 
                              maxLength={19} 
                              required 
                              placeholder="4111 2222 3333 4444" 
                              value={cardNumber} 
                              onChange={(e) => setCardNumber(e.target.value.replace(/\W/gi, '').replace(/(.{4})/g, '$1 ').trim())}
                            />
                          </div>
                        </div>
                        <div className="card-minor-fields">
                          <div className="form-group">
                            <label htmlFor="card-exp">Expiry (MM/YY)</label>
                            <input 
                              id="card-exp" 
                              type="text" 
                              maxLength={5} 
                              required 
                              placeholder="12/28" 
                              value={cardExpiry} 
                              onChange={(e) => setCardExpiry(e.target.value)}
                            />
                          </div>
                          <div className="form-group">
                            <label htmlFor="card-cvv">CVV</label>
                            <input 
                              id="card-cvv" 
                              type="password" 
                              maxLength={3} 
                              required 
                              placeholder="***" 
                              value={cardCVV} 
                              onChange={(e) => setCardCVV(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Vouchers and Promo Code */}
                    <div className="checkout-section">
                      <h4>3. Vouchers & Discounts</h4>
                      <div className="promo-inline">
                        <input 
                          type="text" 
                          placeholder="Try HAMPTA10 (10% off) or DIGITALNOMAD (15% off)" 
                          value={coupon} 
                          onChange={(e) => setCoupon(e.target.value)}
                          disabled={!!appliedDiscount}
                        />
                        {!appliedDiscount ? (
                          <button 
                            type="button" 
                            onClick={handleApplyCoupon} 
                            className="btn btn-secondary px-6"
                            disabled={!coupon}
                          >
                            Apply
                          </button>
                        ) : (
                          <div className="applied-tag">
                            <span>{appliedDiscount.code} ({appliedDiscount.percent}% off)</span>
                            <button type="button" className="remove-btn" onClick={handleRemoveCoupon}>Remove</button>
                          </div>
                        )}
                      </div>
                      {couponError && <p className="promo-err">{couponError}</p>}
                    </div>

                    <button 
                      type="submit" 
                      className="btn btn-gold w-full pay-action-btn pulse-gold-effect"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader className="spinner" size={18} />
                          Processing Transaction...
                        </>
                      ) : (
                        <>
                          <ShieldCheck size={18} />
                          Secure & Book Stay - ₹{grandTotal.toLocaleString('en-IN')}
                        </>
                      )}
                    </button>

                  </form>
                  
                  <div className="wizard-actions pt-6 border-t mt-6">
                    <button 
                      type="button" 
                      onClick={() => setBookingStep('itinerary')}
                      className="btn btn-secondary"
                      disabled={isSubmitting}
                    >
                      <ArrowLeft size={16} />
                      Back to Itinerary
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 6: BOOKING SUCCESS (RECEIPT & INVITATIONS) */}
              {bookingStep === 'success' && bookingSuccessData && (
                <motion.div
                  key="step-success"
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className="success-dashboard"
                >
                  <div className="success-banner glass-panel-dark">
                    <div className="success-badge">
                      <Sparkles size={36} className="sparkle-icon" />
                    </div>
                    <h2>Reservation Completed!</h2>
                    <p className="success-tag">See you in Hampta Valley, {personalName}!</p>
                    <span className="ref-code">Reference ID: <strong>{bookingSuccessData.referenceId}</strong></span>
                  </div>

                  <div className="success-grid">
                    
                    {/* Stay Invoice Summary Card */}
                    <div className="success-card glass-panel">
                      <h3>Stay Receipt</h3>
                      <div className="receipt-list">
                        <div className="receipt-row">
                          <span className="lbl">Accommodation</span>
                          <span className="val font-semibold">{bookingSuccessData.bookingType}</span>
                        </div>
                        <div className="receipt-row">
                          <span className="lbl">Dates</span>
                          <span className="val">{bookingSuccessData.checkIn} to {bookingSuccessData.checkOut} ({bookingSuccessData.nights})</span>
                        </div>
                        <div className="receipt-row">
                          <span className="lbl">Guests count</span>
                          <span className="val">{bookingSuccessData.guests} Guest(s) ({bookingSuccessData.groupType})</span>
                        </div>
                        <div className="receipt-row">
                          <span className="lbl">Diet preferences</span>
                          <span className="val capitalize">{bookingSuccessData.dietaryStyle}</span>
                        </div>
                        <div className="receipt-row total">
                          <span className="lbl">Total paid amount</span>
                          <span className="val">₹{bookingSuccessData.grandTotal.toLocaleString('en-IN')}</span>
                        </div>
                      </div>

                      {/* Download ICS Button */}
                      <button 
                        type="button" 
                        onClick={downloadICS} 
                        className="btn btn-primary w-full download-ics-btn"
                      >
                        <Download size={18} />
                        Add to Calendar (.ics)
                      </button>

                      {/* Toggle Email Preview Modal Button */}
                      <button 
                        type="button" 
                        onClick={() => setShowEmailPreview(true)} 
                        className="btn btn-secondary w-full email-preview-trigger"
                      >
                        <Mail size={18} />
                        View Confirmation Email
                      </button>

                      <button 
                        type="button" 
                        onClick={handleReset} 
                        className="btn btn-secondary w-full reset-booking-btn"
                      >
                        Book Another Escape
                      </button>
                    </div>

                    {/* Finalized Itinerary Viewer */}
                    <div className="success-card itinerary-preview glass-panel">
                      <h3>Your Custom Finalized Itinerary</h3>
                      <div className="receipt-itinerary-scroller">
                        {bookingSuccessData.days.map((d: any) => (
                          <div key={d.day} className="receipt-day-card">
                            <div className="r-day-hdr">
                              <span className="r-day-badge">Day {d.day}</span>
                              <span className="r-day-title">{d.title}</span>
                            </div>
                            <div className="r-day-content">
                              <p><strong>Morning:</strong> {d.morning}</p>
                              <p><strong>Afternoon:</strong> {d.afternoon}</p>
                              <p><strong>Evening:</strong> {d.evening}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          {/* Pricing Sidebar (Always Visible during steps 1 to 5) */}
          {bookingStep !== 'success' && (
            <div className="booking-summary-sidebar glass-panel-dark">
              <h3 className="summary-title">Reservation Invoice</h3>
              
              <div className="summary-details">
                <div className="summary-row">
                  <span className="label">Rate Calculation</span>
                  <span className="value">
                    {bookingMode === 'package' 
                      ? `${getSelectedPackage().name} Package`
                      : `${getSelectedRoom().name} (${nights} night${nights > 1 ? 's' : ''})`
                    }
                  </span>
                </div>

                <div className="summary-row">
                  <span className="label">Check-in / Check-out</span>
                  <span className="value">{checkIn || 'None'} &rarr; {checkOut || 'None'}</span>
                </div>

                <div className="summary-row">
                  <span className="label">Guests / Group</span>
                  <span className="value">{guests} Guest(s) &bull; <span className="capitalize">{groupType}</span></span>
                </div>
              </div>

              <div className="summary-breakdown">
                <div className="breakdown-row">
                  <span>Stay Base Price</span>
                  <span>₹{getBasePrice().toLocaleString('en-IN')}</span>
                </div>

                {getCustomizationPrice() > 0 && (
                  <div className="breakdown-row customization-charge">
                    <span>Selected Customizations</span>
                    <span>₹{getCustomizationPrice().toLocaleString('en-IN')}</span>
                  </div>
                )}

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
                  <ShieldCheck size={16} />
                  <span>100% Encrypted Safe Checkout</span>
                </div>
                <div className="trust-item">
                  <Gift size={16} />
                  <span>Vouchers active: <strong>HAMPTA10</strong> | <strong>DIGITALNOMAD</strong></span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MOCK EMAIL CLIENT PREVIEW MODAL */}
      <AnimatePresence>
        {showEmailPreview && bookingSuccessData && (
          <div className="email-preview-overlay">
            <motion.div 
              className="email-client-modal"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              {/* Mail client toolbar */}
              <div className="email-client-header">
                <div className="email-window-controls">
                  <span className="window-dot red" onClick={() => setShowEmailPreview(false)} />
                  <span className="window-dot yellow" />
                  <span className="window-dot green" />
                </div>
                <div className="email-window-title">Confirmation Email Viewer</div>
                <button type="button" className="close-preview" onClick={() => setShowEmailPreview(false)}>&times;</button>
              </div>

              {/* Mail headers */}
              <div className="email-client-meta">
                <div className="meta-line">
                  <span className="meta-lbl">From:</span>
                  <span className="meta-val font-semibold text-teal-400">bookings@sundownerhampta.com</span>
                </div>
                <div className="meta-line">
                  <span className="meta-lbl">To:</span>
                  <span className="meta-val">{bookingSuccessData.personalEmail}</span>
                </div>
                <div className="meta-line">
                  <span className="meta-lbl">Subject:</span>
                  <span className="meta-val font-semibold">Your Himalayan Escape is Confirmed! (Ref: {bookingSuccessData.referenceId})</span>
                </div>
              </div>

              {/* Mail Body Workspace */}
              <div className="email-client-body">
                
                {/* Simulated sending button */}
                <div className="email-sim-toolbar">
                  {!emailSent ? (
                    <button 
                      type="button" 
                      onClick={handleSimulateEmail} 
                      className="btn-sim-send"
                      disabled={emailSending}
                    >
                      {emailSending ? (
                        <>
                          <Loader className="spinner" size={14} />
                          Broadcasting to servers...
                        </>
                      ) : (
                        <>
                          <Send size={14} />
                          Simulate "Send Real Mail"
                        </>
                      )}
                    </button>
                  ) : (
                    <div className="email-sent-badge">
                      <CheckCircle2 size={16} />
                      Simulated Real Email Dispatched to {bookingSuccessData.personalEmail}!
                    </div>
                  )}
                </div>

                {/* HTML Luxury Email Content */}
                <div className="newsletter-template">
                  <div className="newsletter-header">
                    <span className="newsletter-logo">SUNDOWNER HAMPTA</span>
                    <span className="newsletter-hdr-subtitle">Mountain Homestay & Sanctuary</span>
                  </div>

                  <div className="newsletter-body">
                    <h2>Your Adventure Awaits!</h2>
                    <p>Hi {bookingSuccessData.personalName},</p>
                    <p>Thank you for choosing <strong>Sundowner Hampta</strong>. We are pleased to confirm your high-altitude mountain reservation. Below you will find your booking confirmation receipt and your personalized travel itinerary.</p>

                    <div className="newsletter-receipt-box">
                      <div className="news-rec-title">Reservation Summary</div>
                      <div className="news-rec-row">
                        <span>Reference ID:</span>
                        <strong className="text-teal-600">{bookingSuccessData.referenceId}</strong>
                      </div>
                      <div className="news-rec-row">
                        <span>Stay Type:</span>
                        <span>{bookingSuccessData.bookingType}</span>
                      </div>
                      <div className="news-rec-row">
                        <span>Stay Duration:</span>
                        <span>{bookingSuccessData.checkIn} to {bookingSuccessData.checkOut} ({bookingSuccessData.nights})</span>
                      </div>
                      <div className="news-rec-row">
                        <span>Guests Count:</span>
                        <span>{bookingSuccessData.guests} Guest(s)</span>
                      </div>
                      <div className="news-rec-row">
                        <span>Diet style:</span>
                        <span className="capitalize">{bookingSuccessData.dietaryStyle}</span>
                      </div>
                      <div className="news-rec-row">
                        <span>Total Paid:</span>
                        <span>₹{bookingSuccessData.grandTotal.toLocaleString('en-IN')}</span>
                      </div>
                    </div>

                    <h3>Your Customized Day-by-Day Plan</h3>
                    <div className="newsletter-itinerary">
                      {bookingSuccessData.days.map((day: any) => (
                        <div key={day.day} className="newsletter-day">
                          <div className="news-day-hdr">Day {day.day}: {day.title}</div>
                          <div className="news-day-slots">
                            <div><strong>Morning:</strong> {day.morning}</div>
                            <div><strong>Afternoon:</strong> {day.afternoon}</div>
                            <div><strong>Evening:</strong> {day.evening}</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="newsletter-infobox">
                      <h4>Essential Pack Checklist</h4>
                      <ul>
                        <li>Trekking boots & thermal layer items (Sethan Ridge sits at 9,200 ft).</li>
                        <li>Personal medications, UV shades, and mountain windcheaters.</li>
                        <li>Driving coordination: SUV drivers will contact you 24 hours prior to arrival.</li>
                      </ul>
                    </div>

                    <p className="newsletter-footer-text">Sundowner Hampta, Sethan Ridge, Hampta Valley, Manali, Himachal Pradesh, India. <br /> Need support? Call us at +91 98765 43210 or reply directly to this mail.</p>
                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .booking-section {
          background-color: var(--bg-deep);
          border-bottom: 1px solid var(--border-gold);
          position: relative;
          z-index: 10;
        }

        /* Stepper Styling */
        .stepper-bar-container {
          padding: 1.5rem;
          margin-bottom: 3rem;
          background: rgba(15, 23, 42, 0.4);
        }

        .stepper-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 900px;
          margin: 0 auto;
          position: relative;
        }

        .step-node {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          flex: 1;
          position: relative;
        }

        .node-icon {
          width: 32px;
          height: 32px;
          border-radius: var(--radius-full);
          background: var(--bg-deep);
          border: 2px solid var(--border-gold-bright);
          color: var(--text-muted);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.85rem;
          transition: var(--transition-smooth);
          z-index: 2;
        }

        .node-label {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          text-align: center;
          transition: var(--transition-smooth);
        }

        .step-node.active .node-icon {
          border-color: var(--accent-teal);
          color: var(--accent-teal-bright);
          box-shadow: 0 0 15px rgba(45, 212, 191, 0.3);
          background: var(--accent-teal-dark);
        }

        .step-node.active .node-label {
          color: var(--accent-teal-bright);
        }

        .step-node.passed .node-icon {
          border-color: var(--accent-rose);
          background: var(--accent-rose-dark);
          color: var(--snow-white);
        }

        .node-line {
          position: absolute;
          top: 16px;
          left: 50%;
          width: 100%;
          height: 2px;
          background: var(--border-gold);
          z-index: 1;
        }

        /* Layout Grid */
        .booking-layout-grid-custom {
          display: grid;
          grid-template-columns: 1.4fr 1fr;
          gap: 3rem;
          align-items: start;
        }

        @media (max-width: 992px) {
          .booking-layout-grid-custom {
            grid-template-columns: 1fr;
            gap: 2.5rem;
          }
        }

        .wizard-main-content {
          width: 100%;
        }

        .wizard-pane {
          padding: 2.5rem;
        }

        @media (max-width: 576px) {
          .wizard-pane {
            padding: 1.5rem;
          }
        }

        .pane-title {
          font-size: 1.5rem;
          color: var(--accent-teal-bright);
          margin-bottom: 1.5rem;
          border-bottom: 1px solid var(--border-gold);
          padding-bottom: 0.75rem;
        }

        .pane-subtitle-desc {
          margin-top: -1rem;
          margin-bottom: 2rem;
          font-size: 0.95rem;
          color: var(--text-muted);
        }

        /* Mode Selector */
        .booking-mode-selector-custom {
          display: flex;
          gap: 1.5rem;
          margin-bottom: 2.5rem;
        }

        .mode-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          padding: 1.25rem;
          font-family: var(--font-serif);
          font-size: 1.05rem;
          background: var(--bg-card);
          border: 1px solid var(--border-gold);
          color: var(--text-muted);
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: var(--transition-smooth);
        }

        .mode-btn:hover {
          border-color: var(--accent-teal);
          color: var(--accent-teal);
          background: var(--bg-card-hover);
        }

        .mode-btn.active {
          background: linear-gradient(135deg, rgba(45, 212, 191, 0.15), rgba(45, 212, 191, 0.05));
          border-color: var(--accent-teal);
          color: var(--accent-teal-bright);
          box-shadow: 0 0 20px rgba(45, 212, 191, 0.1);
        }

        /* Selection Cards Grid */
        .selection-cards-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .selection-card {
          display: grid;
          grid-template-columns: 1.2fr 1.5fr;
          overflow: hidden;
          min-height: 260px;
          transition: var(--transition-smooth);
        }

        @media (max-width: 768px) {
          .selection-card {
            grid-template-columns: 1fr;
          }
        }

        .selection-card.selected {
          border-color: var(--accent-teal);
          box-shadow: 0 0 25px rgba(45, 212, 191, 0.15);
        }

        .card-image {
          background-size: cover;
          background-position: center;
          height: 100%;
          min-height: 200px;
        }

        .card-info {
          padding: 1.75rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 1rem;
        }

        .card-info h4 {
          font-size: 1.25rem;
          color: var(--accent-teal-bright);
        }

        .pkg-tag {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--accent-rose);
          font-weight: 700;
        }

        .card-desc {
          font-size: 0.9rem;
          line-height: 1.6;
        }

        .card-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.85rem;
          color: var(--text-muted);
        }

        .price-tag {
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--accent-teal);
          font-family: var(--font-serif);
        }

        .price-tag small {
          font-size: 0.75rem;
          font-weight: 400;
          color: var(--text-muted);
        }

        /* Details step Form */
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          margin-bottom: 2rem;
        }

        @media (max-width: 576px) {
          .form-grid {
            grid-template-columns: 1fr;
            gap: 1.25rem;
          }
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

        /* Customization Blocks */
        .customization-blocks {
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
          margin-bottom: 2rem;
        }

        .custom-section {
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          padding-bottom: 2rem;
        }

        .custom-section:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .section-header-custom {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.25rem;
        }

        .section-header-custom h4 {
          font-size: 1.1rem;
          color: var(--accent-teal);
          font-family: var(--font-body);
          font-weight: 700;
          letter-spacing: 0.05em;
        }

        .section-ico {
          color: var(--accent-teal);
        }

        .options-horizontal {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
        }

        @media (max-width: 768px) {
          .options-horizontal {
            grid-template-columns: 1fr;
            gap: 0.75rem;
          }
        }

        .radio-card {
          border: 1px solid var(--border-gold);
          border-radius: var(--radius-sm);
          padding: 1.25rem;
          background: rgba(15, 23, 42, 0.4);
          cursor: pointer;
          position: relative;
          transition: var(--transition-smooth);
        }

        .radio-card input {
          position: absolute;
          opacity: 0;
          width: 0;
          height: 0;
        }

        .radio-card:hover {
          border-color: var(--accent-teal);
          background: rgba(15, 23, 42, 0.7);
        }

        .radio-card.active {
          border-color: var(--accent-teal);
          background: linear-gradient(135deg, rgba(45, 212, 191, 0.1), rgba(3, 7, 18, 0.6));
          box-shadow: 0 0 15px rgba(45, 212, 191, 0.05);
        }

        .radio-card-content h5 {
          font-size: 0.95rem;
          font-weight: 700;
          margin-bottom: 0.25rem;
          color: var(--text-main);
        }

        .radio-card-content p {
          font-size: 0.8rem;
          line-height: 1.4;
          margin-bottom: 0.75rem;
        }

        .price-label {
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--accent-teal);
          font-family: var(--font-serif);
        }

        .options-checkboxes {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.25rem;
        }

        @media (max-width: 768px) {
          .options-checkboxes {
            grid-template-columns: 1fr;
            gap: 0.75rem;
          }
        }

        .checkbox-card {
          border: 1px solid var(--border-gold);
          border-radius: var(--radius-sm);
          padding: 1.25rem;
          background: rgba(15, 23, 42, 0.4);
          cursor: pointer;
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          transition: var(--transition-smooth);
        }

        .checkbox-card:hover {
          border-color: var(--accent-teal);
          background: rgba(15, 23, 42, 0.7);
        }

        .checkbox-card.active {
          border-color: var(--accent-teal);
          background: linear-gradient(135deg, rgba(45, 212, 191, 0.1), rgba(3, 7, 18, 0.6));
        }

        .chk-check {
          width: 18px;
          height: 18px;
          border-radius: 4px;
          border: 1px solid var(--border-gold-bright);
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-deep);
          color: var(--accent-teal);
          margin-top: 0.15rem;
        }

        .checkbox-card.active .chk-check {
          background: var(--accent-teal-dark);
          border-color: var(--accent-teal);
          color: var(--snow-white);
        }

        .chk-content h5 {
          font-size: 0.95rem;
          font-weight: 700;
          margin-bottom: 0.15rem;
        }

        .chk-content p {
          font-size: 0.8rem;
          line-height: 1.4;
        }

        .diet-form-grid {
          display: grid;
          grid-template-columns: 1fr 1.5fr;
          gap: 1.5rem;
        }

        @media (max-width: 576px) {
          .diet-form-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
        }

        /* Timeline / Itinerary Styling */
        .itinerary-header {
          margin-bottom: 2rem;
        }

        .itinerary-timeline {
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
          margin-bottom: 2rem;
          position: relative;
        }

        .timeline-day-card {
          padding: 2rem;
          display: grid;
          grid-template-columns: 1fr 3fr;
          gap: 2rem;
          position: relative;
        }

        @media (max-width: 768px) {
          .timeline-day-card {
            grid-template-columns: 1fr;
            gap: 1rem;
            padding: 1.5rem;
          }
        }

        .day-badge-container {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .day-num {
          font-family: var(--font-serif);
          font-size: 1.4rem;
          font-weight: 700;
          color: var(--accent-teal-bright);
        }

        .day-tag {
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--accent-rose);
          font-weight: 700;
        }

        .day-schedule-body {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .schedule-slot {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .schedule-slot.highlight {
          border-left: 2px solid var(--accent-teal-dark);
          padding-left: 1rem;
        }

        .time-lbl {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-muted);
          font-weight: 600;
        }

        .slot-desc {
          font-size: 0.95rem;
          color: var(--text-main);
          line-height: 1.5;
        }

        .itinerary-option-toggle {
          margin-top: 0.75rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .swap-icon {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--accent-teal);
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .toggle-buttons {
          display: flex;
          gap: 0.5rem;
        }

        .toggle-sub-btn {
          font-family: var(--font-body);
          font-size: 0.75rem;
          font-weight: 600;
          padding: 0.35rem 0.75rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border-gold);
          color: var(--text-muted);
          border-radius: var(--radius-full);
          cursor: pointer;
          transition: var(--transition-fast);
        }

        .toggle-sub-btn:hover {
          border-color: var(--accent-teal);
          color: var(--accent-teal);
        }

        .toggle-sub-btn.active {
          background: var(--accent-teal-dark);
          border-color: var(--accent-teal);
          color: var(--snow-white);
        }

        /* Checkout final page */
        .checkout-final-form {
          display: flex;
          flex-direction: column;
          gap: 2.25rem;
        }

        .checkout-section {
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          padding-bottom: 2rem;
        }

        .checkout-section h4 {
          font-size: 1.05rem;
          color: var(--accent-teal-bright);
          margin-bottom: 1.25rem;
          letter-spacing: 0.02em;
        }

        .card-input-box {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          background: rgba(3, 7, 18, 0.3);
          padding: 1.5rem;
          border-radius: var(--radius-sm);
          border: 1px solid rgba(255,255,255,0.03);
        }

        .card-minor-fields {
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          gap: 1.5rem;
        }

        .promo-inline {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .promo-inline input {
          flex: 1;
        }

        .applied-tag {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          background: rgba(45, 212, 191, 0.1);
          color: var(--accent-teal);
          border: 1px solid var(--border-gold-bright);
          padding: 0.75rem 1.25rem;
          border-radius: var(--radius-sm);
          font-size: 0.85rem;
          font-weight: 600;
        }

        .applied-tag .remove-btn {
          background: none;
          border: none;
          color: var(--accent-rose);
          font-weight: 700;
          cursor: pointer;
        }

        .promo-err {
          font-size: 0.8rem;
          color: var(--accent-rose);
          margin-top: 0.5rem;
          font-weight: 600;
        }

        .pay-action-btn {
          padding: 1.25rem;
          font-size: 1.05rem;
        }

        /* Success screen Dashboard */
        .success-dashboard {
          display: flex;
          flex-direction: column;
          gap: 3rem;
        }

        .success-banner {
          text-align: center;
          padding: 3rem;
        }

        .success-badge {
          width: 72px;
          height: 72px;
          border-radius: var(--radius-full);
          background: linear-gradient(135deg, var(--accent-teal), var(--accent-rose));
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
          box-shadow: 0 0 25px rgba(45, 212, 191, 0.3);
        }

        .sparkle-icon {
          color: var(--bg-deep);
        }

        .ref-code {
          display: inline-block;
          margin-top: 1rem;
          font-size: 0.95rem;
          padding: 0.4rem 1rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border-gold);
          border-radius: var(--radius-sm);
          color: var(--text-muted);
        }

        .ref-code strong {
          color: var(--accent-teal-bright);
          font-family: monospace;
          margin-left: 0.25rem;
          letter-spacing: 0.05em;
        }

        .success-grid {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 3rem;
          align-items: start;
        }

        @media (max-width: 992px) {
          .success-grid {
            grid-template-columns: 1fr;
            gap: 2.5rem;
          }
        }

        .success-card {
          padding: 2.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .success-card h3 {
          font-size: 1.25rem;
          color: var(--accent-teal-bright);
          border-bottom: 1px solid var(--border-gold);
          padding-bottom: 0.75rem;
          margin-bottom: 0.5rem;
        }

        .receipt-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          padding-bottom: 1.5rem;
        }

        .receipt-row {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
          font-size: 0.95rem;
        }

        .receipt-row .lbl {
          color: var(--text-muted);
        }

        .receipt-row.total {
          font-size: 1.3rem;
          font-family: var(--font-serif);
          color: var(--accent-teal);
          border-top: 1px solid var(--border-gold-bright);
          padding-top: 1rem;
          margin-top: 0.5rem;
        }

        .receipt-itinerary-scroller {
          max-height: 480px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          padding-right: 0.5rem;
        }

        .receipt-itinerary-scroller::-webkit-scrollbar {
          width: 6px;
        }

        .receipt-day-card {
          background: rgba(3, 7, 18, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.03);
          border-radius: var(--radius-sm);
          padding: 1.25rem;
        }

        .r-day-hdr {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
          padding-bottom: 0.5rem;
          margin-bottom: 0.75rem;
        }

        .r-day-badge {
          font-size: 0.75rem;
          font-weight: 700;
          background: var(--accent-teal-dark);
          color: var(--snow-white);
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
        }

        .r-day-title {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--accent-teal-bright);
        }

        .r-day-content {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          font-size: 0.85rem;
          line-height: 1.4;
        }

        .r-day-content p strong {
          color: var(--text-muted);
        }

        /* Sidebar summary billing */
        .booking-summary-sidebar {
          padding: 2.5rem;
          border: 1px solid var(--border-gold);
        }

        .summary-title {
          font-size: 1.3rem;
          color: var(--accent-teal);
          border-bottom: 1px solid var(--border-gold);
          padding-bottom: 0.75rem;
          margin-bottom: 1.5rem;
        }

        .summary-details {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          padding-bottom: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
          font-size: 0.85rem;
        }

        .summary-row .label {
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .summary-row .value {
          text-align: right;
          color: var(--text-main);
          font-weight: 500;
        }

        .summary-breakdown {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          padding-bottom: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .breakdown-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.95rem;
          color: var(--text-muted);
        }

        .breakdown-row.customization-charge {
          color: var(--accent-rose-bright);
        }

        .breakdown-row.discount {
          color: var(--accent-rose);
          font-weight: 600;
        }

        .breakdown-row.grand-total {
          font-size: 1.35rem;
          font-family: var(--font-serif);
          color: var(--accent-teal);
          font-weight: 700;
          margin-top: 0.5rem;
        }

        .booking-trust-points {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .trust-item {
          display: flex;
          gap: 0.75rem;
          font-size: 0.8rem;
          color: var(--text-muted);
          align-items: center;
        }

        .trust-item strong {
          color: var(--accent-teal);
        }

        /* Email preview screen styling */
        .email-preview-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(3, 7, 18, 0.9);
          backdrop-filter: blur(10px);
          z-index: 1500;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }

        .email-client-modal {
          width: 100%;
          max-width: 750px;
          height: 90vh;
          background: #0f172a;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: var(--radius-md);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          box-shadow: 0 25px 60px rgba(0,0,0,0.8);
        }

        .email-client-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #070b13;
          padding: 1rem 1.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .email-window-controls {
          display: flex;
          gap: 0.5rem;
        }

        .window-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          cursor: pointer;
        }

        .window-dot.red { background: #ef4444; }
        .window-dot.yellow { background: #f59e0b; }
        .window-dot.green { background: #10b981; }

        .email-window-title {
          font-size: 0.85rem;
          font-family: var(--font-body);
          font-weight: 500;
          color: var(--text-muted);
        }

        .close-preview {
          background: none;
          border: none;
          color: var(--text-muted);
          font-size: 1.5rem;
          cursor: pointer;
        }

        .close-preview:hover {
          color: var(--snow-white);
        }

        .email-client-meta {
          padding: 1.25rem 1.5rem;
          background: rgba(3, 7, 18, 0.4);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          font-size: 0.9rem;
        }

        .meta-line {
          display: flex;
          gap: 0.5rem;
        }

        .meta-lbl {
          color: var(--text-muted);
          width: 70px;
        }

        .meta-val {
          color: var(--text-main);
        }

        .email-client-body {
          flex: 1;
          overflow-y: auto;
          padding: 2rem;
          background: #1e293b;
        }

        .email-sim-toolbar {
          margin-bottom: 2rem;
          display: flex;
          justify-content: center;
        }

        .btn-sim-send {
          background: linear-gradient(135deg, var(--accent-rose), var(--accent-rose-dark));
          border: none;
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: var(--radius-sm);
          font-family: var(--font-body);
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          box-shadow: 0 4px 12px rgba(251, 113, 133, 0.3);
          transition: var(--transition-smooth);
        }

        .btn-sim-send:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(251, 113, 133, 0.4);
        }

        .email-sent-badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(16, 185, 129, 0.1);
          color: #34d399;
          border: 1px solid rgba(52, 211, 153, 0.3);
          padding: 0.75rem 1.5rem;
          border-radius: var(--radius-sm);
          font-size: 0.85rem;
          font-weight: 600;
        }

        /* Luxury newsletter layout */
        .newsletter-template {
          background: #ffffff;
          color: #1e293b;
          max-width: 600px;
          margin: 0 auto;
          border-radius: 8px;
          overflow: hidden;
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
          box-shadow: 0 4px 25px rgba(0,0,0,0.15);
        }

        .newsletter-header {
          background-color: #0f172a;
          color: #ffffff;
          padding: 2.5rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .newsletter-logo {
          font-family: var(--font-serif);
          font-size: 1.5rem;
          font-weight: 700;
          letter-spacing: 0.15em;
        }

        .newsletter-hdr-subtitle {
          font-size: 0.75rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #2dd4bf;
        }

        .newsletter-body {
          padding: 2.5rem;
        }

        .newsletter-body h2 {
          color: #0f172a;
          font-size: 1.6rem;
          margin-bottom: 1rem;
          font-family: Georgia, serif;
        }

        .newsletter-body h3 {
          color: #0f172a;
          font-size: 1.2rem;
          margin-top: 2rem;
          margin-bottom: 1rem;
          border-bottom: 2px solid #f1f5f9;
          padding-bottom: 0.5rem;
          font-family: Georgia, serif;
        }

        .newsletter-body p {
          color: #475569;
          font-size: 0.95rem;
          line-height: 1.6;
          margin-bottom: 1.25rem;
        }

        .newsletter-receipt-box {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          padding: 1.5rem;
          margin: 1.5rem 0;
        }

        .news-rec-title {
          font-weight: 700;
          font-size: 1rem;
          margin-bottom: 1rem;
          border-bottom: 1px solid #e2e8f0;
          padding-bottom: 0.5rem;
          color: #0f172a;
        }

        .news-rec-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.6rem;
          font-size: 0.9rem;
          color: #475569;
        }

        .text-teal-600 {
          color: #0d9488;
        }

        .newsletter-itinerary {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          margin: 1.5rem 0;
        }

        .newsletter-day {
          background: #f8fafc;
          border-left: 3px solid #0d9488;
          padding: 1rem 1.25rem;
          border-radius: 0 4px 4px 0;
        }

        .news-day-hdr {
          font-weight: 700;
          font-size: 0.95rem;
          color: #0f172a;
          margin-bottom: 0.5rem;
        }

        .news-day-slots {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          font-size: 0.85rem;
          color: #475569;
        }

        .newsletter-infobox {
          background: rgba(45, 212, 191, 0.05);
          border: 1px solid rgba(45, 212, 191, 0.2);
          border-radius: 6px;
          padding: 1.25rem 1.5rem;
          margin: 2rem 0 1.5rem;
        }

        .newsletter-infobox h4 {
          color: #0d9488;
          font-size: 0.95rem;
          margin-bottom: 0.5rem;
          font-family: inherit;
        }

        .newsletter-infobox ul {
          padding-left: 1.25rem;
          font-size: 0.85rem;
          color: #475569;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .newsletter-footer-text {
          font-size: 0.75rem !important;
          color: #94a3b8 !important;
          text-align: center;
          margin-top: 3rem;
          line-height: 1.5;
        }

        /* Helper Classes */
        .w-full { width: 100%; }
        .ml-auto { margin-left: auto; }
        .px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
        .pt-6 { padding-top: 1.5rem; }
        .border-t { border-top: 1px solid rgba(255,255,255,0.05); }
        .mt-6 { margin-top: 1.5rem; }
        .font-semibold { font-weight: 600; }
        .capitalize { text-transform: capitalize; }
        .spinner { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </section>
  );
};

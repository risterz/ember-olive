import { useEffect, useRef, useState } from 'react';
import { Check } from 'lucide-react';
import { gsap, ScrollTrigger } from '../animations/gsapSetup';
import { useMagnetic } from '../hooks/useMagnetic';
import SplitTextReveal from './SplitTextReveal';

interface FormData {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: string;
  requests: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  date?: string;
  time?: string;
  guests?: string;
}

const TIME_OPTIONS = [
  '5:30 PM',
  '6:00 PM',
  '6:30 PM',
  '7:00 PM',
  '7:30 PM',
  '8:00 PM',
  '8:30 PM',
  '9:00 PM',
  '9:30 PM',
  '10:00 PM',
];

const GUEST_OPTIONS = Array.from({ length: 10 }, (_, i) => i + 1);

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function Reservation() {
  const sectionRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  const submitMagnetic = useMagnetic<HTMLButtonElement>({ strength: 0.35 });

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: '',
    requests: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-reservation-animate]',
        { y: 35, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const animateFocusBorder = (element: HTMLElement, focused: boolean) => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    gsap.to(element, {
      borderColor: focused ? '#b87333' : 'rgba(245, 240, 232, 0.2)',
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  const handleFocus = (field: string, e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFocusedField(field);
    animateFocusBorder(e.currentTarget, true);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFocusedField(null);
    animateFocusBorder(e.currentTarget, false);
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field as keyof FormErrors];
        return next;
      });
    }
  };

  const validate = (): FormErrors => {
    const errs: FormErrors = {};
    if (!formData.name.trim()) errs.name = 'Name is required';
    if (!formData.email.trim()) {
      errs.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      errs.email = 'Please enter a valid email';
    }
    if (!formData.phone.trim()) errs.phone = 'Phone is required';
    if (!formData.date) errs.date = 'Date is required';
    if (!formData.time) errs.time = 'Please select a time';
    if (!formData.guests) errs.guests = 'Please select number of guests';
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitted(true);

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const tl = gsap.timeline();
    tl.to(formRef.current, {
      opacity: 0,
      y: -20,
      duration: 0.4,
      ease: 'power2.in',
      onComplete: () => {
        if (formRef.current) formRef.current.style.display = 'none';
      },
    });
    tl.fromTo(
      successRef.current,
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.4)' }
    );
  };

  const isLabelFloated = (field: string) =>
    focusedField === field || formData[field as keyof FormData] !== '';

  const labelClasses = (field: string) =>
    `absolute left-0 transition-all duration-200 pointer-events-none font-sans ${
      isLabelFloated(field)
        ? 'text-xs text-copper -top-3 font-medium'
        : 'text-sm text-cream/50 top-4'
    }`;

  const inputClasses =
    'w-full bg-transparent border-b border-cream/20 py-5 text-cream font-sans text-sm focus:outline-none transition-colors';

  return (
    <section
      id="reservation"
      ref={sectionRef}
      className="bg-charcoal py-48 md:py-64 lg:py-72 px-8 sm:px-16 md:px-24 border-t border-cream/5 relative overflow-hidden"
    >
      <div className="max-w-4xl mx-auto">
        {/* Chapter Header */}
        <div data-reservation-animate className="flex items-center gap-4 mb-8 justify-center">
          <span className="font-serif text-sm font-bold tracking-widest text-copper">
            08
          </span>
          <span className="h-px w-12 bg-copper/40" />
          <span className="font-sans text-xs uppercase tracking-[0.35em] text-cream-muted">
            Table Reservations
          </span>
        </div>

        <div data-reservation-animate className="text-center mb-24 md:mb-32">
          <SplitTextReveal
            tag="h2"
            text="Request a Table"
            className="font-serif text-4xl sm:text-5xl lg:text-6xl text-cream tracking-tight max-w-2xl mx-auto leading-[1.12]"
            wordClassName="text-cream"
          />
          <div className="w-20 h-px bg-copper mx-auto my-10" />
          <p className="font-sans text-sm sm:text-base text-cream-muted max-w-lg mx-auto leading-relaxed">
            Reservations are released 30 days in advance. For parties exceeding six guests, please reach out to our concierge.
          </p>
        </div>

        <form
          ref={formRef}
          onSubmit={handleSubmit}
          noValidate
          className={submitted ? 'hidden' : ''}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 sm:gap-x-16 gap-y-12 sm:gap-y-14">
            {/* Name */}
            <div data-reservation-animate className="relative">
              <label htmlFor="res-name" className={labelClasses('name')}>
                Full Name
              </label>
              <input
                id="res-name"
                type="text"
                required
                className={inputClasses}
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                onFocus={(e) => handleFocus('name', e)}
                onBlur={handleBlur}
              />
              {errors.name && (
                <p className="text-red-400 text-xs mt-1.5">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div data-reservation-animate className="relative">
              <label htmlFor="res-email" className={labelClasses('email')}>
                Email Address
              </label>
              <input
                id="res-email"
                type="email"
                required
                className={inputClasses}
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                onFocus={(e) => handleFocus('email', e)}
                onBlur={handleBlur}
              />
              {errors.email && (
                <p className="text-red-400 text-xs mt-1.5">{errors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div data-reservation-animate className="relative">
              <label htmlFor="res-phone" className={labelClasses('phone')}>
                Contact Number
              </label>
              <input
                id="res-phone"
                type="tel"
                required
                className={inputClasses}
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                onFocus={(e) => handleFocus('phone', e)}
                onBlur={handleBlur}
              />
              {errors.phone && (
                <p className="text-red-400 text-xs mt-1.5">{errors.phone}</p>
              )}
            </div>

            {/* Date */}
            <div data-reservation-animate className="relative">
              <label htmlFor="res-date" className={labelClasses('date')}>
                Reservation Date
              </label>
              <input
                id="res-date"
                type="date"
                required
                className={`${inputClasses} [color-scheme:dark]`}
                value={formData.date}
                onChange={(e) => handleChange('date', e.target.value)}
                onFocus={(e) => handleFocus('date', e)}
                onBlur={handleBlur}
              />
              {errors.date && (
                <p className="text-red-400 text-xs mt-1.5">{errors.date}</p>
              )}
            </div>

            {/* Time */}
            <div data-reservation-animate className="relative">
              <label htmlFor="res-time" className={labelClasses('time')}>
                Preferred Seating
              </label>
              <select
                id="res-time"
                required
                className={`${inputClasses} appearance-none cursor-pointer`}
                value={formData.time}
                onChange={(e) => handleChange('time', e.target.value)}
                onFocus={(e) => handleFocus('time', e)}
                onBlur={handleBlur}
              >
                <option value="" disabled hidden />
                {TIME_OPTIONS.map((t) => (
                  <option key={t} value={t} className="bg-charcoal text-cream py-2">
                    {t}
                  </option>
                ))}
              </select>
              {errors.time && (
                <p className="text-red-400 text-xs mt-1.5">{errors.time}</p>
              )}
            </div>

            {/* Guests */}
            <div data-reservation-animate className="relative">
              <label htmlFor="res-guests" className={labelClasses('guests')}>
                Number of Guests
              </label>
              <select
                id="res-guests"
                required
                className={`${inputClasses} appearance-none cursor-pointer`}
                value={formData.guests}
                onChange={(e) => handleChange('guests', e.target.value)}
                onFocus={(e) => handleFocus('guests', e)}
                onBlur={handleBlur}
              >
                <option value="" disabled hidden />
                {GUEST_OPTIONS.map((n) => (
                  <option key={n} value={n} className="bg-charcoal text-cream py-2">
                    {n} {n === 1 ? 'Guest' : 'Guests'}
                  </option>
                ))}
              </select>
              {errors.guests && (
                <p className="text-red-400 text-xs mt-1.5">{errors.guests}</p>
              )}
            </div>

            {/* Special Requests */}
            <div data-reservation-animate className="relative md:col-span-2 pt-2">
              <label htmlFor="res-requests" className={labelClasses('requests')}>
                Special Requests or Dietary Requirements
              </label>
              <textarea
                id="res-requests"
                rows={3}
                className={`${inputClasses} resize-none`}
                value={formData.requests}
                onChange={(e) => handleChange('requests', e.target.value)}
                onFocus={(e) => handleFocus('requests', e)}
                onBlur={handleBlur}
              />
            </div>
          </div>

          <div data-reservation-animate className="text-center mt-16 md:mt-20">
            <button
              ref={submitMagnetic.ref}
              type="submit"
              className="bg-copper text-charcoal px-14 py-4 font-sans text-xs tracking-[0.25em] uppercase font-semibold hover:bg-copper-light transition-colors cursor-pointer shadow-lg shadow-copper/20 will-change-transform"
            >
              <span ref={submitMagnetic.textRef} className="pointer-events-none inline-block">
                Request a Table
              </span>
            </button>
          </div>
        </form>

        {submitted && (
          <div ref={successRef} className="text-center py-20 bg-charcoal-light/60 p-12 border border-cream/10">
            <div className="w-16 h-16 rounded-full border-2 border-copper flex items-center justify-center mx-auto mb-8">
              <Check className="w-8 h-8 text-copper" />
            </div>
            <h3 className="font-serif text-3xl sm:text-4xl text-cream mb-4">
              Request Received
            </h3>
            <p className="font-sans text-cream-dark text-base max-w-md mx-auto leading-relaxed">
              We look forward to welcoming you to Ember &amp; Olive. Our concierge will confirm your booking within 2 hours.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

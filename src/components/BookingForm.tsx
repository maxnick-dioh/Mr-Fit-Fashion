"use client";

import { useEffect, useState } from "react";

export default function BookingForm() {
  const [submitted, setSubmitted] = useState(false);
  const [minDate, setMinDate] = useState("");

  useEffect(() => {
    setMinDate(new Date().toISOString().split("T")[0]);
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const appointment = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      service: formData.get("service"),
      date: formData.get("date"),
      time: formData.get("time"),
      message: formData.get("message"),
    };

    setSubmitted(false);

    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(appointment),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Please check your information.");
      }

      setSubmitted(true);
      form.reset();
    } catch (error) {
      console.error("Appointment submission failed:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    }
  }

  return (
    <section id="contact" className="contact-section">
      <p className="eyebrow">YOUR STYLE JOURNEY STARTS HERE</p>

      <h2>Let's Create Something Exceptional.</h2>

      <p className="booking-intro">
        Tell us what you have in mind. We'll review your request and contact you
        to discuss your fitting or consultation.
      </p>

      {submitted ? (
        <div className="booking-success" role="status">
          <h3>Thank you for your request!</h3>
          <p>
            Your appointment request has been received and we will contact you
            shortly.
          </p>
          <button
            type="button"
            className="button button-gold"
            onClick={() => setSubmitted(false)}
          >
            Make Another Request
          </button>
        </div>
      ) : (
        <form className="booking-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="customer-name">Full name</label>
            <input
              id="customer-name"
              name="name"
              type="text"
              placeholder="Enter your full name"
              autoComplete="name"
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="customer-email">Email address</label>
            <input
              id="customer-email"
              name="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="customer-phone">Phone number</label>
            <input
              id="customer-phone"
              name="phone"
              type="tel"
              placeholder="Your contact number"
              autoComplete="tel"
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="fashion-service">Service required</label>
            <select
              id="fashion-service"
              name="service"
              defaultValue=""
              required
            >
              <option value="" disabled>
                Select a service
              </option>
              <option value="Suits">Bespoke Suits</option>
              <option value="Native Wear">Native Wear</option>
              <option value="Senator Styles">Senator Styles</option>
              <option value="English Wear">English Wear</option>
              <option value="Children's Wear">Children's Wear</option>
              <option value="Wardrobe Consulting">Wardrobe Consulting</option>
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="appointment-date">Preferred date</label>
            <input
              id="appointment-date"
              name="date"
              type="date"
              min={minDate || undefined}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="appointment-time">Preferred time</label>
            <select
              id="appointment-time"
              name="time"
              defaultValue=""
              required
            >
              <option value="" disabled>
                Select a time
              </option>
              <option value="09:00">9:00 AM</option>
              <option value="10:00">10:00 AM</option>
              <option value="11:00">11:00 AM</option>
              <option value="12:00">12:00 PM</option>
              <option value="14:00">2:00 PM</option>
              <option value="15:00">3:00 PM</option>
              <option value="16:00">4:00 PM</option>
            </select>
          </div>

          <div className="form-field form-field-full">
            <label htmlFor="booking-message">
              Describe your outfit or requirements
            </label>
            <textarea
              id="booking-message"
              name="message"
              rows={4}
              placeholder="Tell us about the outfit, event, fabric or style you have in mind..."
            />
          </div>

          <button type="submit" className="button button-gold form-submit">
            Request an Appointment ↗
          </button>

          <p className="form-disclaimer">
            Submitting this demonstration form does not yet book an appointment.
            Availability will need to be confirmed.
          </p>
        </form>
      )}
    </section>
  );
}
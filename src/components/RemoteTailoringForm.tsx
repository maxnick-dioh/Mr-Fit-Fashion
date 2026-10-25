"use client";

import { useState } from "react";

const measurementGroups = [
  {
    title: "General measurements",
    fields: [
      ["height", "Full height"],
      ["weight", "Weight (optional)"],
      ["head", "Head circumference"],
    ],
  },
  {
    title: "Neck, shoulders and chest",
    fields: [
      ["neck", "Neck circumference"],
      ["shoulders", "Shoulder width"],
      ["backWidth", "Back width"],
      ["chest", "Chest / bust circumference"],
      ["upperChest", "Upper chest"],
      ["underBust", "Underbust (if applicable)"],
      ["waist", "Waist circumference"],
      ["abdomen", "Abdomen circumference"],
      ["hips", "Hip / seat circumference"],
    ],
  },
  {
    title: "Arms and sleeves",
    fields: [
      ["armhole", "Armhole circumference"],
      ["upperArm", "Upper arm / bicep"],
      ["elbow", "Elbow circumference"],
      ["sleeve", "Sleeve length"],
      ["wrist", "Wrist circumference"],
      ["upperArm", "Upper arm / bicep"],
      ["armhole", "Armhole circumference"],
    ],
  },
  {
    title: "Upper-body lengths",
    fields: [
      ["frontLength", "Front length"],
      ["backLength", "Back length"],
      ["jacketLength", "Jacket length"],
      ["shoulderToWaist", "Shoulder to waist"],
      ["bustPoint", "Shoulder to bust point"],
      ["bustDistance", "Bust point to bust point"],
      ["topLength", "Top length"],
    ],
  },
  {
    title: "Trousers and legs",
    fields: [
      ["crotchDepth", "Crotch depth"],
      ["frontRise", "Front rise"],
      ["backRise", "Back rise"],
      ["inseam", "Inside leg / inseam"],
      ["outseam", "Outside leg / outseam"],
      ["thigh", "Thigh circumference"],
      ["knee", "Knee circumference"],
      ["calf", "Calf circumference"],
      ["ankle", "Ankle circumference"],
      ["trouserLength", "Full trouser length"],
      ["crotchDepth", "Crotch depth"],
      ["frontRise", "Front rise"],
      ["backRise", "Back rise"],
      ["trouserLength", "Full trouser length"],
    ],
  },
  {
    title: "Dresses, skirts and other lengths",
    fields: [
      ["waistToHem", "Waist to hem"],
      ["dressLength", "Full dress length"],
      ["skirtLength", "Skirt length"],
      ["shoulderToFloor", "Shoulder to floor"],
      ["dressLength", "Full dress length"],
      ["waistToHem", "Waist to hem"],
    ],
  },
] as const;

const garmentMeasurements: Record<string, string[]> = {
  Suit: [
    "height",
    "neck",
    "shoulders",
    "chest",
    "waist",
    "hips",
    "sleeve",
    "upperArm",
    "armhole",
    "jacketLength",
    "inseam",
    "outseam",
    "thigh",
  ],

  Native: [
    "height",
    "neck",
    "shoulders",
    "chest",
    "waist",
    "hips",
    "sleeve",
    "upperArm",
    "topLength",
    "trouserLength",
    "thigh",
  ],

  Senator: [
    "height",
    "neck",
    "shoulders",
    "chest",
    "waist",
    "hips",
    "sleeve",
    "upperArm",
    "topLength",
    "trouserLength",
    "thigh",
  ],

  English: [
    "height",
    "neck",
    "shoulders",
    "chest",
    "waist",
    "hips",
    "sleeve",
    "upperArm",
    "armhole",
    "jacketLength",
    "inseam",
    "outseam",
    "thigh",
  ],

  Dress: [
    "height",
    "shoulders",
    "chest",
    "waist",
    "hips",
    "sleeve",
    "armhole",
    "dressLength",
    "waistToHem",
    "bustPoint",
    "bustDistance",
  ],

  Children: [
    "height",
    "shoulders",
    "chest",
    "waist",
    "hips",
    "sleeve",
    "topLength",
    "trouserLength",
    "thigh",
  ],

  Trousers: [
    "waist",
    "hips",
    "crotchDepth",
    "frontRise",
    "backRise",
    "inseam",
    "outseam",
    "thigh",
    "knee",
    "calf",
    "ankle",
    "trouserLength",
  ],

  Other: [
    "height",
    "neck",
    "shoulders",
    "chest",
    "waist",
    "hips",
    "sleeve",
    "jacketLength",
    "dressLength",
    "inseam",
    "outseam",
    "trouserLength",
  ],
};

export default function RemoteTailoringForm() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [garment, setGarment] = useState("Suit");
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const data = new FormData(form);

    const hasMeasurement = measurementGroups.some((group) =>
      group.fields.some(([name]) => String(data.get(name) ?? "").trim() !== ""),
    );

    if (!hasMeasurement) {
      setError("Please enter at least one body measurement.");
      return;
    }

    setError("");
    setSubmitted(true);
    form.reset();
  }

  return (
    <section id="remote-tailoring" className="remote-section">
      <p className="eyebrow">MADE FOR YOU, WHEREVER YOU ARE</p>

      <h2>Custom Tailoring, Delivered to Your Door.</h2>

      <p className="remote-intro">
        Can&apos;t visit our atelier? Share your measurements, choose your
        outfit and tell us where to deliver it. Our designer will review your
        request before production begins.
      </p>

      {submitted ? (
        <div className="booking-success" role="status">
          <h3>Thank you for your interest!</h3>
          <p>
            Your form passed the browser submission step. Your information has
            not yet been saved or sent to Maxnick Couture. Online submission
            will be connected in a later step.
          </p>
          <button
            type="button"
            className="button button-gold"
            onClick={() => setSubmitted(false)}
          >
            Submit Another Request
          </button>
        </div>
      ) : (
        <form className="remote-form" onSubmit={handleSubmit}>
          <h3>1. Your contact details</h3>

          <div className="remote-grid">
            <label className="remote-field">
              Full name *
              <input name="name" required maxLength={100} autoComplete="name" />
            </label>

            <label className="remote-field">
              Email address *
              <input name="email" type="email" required autoComplete="email" />
            </label>

            <label className="remote-field">
              Phone / WhatsApp *
              <input name="phone" type="tel" required autoComplete="tel" />
            </label>

            <label className="remote-field">
              Measurement unit *
              <select name="unit" defaultValue="cm" required>
                <option value="cm">Centimeters (cm)</option>
                <option value="in">Inches (in)</option>
              </select>
            </label>
          </div>

          <h3>2. Your outfit</h3>

          <div className="remote-grid">
            <label className="remote-field">
              What would you like made? *
              <select
                name="garment"
                value={garment}
                onChange={(event) => setGarment(event.target.value)}
                required
              >
                <option value="Suit">Bespoke suit</option>
                <option value="Native">Native wear</option>
                <option value="Senator">Senator style</option>
                <option value="English">English wear</option>
                <option value="Dress">Dress / skirt</option>
                <option value="Children">Children&apos;s wear</option>
                <option value="Trousers">Trousers only</option>
                <option value="Other">Other custom outfit</option>
              </select>
            </label>

            <label className="remote-field">
              Who is the outfit for?
              <select name="wearer" defaultValue="adult">
                <option value="adult">Adult</option>
                <option value="child">Child</option>
              </select>
            </label>

            <label className="remote-field remote-full">
              Describe your design
              <textarea
                name="design"
                rows={3}
                maxLength={2000}
                placeholder="Describe the style, fabric, colour and occasion."
              />
            </label>
          </div>

          <h3>3. Your body measurements</h3>

          <div className="measurement-guide">
            <h4>How to measure yourself</h4>

            <p>
              Use a soft measuring tape and wear light clothing. Keep the tape
              level and comfortably snug, not tight. Record every measurement
              using the unit selected above.
            </p>

            <ul>
              <li>
                <strong>Chest or bust:</strong> Measure around the fullest part
                of your chest or bust.
              </li>
              <li>
                <strong>Waist:</strong> Measure around your natural waist.
              </li>
              <li>
                <strong>Hips:</strong> Measure around the fullest part of your
                hips and seat.
              </li>
              <li>
                <strong>Shoulders:</strong> Measure from one shoulder point to
                the other across your back.
              </li>
              <li>
                <strong>Sleeve:</strong> Measure from the shoulder point to your
                desired sleeve endpoint.
              </li>
              <li>
                <strong>Inseam:</strong> Measure from the crotch to the desired
                trouser hem.
              </li>
            </ul>

            <p>
              If possible, ask someone to help with shoulder, back, sleeve and
              trouser measurements. Your designer may request a second
              measurement check before production.
            </p>
          </div>
          {measurementGroups.map((group) => {
            const visibleFields = group.fields.filter(([name]) =>
              garmentMeasurements[garment]?.includes(name),
            );

            if (visibleFields.length === 0) return null;

            return (
              <div className="measurement-group" key={group.title}>
                <h4>{group.title}</h4>

                <div className="remote-grid">
                  {visibleFields.map(([name, label]) => (
                    <label className="remote-field" key={name}>
                      {label}

                      <input
                        name={name}
                        type="number"
                        min="0"
                        max="300"
                        step="0.1"
                        inputMode="decimal"
                        placeholder="Enter measurement"
                        required
                      />
                    </label>
                  ))}
                </div>
              </div>
            );
          })}

          <h3>4. Shipping destination</h3>

          <div className="remote-grid">
            <label className="remote-field">
              Country *
              <input
                name="country"
                required
                maxLength={100}
                autoComplete="country-name"
              />
            </label>

            <label className="remote-field">
              City / town *
              <input
                name="city"
                required
                maxLength={100}
                autoComplete="address-level2"
              />
            </label>

            <label className="remote-field remote-full">
              Full delivery address *
              <textarea
                name="address"
                required
                rows={3}
                maxLength={500}
                autoComplete="street-address"
                placeholder="Street, neighbourhood and other delivery details"
              />
            </label>

            <label className="remote-field">
              Postal code (if applicable)
              <input
                name="postalCode"
                maxLength={20}
                autoComplete="postal-code"
              />
            </label>

            <label className="remote-field">
              Preferred delivery method
              <select name="delivery" defaultValue="discuss">
                <option value="discuss">Discuss with designer</option>
                <option value="courier">Courier delivery</option>
                <option value="pickup">Arrange collection</option>
              </select>
            </label>
          </div>

          <label className="remote-consent">
            <input type="checkbox" name="consent" required />
            <span>
              I confirm that these measurements and delivery details are
              provided by me, and I agree that Maxnick Couture may use them to
              assess my tailoring request.
            </span>
          </label>

          {error && (
            <p className="remote-error" role="alert">
              {error}
            </p>
          )}

          <button type="submit" className="button button-gold remote-submit">
            Submit Tailoring Request
          </button>

          <p className="form-disclaimer">
            Submitting this demonstration form does not place an order or
            arrange shipping. Price, measurements, production and delivery must
            be confirmed.
          </p>
        </form>
      )}
    </section>
  );
}

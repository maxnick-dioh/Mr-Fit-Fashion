"use client";

import { useState } from "react";

const guides = [
  {
    id: "neck",
    name: "Neck circumference",
    description: "Wrap the tape around the base of the neck.",
    tip: "Keep one finger's ease under the tape. Do not pull tightly.",
    view: "FRONT VIEW",
  },
  {
    id: "chest",
    name: "Chest / bust",
    description: "Measure around the fullest part of the chest or bust.",
    tip: "Keep the tape horizontal around the body. Breathe normally.",
    view: "FRONT VIEW",
  },
  {
    id: "waist",
    name: "Natural waist",
    description: "Measure around the natural waistline.",
    tip: "Stand naturally. Do not suck in your stomach.",
    view: "FRONT VIEW",
  },
  {
    id: "hips",
    name: "Hips / seat",
    description: "Measure around the fullest part of the hips and seat.",
    tip: "Keep the tape level all the way around.",
    view: "FRONT VIEW",
  },
  {
    id: "shoulders",
    name: "Shoulder width",
    description: "Measure between the shoulder points across the back.",
    tip: "Ask someone to help you locate both shoulder points.",
    view: "BACK VIEW",
  },
  {
    id: "sleeve",
    name: "Sleeve length",
    description: "Measure from the shoulder point to the desired cuff.",
    tip: "Keep your arm slightly bent and relaxed.",
    view: "ARM VIEW",
  },
  {
    id: "inseam",
    name: "Inside leg",
    description: "Measure from the crotch to the desired trouser hem.",
    tip: "Ask someone to help. Do not measure while balancing on one foot.",
    view: "LEG VIEW",
  },
  {
    id: "outseam",
    name: "Outside leg",
    description: "Measure from the waist down the outside of the leg.",
    tip: "Follow the side of the leg to the intended trouser hem.",
    view: "LEG VIEW",
  },
];

export default function MeasurementGuide() {
  const [active, setActive] = useState("chest");
  const guide = guides.find((item) => item.id === active)!;

  return (
    <section className="measurement-guide-panel">
      <div className="measurement-guide-heading">
        <p className="eyebrow">YOUR PERSONAL FITTING GUIDE</p>
        <h3>Where to Measure</h3>
        <p>
          Choose a measurement to see where the tape should go.
        </p>
      </div>

      <div className="measurement-guide-layout">
        <nav
          className="measurement-guide-list"
          aria-label="Body measurements"
        >
          {guides.map((item, index) => (
            <button
              type="button"
              key={item.id}
              className={
                active === item.id
                  ? "measurement-guide-choice active"
                  : "measurement-guide-choice"
              }
              onClick={() => setActive(item.id)}
              aria-pressed={active === item.id}
            >
              <span className="measurement-number">
                {index + 1}
              </span>
              <span>{item.name}</span>
            </button>
          ))}
        </nav>

        <div className="measurement-guide-detail" aria-live="polite">
          <span className="measurement-view-label">
            {guide.view}
          </span>

          <div className={`measurement-illustration ${guide.id}`}>
            <svg
              viewBox="0 0 240 290"
              role="img"
              aria-label={`Illustration indicating the ${guide.name} measurement area`}
            >
              <circle cx="120" cy="35" r="23" className="body-fill" />
              <path
                d="M104 57 L101 72 L78 82 L57 105 L72 119 L91 100 L91 155 L81 206 L87 275 L108 275 L120 207 L132 275 L153 275 L159 206 L149 155 L149 100 L168 119 L183 105 L162 82 L139 72 L136 57"
                className="body-shape"
              />
              <path
                d="M102 74 Q120 85 138 74"
                className="body-line"
              />

              {active === "neck" ? (
                <ellipse cx="120" cy="67" rx="22" ry="6" className="tape-line" />
              ) : active === "chest" ? (
                <ellipse cx="120" cy="111" rx="42" ry="11" className="tape-line" />
              ) : active === "waist" ? (
                <ellipse cx="120" cy="151" rx="29" ry="8" className="tape-line" />
              ) : active === "hips" ? (
                <ellipse cx="120" cy="181" rx="39" ry="9" className="tape-line" />
              ) : active === "shoulders" ? (
                <>
                  <path d="M78 82 L162 82" className="tape-line" />
                  <circle cx="78" cy="82" r="4" className="tape-point" />
                  <circle cx="162" cy="82" r="4" className="tape-point" />
                </>
              ) : active === "sleeve" ? (
                <>
                  <path d="M78 84 L59 147" className="tape-line" />
                  <circle cx="78" cy="84" r="4" className="tape-point" />
                  <circle cx="59" cy="147" r="4" className="tape-point" />
                </>
              ) : active === "inseam" ? (
                <>
                  <path d="M120 205 L105 270" className="tape-line" />
                  <circle cx="120" cy="205" r="4" className="tape-point" />
                  <circle cx="105" cy="270" r="4" className="tape-point" />
                </>
              ) : (
                <>
                  <path d="M153 183 L153 270" className="tape-line" />
                  <circle cx="153" cy="183" r="4" className="tape-point" />
                  <circle cx="153" cy="270" r="4" className="tape-point" />
                </>
              )}
            </svg>
          </div>

          <h4>{guide.name}</h4>
          <p>{guide.description}</p>

          <div className="measurement-tip">
            <strong>Tailor's tip</strong>
            <p>{guide.tip}</p>
          </div>

          <p className="measurement-guide-disclaimer">
            This is a simplified placement illustration.
            Your designer may request additional measurements
            or a measurement check before cutting fabric.
          </p>
        </div>
      </div>
    </section>
  );
}
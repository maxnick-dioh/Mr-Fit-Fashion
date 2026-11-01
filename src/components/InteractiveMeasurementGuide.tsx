"use client";

import { useState } from "react";
import Image from "next/image";

const measurements = [
  {
    id: 1,
    name: "Neck",
    x: "30%",
    y: "17%",
    image: "/images/measurements/neck.jpeg",
    instruction:
      "Place the tape around the base of your neck, just above the collarbone. Keep it comfortably snug.",
    tip: "Allow enough room for comfortable breathing.",
    example: "neck",
  },
  {
    id: 2,
    name: "Shoulder width",
    x: "24%",
    y: "20%",
    image: "/images/measurements/shoulder.jpeg",
    instruction:
      "Measure across your upper back from the outer edge of one shoulder to the outer edge of the other.",
    tip: "Stand naturally and keep your shoulders relaxed.",
    example: "shoulders",
  },
  {
    id: 3,
    name: "Chest / Bust",
    x: "28%",
    y: "28%",
    image: "/images/measurements/Chest.jpeg",
    instruction:
      "Wrap the tape around the fullest part of your chest or bust. Keep the tape horizontal and pass it under your arms.",
    tip: "Breathe normally. Do not pull the tape tightly.",
    example: "chest",
  },
  {
    id: 4,
    name: "Waist",
    x: "28%",
    y: "40%",
    image: "/images/measurements/Waist.jpeg",
    instruction:
      "Measure around your natural waistline, usually the narrowest part of your torso.",
    tip: "Do not suck in your stomach. Stand naturally.",
    example: "waist",
  },
  {
    id: 5,
    name: "Hips",
    x: "28%",
    y: "48%",
    image: "/images/measurements/Hipes.jpeg",
    instruction:
      "Wrap the tape around the fullest part of your hips and seat. Keep the tape level all the way around.",
    tip: "Keep your feet together while measuring.",
    example: "hips",
  },
  {
    id: 6,
    name: "Sleeve length",
    x: "43%",
    y: "32%",
    image: "/images/measurements/Sleeve.jpeg",
    instruction:
      "Start at the shoulder point and measure along the outside of your slightly bent arm to your wrist.",
    tip: "Keep your arm relaxed and slightly bent.",
    example: "sleeve",
  },
  {
    id: 7,
    name: "Inseam",
    x: "32%",
    y: "72%",
    image: "/images/measurements/inseam.jpeg",
    instruction:
      "Measure from the crotch down the inside of your leg to the desired trouser hem.",
    tip: "Ask someone to help you take this measurement.",
    example: "inseam",
  },
  {
    id: 8,
    name: "Outseam",
    x: "40%",
    y: "72%",
    image: "/images/measurements/outseam.jpeg",
    instruction:
      "Measure from the side of your waist down the outside of your leg to the desired trouser hem.",
    tip: "Keep the tape following the outside of your leg.",
    example: "outseam",
  },
];

export default function InteractiveMeasurementGuide() {
  const [selected, setSelected] = useState(3);
  const [unit, setUnit] = useState("cm");
  const [values, setValues] = useState<Record<number, string>>({});

  const activeMeasurement =
    measurements.find((item) => item.id === selected)!;

  function updateMeasurement(value: string) {
    setValues((previous) => ({
      ...previous,
      [selected]: value,
    }));
  }

  return (
    <section className="interactive-guide">
      <div className="interactive-guide-heading">
        <p className="eyebrow">YOUR PERSONAL FITTING GUIDE</p>
        <h3>Learn Where to Measure</h3>
        <p>
          Select any numbered point on the diagram to see
          detailed instructions for taking that measurement.
        </p>
      </div>

      <div className="interactive-guide-layout">
        <div className="human-diagram">
          <Image
            src="/images/body-measurement-guide.jpeg"
            alt="Male and female body measurement diagram"
            width={1536}
            height={1024}
            priority
          />

          {measurements.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`diagram-marker ${
                selected === item.id ? "active" : ""
              }`}
              style={{
                left: item.x,
                top: item.y,
              }}
              onClick={() => setSelected(item.id)}
              aria-label={`Show ${item.name} instructions`}
              aria-pressed={selected === item.id}
            >
              {item.id}
            </button>
          ))}
        </div>

        <aside className="measurement-detail">
          <div className="measurement-number">
            {activeMeasurement.id}
          </div>

          <p className="eyebrow">MEASUREMENT INSTRUCTIONS</p>

          <h4>{activeMeasurement.name}</h4>

          {activeMeasurement.image ? (
  <div className="measurement-closeup">
    <Image
      src={activeMeasurement.image}
      alt={`${activeMeasurement.name} measurement illustration`}
      width={1200}
      height={1000}
      className="measurement-closeup-image"
    />
  </div>
) : (
  <div className="measurement-image-placeholder">
    Illustration coming soon.
  </div>
)}

          <p className="measurement-instruction">
            {activeMeasurement.instruction}
          </p>

          <div className="measurement-tip">
            <strong>Tailoring tip</strong>
            <p>{activeMeasurement.tip}</p>
          </div>

          <label className="measurement-value-label">
            Your measurement ({unit})
            <input
              type="number"
              min="0"
              max="300"
              step="0.1"
              value={values[selected] ?? ""}
              onChange={(event) =>
                updateMeasurement(event.target.value)
              }
              placeholder={`Enter ${activeMeasurement.name.toLowerCase()}`}
            />
          </label>

          <div className="measurement-navigation">
            <button
              type="button"
              disabled={selected === 1}
              onClick={() => setSelected((value) => value - 1)}
            >
              Previous
            </button>

            <span>{selected} of {measurements.length}</span>

            <button
              type="button"
              disabled={selected === measurements.length}
              onClick={() => setSelected((value) => value + 1)}
            >
              Next
            </button>
          </div>
        </aside>
      </div>

      <div className="measurement-selector">
        {measurements.map((item) => (
          <button
            type="button"
            key={item.id}
            className={selected === item.id ? "selected" : ""}
            onClick={() => setSelected(item.id)}
          >
            <span>{item.id}</span>
            {item.name}
            {values[item.id] && " ✓"}
          </button>
        ))}
      </div>
    </section>
  );
}
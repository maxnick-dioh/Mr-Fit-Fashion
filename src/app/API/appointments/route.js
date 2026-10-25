import { NextResponse } from "next/server";

const allowedServices = [
  "Suits",
  "Native Wear",
  "Senator Styles",
  "English Wear",
  "Children's Wear",
  "Wardrobe Consulting",
];

export async function POST(request) {
  try {
    const body = await request.json();

    const name = typeof body?.name === "string" ? body.name.trim() : "";
    const email = typeof body?.email === "string" ? body.email.trim() : "";
    const phone = typeof body?.phone === "string" ? body.phone.trim() : "";
    const service = typeof body?.service === "string" ? body.service.trim() : "";
    const date = typeof body?.date === "string" ? body.date.trim() : "";
    const time = typeof body?.time === "string" ? body.time.trim() : "";
    const message = typeof body?.message === "string" ? body.message.trim() : "";

    if (!name || !email || !phone || !service || !date || !time) {
      return NextResponse.json(
        { success: false, message: "Please complete all required fields." },
        { status: 400 },
      );
    }

    const isValidDate = !Number.isNaN(Date.parse(`${date}T00:00:00`));

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      name.length > 100 ||
      email.length > 254 ||
      phone.length > 30 ||
      !allowedServices.includes(service) ||
      !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
      !isValidDate ||
      !/^\d{2}:\d{2}$/.test(time) ||
      message.length > 2000
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Some information is invalid. Please check your entries.",
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Your appointment request was received by the server.",
      },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Unable to process your request. Please try again.",
      },
      { status: 400 },
    );
  }
}
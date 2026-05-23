import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    const trimmedEmail = email.trim().toLowerCase();

    // Check if duplicate
    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email: trimmedEmail },
    });

    if (existing) {
      return NextResponse.json(
        { error: "This email is already subscribed to AuraAI digest." },
        { status: 400 }
      );
    }

    // Save subscriber
    const newSubscriber = await prisma.newsletterSubscriber.create({
      data: {
        email: trimmedEmail,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Successfully subscribed to AuraAI Digest!",
      subscriber: newSubscriber,
    });
  } catch (error) {
    console.error("Newsletter subscription capture error:", error);
    return NextResponse.json(
      { error: "Internal database sync failure." },
      { status: 500 }
    );
  }
}

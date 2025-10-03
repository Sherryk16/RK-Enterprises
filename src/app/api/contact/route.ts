import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { firstName, lastName, email, phone, subject, message } = await request.json();

    // Validate environment variables
    if (!process.env.SENDER_EMAIL || !process.env.RECIPIENT_EMAIL) {
      throw new Error('Missing SENDER_EMAIL or RECIPIENT_EMAIL environment variables.');
    }

    // Send email using Resend
    await resend.emails.send({
      from: process.env.SENDER_EMAIL, // Must be a verified email in Resend
      to: process.env.RECIPIENT_EMAIL, // The email address where you want to receive messages
      subject: `Contact Form Submission: ${subject}`,
      html: `
        <h1>New Contact Form Submission</h1>
        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    return NextResponse.json({ message: 'Email sent successfully!' }, { status: 200 });
  } catch (error: any) {
    console.error('Error sending email:', error);
    return NextResponse.json({ message: 'Failed to send email.', error: error.message }, { status: 500 });
  }
}

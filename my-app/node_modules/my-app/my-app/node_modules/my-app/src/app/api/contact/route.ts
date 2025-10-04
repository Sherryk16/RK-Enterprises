import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    
    const { firstName, lastName, email, phone, subject, message } = await request.json();

    // No email sending for now, just acknowledge receipt.
    // The form data (firstName, lastName, email, phone, subject, message) is still received.
    console.log('Contact form received data:', { firstName, lastName, email, phone, subject, message });

    return NextResponse.json({ message: 'Contact form submitted successfully (email sending is temporarily disabled).' }, { status: 200 });
  } catch (error: unknown) {
    console.error('Error sending email:', error);
    let errorMessage = 'Failed to send email.';
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    }
    return NextResponse.json({ message: errorMessage, error: errorMessage }, { status: 500 });
  }
}

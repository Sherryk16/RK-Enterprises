import { NextResponse } from 'next/server';
// import { Resend } from 'resend'; // Commented out Resend import

// const resend = new Resend(process.env.RESEND_API_KEY); // Commented out Resend initialization

export async function POST(req: Request) {
  try {
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    // Commented out Resend email sending logic
    // const { data, error } = await resend.emails.send({
    //   from: 'RK Enterprise Contact <onboarding@resend.dev>',
    //   to: 'rk.enterprise.official@gmail.com',
    //   subject: `New Contact Form Submission: ${subject}`,
    //   replyTo: email,
    //   html: `
    //     <p><strong>Name:</strong> ${name}</p>
    //     <p><strong>Email:</strong> ${email}</p>
    //     <p><strong>Subject:</strong> ${subject}</p>
    //     <p><strong>Message:</strong></p>
    //     <p>${message}</p>
    //   `,
    // });

    // if (error) {
    //   console.error('Resend email error:', error);
    //   return NextResponse.json({ error: error.message }, { status: 500 });
    // }

    // Return a success response directly since email sending is disabled
    return NextResponse.json({ message: 'Contact form received (email sending disabled).' }, { status: 200 });
  } catch (error) {
    console.error('API Error in contact route:', error);
    return NextResponse.json({ error: 'Failed to process contact form.', details: (error as Error).message }, { status: 500 });
  }
}

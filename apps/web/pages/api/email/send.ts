import { NextApiRequest, NextApiResponse } from 'next';
import { resend } from '@/lib/resend';

export interface SendEmailRequest {
  to: string;
  subject: string;
  html: string;
  from?: string;
  replyTo?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { to, subject, html, from, replyTo }: SendEmailRequest = req.body;

    if (!to || !subject || !html) {
      return res.status(400).json({ error: 'Missing required fields: to, subject, html' });
    }

    const defaultFrom = process.env.NEXT_PUBLIC_APP_URL
      ? `CMP App <noreply@${process.env.NEXT_PUBLIC_APP_URL.replace('https://', '').replace('http://', '')}>`
      : 'CMP App <onboarding@resend.dev>';

    const { data, error } = await resend.emails.send({
      from: from || defaultFrom,
      to,
      subject,
      html,
      replyTo,
    });

    if (error) {
      console.error('Resend error:', error);
      return res.status(500).json({ error: 'Failed to send email', details: error.message });
    }

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Email send error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
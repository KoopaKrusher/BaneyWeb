// Vercel Serverless Function for RSVP submissions
// NOTE: This logs RSVPs to Vercel logs. For production, integrate with:
// - Formspree (formspree.io)
// - Google Sheets API
// - Airtable
// - Vercel KV/Postgres
// - Any database service

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }

  try {
    const { name, email, guests, dietary, message } = req.body;

    // Validate required fields
    if (!name || !email || !guests) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields'
      });
    }

    // Log RSVP data (visible in Vercel logs)
    const timestamp = new Date().toISOString();
    console.log('=== NEW RSVP SUBMISSION ===');
    console.log(`Timestamp: ${timestamp}`);
    console.log(`Name: ${name}`);
    console.log(`Email: ${email}`);
    console.log(`Guests: ${guests}`);
    console.log(`Dietary: ${dietary || 'None'}`);
    console.log(`Message: ${message || 'None'}`);
    console.log('===========================');

    // TODO: Add database integration here
    // Example with Vercel KV:
    // await kv.lpush('rsvps', JSON.stringify({ timestamp, name, email, guests, dietary, message }));

    // Example with Airtable:
    // await airtable.create([{ fields: { timestamp, name, email, guests, dietary, message } }]);

    res.status(200).json({
      success: true,
      message: 'Thank you for your RSVP! We can\'t wait to celebrate with you.'
    });

  } catch (error) {
    console.error('Error processing RSVP:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred. Please try again.'
    });
  }
}

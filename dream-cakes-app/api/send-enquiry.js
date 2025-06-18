// File: /api/send-enquiry.js

export default async function handler(request, response) {
  // Only allow POST requests
  if (request.method !== 'POST') {
    return response.status(405).json({ message: 'Method Not Allowed' });
  }

  // Get the cake order data sent from the front-end form
  const orderData = request.body;

  // IMPORTANT: Your secret Pabbly webhook URL is stored securely here
  // You will set this in your hosting provider's "Environment Variables" settings
  const PABBLY_WEBHOOK_URL = process.env.PABBLY_WEBHOOK_URL;

  if (!PABBLY_WEBHOOK_URL) {
    return response.status(500).json({ message: 'Server configuration error' });
  }

  try {
    // Securely forward the data to Pabbly from your backend
    const pabblyResponse = await fetch(PABBLY_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    // Check if Pabbly accepted the data
    if (!pabblyResponse.ok) {
        // You can log the error here on the server for debugging
        console.error('Pabbly webhook failed:', await pabblyResponse.text());
        throw new Error('Failed to send enquiry to the webhook.');
    }

    // Send a success response back to your front-end form
    return response.status(200).json({ message: 'Enquiry sent successfully!' });

  } catch (error) {
    console.error(error);
    return response.status(500).json({ message: 'An internal error occurred.' });
  }
}
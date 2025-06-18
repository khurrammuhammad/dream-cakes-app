// File: /api/send-enquiry.js

export default async function handler(request, response) {
  // Only allow POST requests for security
  if (request.method !== 'POST') {
    return response.status(405).json({ message: 'Method Not Allowed' });
  }

  // Get the cake order data sent from the front-end form
  const orderData = request.body;

  // Your secret Pabbly webhook URL is retrieved securely from environment variables
  const PABBLY_WEBHOOK_URL = process.env.PABBLY_WEBHOOK_URL;

  if (!PABBLY_WEBHOOK_URL) {
    console.error("Webhook URL is not configured.");
    return response.status(500).json({ message: 'Server configuration error.' });
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

    if (!pabblyResponse.ok) {
        // Log the error on the server for your debugging
        console.error('Pabbly webhook failed:', await pabblyResponse.text());
        throw new Error('Failed to send enquiry to the webhook.');
    }

    // Send a success response back to your front-end form
    return response.status(200).json({ message: 'Enquiry sent successfully!' });

  } catch (error) {
    console.error("Error forwarding to Pabbly:", error.message);
    return response.status(500).json({ message: 'An internal error occurred.' });
  }
}

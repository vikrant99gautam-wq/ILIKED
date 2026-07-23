import { Resend } from 'resend';

// Only initialize if API key is present
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export const sendOrderConfirmationEmail = async (order: any) => {
  if (!resend) {
    console.warn("RESEND_API_KEY not found. Skipping email sending.");
    return { success: false, error: "API Key missing" };
  }

  try {
    // Generate Items HTML
    const itemsHtml = order.items
      .filter((item: any) => item.id !== 'SHIPPING-INFO' && item.id !== 'PAYMENT-INFO' && !String(item.id).startsWith('PROMO-'))
      .map((item: any) => `
        <tr style="border-bottom: 2px solid #000;">
          <td style="padding: 15px 5px;">
            <p style="margin: 0; font-weight: 900; font-size: 16px;">${item.name}</p>
            <p style="margin: 5px 0 0; font-size: 14px; color: #555;">Size: ${item.size} | Qty: ${item.quantity}</p>
          </td>
          <td style="padding: 15px 5px; text-align: right; font-weight: 900; font-size: 16px;">
            ₹${item.price * item.quantity}
          </td>
        </tr>
      `).join('');

    // Shipping details
    const shippingItem = order.items.find((i: any) => i.id === 'SHIPPING-INFO');
    const shippingHtml = shippingItem?.shipping_info ? `
      <div style="background-color: #f9f9f9; border: 3px solid #000; padding: 20px; margin-top: 30px;">
        <h3 style="margin: 0 0 10px; font-weight: 900; text-transform: uppercase;">Shipping Address</h3>
        <p style="margin: 0 0 5px; font-weight: bold;">${order.customer_name}</p>
        <p style="margin: 0 0 5px;">${shippingItem.shipping_info.address}</p>
        <p style="margin: 0 0 5px;">${shippingItem.shipping_info.city}, ${shippingItem.shipping_info.district}</p>
        <p style="margin: 0;">${shippingItem.shipping_info.state} - ${shippingItem.shipping_info.zip}</p>
        <p style="margin: 10px 0 0; font-weight: bold;">Phone: ${shippingItem.shipping_info.phone}</p>
      </div>
    ` : '';

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Order Confirmation - I LIKED</title>
      </head>
      <body style="font-family: Arial, sans-serif; background-color: #ffffff; color: #000000; padding: 0; margin: 0; line-height: 1.5;">
        <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <!-- Header -->
          <div style="text-align: center; margin-bottom: 40px;">
            <a href="https://iliked.in" style="text-decoration: none; color: inherit;">
              <h1 style="font-size: 40px; font-weight: 900; margin: 0; letter-spacing: 2px;">I LIKED</h1>
            </a>
            <p style="font-weight: bold; text-transform: uppercase; margin-top: 10px; background-color: #000; color: #fff; display: inline-block; padding: 5px 15px;">Order Confirmed</p>
          </div>

          <p style="font-size: 18px; font-weight: bold;">Yo ${order.customer_name.split(' ')[0]},</p>
          <p style="font-size: 16px;">Thanks for joining the cult. Your payment was successful and we're getting your drip ready to ship.</p>
          
          <div style="background-color: #FFD700; border: 4px solid #000; padding: 20px; margin: 30px 0; box-shadow: 6px 6px 0 #000;">
            <h2 style="margin: 0 0 15px; font-weight: 900; text-transform: uppercase; border-bottom: 3px solid #000; padding-bottom: 10px;">Order Details</h2>
            <p style="margin: 0 0 20px; font-weight: bold;">Order ID: #${order.id.slice(-6)}</p>
            
            <table style="width: 100%; border-collapse: collapse;">
              ${itemsHtml}
              <tr>
                <td style="padding: 20px 5px 5px; font-weight: 900; font-size: 20px;">TOTAL</td>
                <td style="padding: 20px 5px 5px; text-align: right; font-weight: 900; font-size: 24px; color: #E53E3E;">₹${order.total}</td>
              </tr>
            </table>
          </div>

          ${shippingHtml}

          <div style="margin-top: 40px; text-align: center; border-top: 3px dashed #000; padding-top: 30px;">
            <p style="font-weight: 900; text-transform: uppercase; font-size: 20px;">Wear What You Like.</p>
            <p style="color: #666; font-size: 12px; margin-top: 20px;">If you have any questions, reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send email using Resend
    // By default, Resend domains are sandbox, so you can only send to your verified email
    // Or you can use onboarding@resend.dev as the from address during testing
    const data = await resend.emails.send({
      from: 'I LIKED <onboarding@resend.dev>',
      to: [order.email],
      subject: `Order Confirmed: #${order.id.slice(-6)} - I LIKED`,
      html: htmlContent,
    });

    console.log("Email sent successfully:", data);
    return { success: true, data };
  } catch (error) {
    console.error("Failed to send email:", error);
    return { success: false, error };
  }
};

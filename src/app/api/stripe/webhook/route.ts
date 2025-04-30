import { handleStripeWebhook } from "@/server/actions/user/bookingManagement/book-session.server-action";


export async function POST(req: Request) {
  try {

   
    return await handleStripeWebhook(req);
  } catch (error) {
    console.error('Webhook error:', error);
    return new Response('Webhook error', { status: 400 });
  }
}
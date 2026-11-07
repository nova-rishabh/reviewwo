import { NextResponse } from 'next/server';
import { loadData, saveData, authenticateRequest } from '../../../../src/lib/store.js';

export async function POST(request) {
  const user = authenticateRequest(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { reviewId, customReply } = await request.json();
    const reviews = loadData('reviews.json', []);
    const review = reviews.find(r => r.id === reviewId && r.userId === user.id);

    if (!review) {
      return NextResponse.json({ error: 'Review not found.' }, { status: 404 });
    }

    const businessName = user.businessName || 'Management';
    const replyText = customReply || 
      `Thank you so much ${review.author}! We truly appreciate your feedback and hope to welcome you back again soon! — Team at ${businessName}`;

    review.reply = replyText;
    review.repliedAt = new Date().toISOString();
    review.replyStatus = 'autopilot_sent';

    saveData('reviews.json', reviews);
    return NextResponse.json({ success: true, review });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

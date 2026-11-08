import { NextResponse } from 'next/server';
import { loadData, saveData, authenticateRequest } from '../../../../src/lib/store.js';
import { aiEnabled, writeOwnerReply } from '../../../../src/lib/ai.js';
import { hit } from '../../../../src/lib/rateLimit.js';

export async function POST(request) {
  const user = authenticateRequest(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { reviewId, customReply } = await request.json();
    const reviews = loadData('reviews.json', []);
    const review = reviews.find((r) => r.id === reviewId && r.userId === user.id);

    if (!review) {
      return NextResponse.json({ error: 'Review not found.' }, { status: 404 });
    }

    const users = loadData('users.json', []);
    const record = users.find((u) => u.id === user.id) || {};
    const businessName = record.brandName || record.businessName || 'Management';

    let replyText = String(customReply || '').trim().slice(0, 2000);
    let ai = false;
    if (!replyText && aiEnabled() && hit(`ai:reply:${user.id}`, 30, 60 * 60 * 1000).ok) {
      try {
        replyText = await writeOwnerReply({
          businessName,
          author: review.author,
          rating: review.rating,
          text: review.text || review.comment || '',
        });
        ai = Boolean(replyText);
      } catch (err) {
        console.error('[ai] owner reply failed:', err?.status || '', err?.message || err);
      }
    }
    if (!replyText) {
      replyText = `Thank you so much ${review.author || ''}! We truly appreciate your feedback and hope to welcome you back again soon! — Team at ${businessName}`;
    }

    review.reply = replyText;
    review.repliedAt = new Date().toISOString();
    review.replyStatus = 'autopilot_sent';

    saveData('reviews.json', reviews);
    return NextResponse.json({ success: true, review, ai });
  } catch (err) {
    return NextResponse.json({ error: 'Could not write a reply. Please try again.' }, { status: 500 });
  }
}

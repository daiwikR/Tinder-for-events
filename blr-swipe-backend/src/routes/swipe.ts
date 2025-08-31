import { Router } from 'express';
import Swipe from '../models/Swipe';
import Card from '../models/Card';
import { getOrCreateUserId } from '../utils/user';

const router = Router();

router.post('/', async (req, res) => {
  const { cardId, action } = req.body || {};
  if (!cardId || !['like', 'dislike'].includes(action)) {
    return res.status(400).json({ error: 'Invalid payload' });
  }

  const uid = getOrCreateUserId(req, res);

  const existing = await Swipe.findOne({ userId: uid, cardId });
  if (existing) {
    if (existing.action !== action) {
      // Decrement the previous action's count
      await Card.findByIdAndUpdate(cardId, {
        $inc: existing.action === 'like' ? { likedCount: -1 } : { dislikedCount: -1 }
      });
      existing.action = action;
      await existing.save();
    }
  } else {
    await Swipe.create({ userId: uid, cardId, action });
  }

  // Increment the new action's count
  await Card.findByIdAndUpdate(cardId, {
    $inc: action === 'like' ? { likedCount: 1 } : { dislikedCount: 1 }
  });

  res.json({ ok: true });
});

export default router;

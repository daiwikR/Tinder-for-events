import { Router } from 'express';
import Swipe from '../models/Swipe';
import Card from '../models/Card';
import { getOrCreateUserId } from '../utils/user';

const router = Router();

router.post('/', async (req, res) => {
  const { cardId, action } = req.body || {};
  if (!cardId || !['like', 'join'].includes(action)) {
    return res.status(400).json({ error: 'Invalid payload' });
  }

  const uid = getOrCreateUserId(req, res);

  const existing = await Swipe.findOne({ userId: uid, cardId });
  if (existing) {
    if (existing.action !== action) {
      await Card.findByIdAndUpdate(cardId, {
        $inc: existing.action === 'like' ? { likedCount: -1 } : { joinedCount: -1 }
      });
      existing.action = action;
      await existing.save();
    }
  } else {
    await Swipe.create({ userId: uid, cardId, action });
  }

  await Card.findByIdAndUpdate(cardId, {
    $inc: action === 'like' ? { likedCount: 1 } : { joinedCount: 1 }
  });

  res.json({ ok: true });
});

export default router;

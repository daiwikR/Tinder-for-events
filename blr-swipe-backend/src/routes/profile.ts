import { Router } from 'express';
import Swipe from '../models/Swipe';
import Card from '../models/Card';
import { getOrCreateUserId } from '../utils/user';

const router = Router();

router.get('/', async (req, res) => {
  const uid = getOrCreateUserId(req, res);
  const likeSwipes = await Swipe.find({ userId: uid, action: 'like' }).sort({ createdAt: -1 }).lean();
  // Find 'dislike' actions instead of 'join'
  const dislikeSwipes = await Swipe.find({ userId: uid, action: 'dislike' }).sort({ createdAt: -1 }).lean();

  const likeIds = likeSwipes.map(s => s.cardId);
  const dislikeIds = dislikeSwipes.map(s => s.cardId);

  const [likes, dislikes] = await Promise.all([
    Card.find({ _id: { $in: likeIds } }).lean(),
    Card.find({ _id: { $in: dislikeIds } }).lean()
  ]);

  // Return a 'dislikes' array instead of 'joins'
  res.json({ likes, dislikes });
});

// The DELETE route from the previous request still works perfectly
router.delete('/swipes/:cardId', async (req, res) => {
    // ... no changes needed here
});

export default router;
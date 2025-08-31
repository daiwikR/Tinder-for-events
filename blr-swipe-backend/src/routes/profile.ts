import { Router } from 'express';
import Swipe from '../models/Swipe';
import Card from '../models/Card';
import { getOrCreateUserId } from '../utils/user';

const router = Router();

router.get('/', async (req, res) => {
  const uid = getOrCreateUserId(req, res);
  const likeSwipes = await Swipe.find({ userId: uid, action: 'like' }).sort({ createdAt: -1 }).lean();
  
  // UPDATED: Changed to find 'dislike' actions instead of 'join'
  const dislikeSwipes = await Swipe.find({ userId: uid, action: 'dislike' }).sort({ createdAt: -1 }).lean();

  const likeIds = likeSwipes.map(s => s.cardId);
  const dislikeIds = dislikeSwipes.map(s => s.cardId);

  const [likes, dislikes] = await Promise.all([
    Card.find({ _id: { $in: likeIds } }).lean(),
    Card.find({ _id: { $in: dislikeIds } }).lean()
  ]);

  // UPDATED: Return a 'dislikes' array instead of 'joins'
  res.json({ likes, dislikes });
});

router.delete('/swipes/:cardId', async (req, res) => {
  try {
    const uid = getOrCreateUserId(req, res);
    const { cardId } = req.params;

    const swipe = await Swipe.findOne({ userId: uid, cardId: cardId });

    if (!swipe) {
      return res.status(404).json({ error: 'Swipe not found for this user.' });
    }

    if (swipe.action === 'like') {
      await Card.findByIdAndUpdate(cardId, { $inc: { likedCount: -1 } });
    } else if (swipe.action === 'dislike') {
      await Card.findByIdAndUpdate(cardId, { $inc: { dislikedCount: -1 } });
    }
    
    await swipe.deleteOne();
    
    res.status(200).json({ ok: true, message: 'Swipe removed successfully.' });
  } catch (error) {
    console.error('Error removing swipe:', error);
    res.status(500).json({ error: 'Server error while removing swipe.' });
  }
});

export default router;
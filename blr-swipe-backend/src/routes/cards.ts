import { Router } from 'express';
import Card from '../models/Card';
import Swipe from '../models/Swipe';
import { getOrCreateUserId } from '../utils/user';

const router = Router();

router.get('/', async (req, res) => {
  const limit = Number((req.query.limit as string) || 15);
  const category = (req.query.category as string) || undefined;
  const uid = getOrCreateUserId(req, res);

  const swipedIds = await Swipe.find({ userId: uid }).distinct('cardId');
  const query: any = {};
  if (category) query.category = category;

  const cards = await Card.find(query)
    .where('_id').nin(swipedIds)
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  res.json({ cards });
});

export default router;

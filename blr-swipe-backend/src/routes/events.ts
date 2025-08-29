import { Router } from 'express';
import Card from '../models/Card';

const router = Router();

router.post('/', async (req, res) => {
  const { title, description, image, location, category, eventDate } = req.body || {};
  if (!title) return res.status(400).json({ error: 'Title required' });

  const doc = await Card.create({
    title,
    description: description || '',
    image: image || '',
    location: location || 'Bangalore',
    category: category || 'event',
    eventDate: eventDate ? new Date(eventDate) : undefined
  });

  res.json({ ok: true, card: doc });
});

export default router;

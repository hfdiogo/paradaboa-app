require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const { PrismaClient } = require('@prisma/client');
const { Expo } = require('expo-server-sdk');
const expo = new Expo();
const prisma = new PrismaClient();
const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });
app.use('/uploads', express.static(UPLOAD_DIR));
app.post('/upload', async (req,res) => {
  try {
    const { filename, base64 } = req.body || {};
    if (!base64) return res.status(400).json({ error: 'no_file' });
    const buff = Buffer.from(base64, 'base64');
    const safe = (filename || ('img_'+Date.now()+'.jpg')).replace(/[^a-zA-Z0-9_.-]/g,'');
    const target = path.join(UPLOAD_DIR, safe);
    fs.writeFileSync(target, buff);
    return res.status(201).json({ url: `/uploads/${safe}` });
  } catch (e) { console.error(e); res.status(500).json({ error: 'upload_failed' }); }
});

try {
  const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
  const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
  const REGION = process.env.AWS_REGION || 'sa-east-1';
  const BUCKET = process.env.S3_BUCKET;
  const PUBLIC_BASE = process.env.S3_PUBLIC_BASE;
  const s3 = new S3Client({ region: REGION });
  app.post('/upload/presign', async (req,res)=>{
    try{
      const { filename, contentType } = req.body || {};
      if (!filename) return res.status(400).json({ error:'missing_filename' });
      if (!BUCKET) return res.status(400).json({ error:'bucket_not_configured' });
      const key = `meals/${Date.now()}_${(filename||'img.jpg').replace(/[^a-zA-Z0-9_.-]/g,'')}`;
      const command = new PutObjectCommand({ Bucket: BUCKET, Key: key, ContentType: contentType || 'application/octet-stream' });
      const url = await getSignedUrl(s3, command, { expiresIn: 300 });
      const publicUrl = PUBLIC_BASE ? `${PUBLIC_BASE}/${key}` : null;
      res.status(201).json({ url, key, publicUrl });
    } catch(e){ console.error(e); res.status(500).json({ error:'presign_failed' }); }
  });
} catch(e) { console.warn('S3 presign indisponível'); }

app.get('/health', (_req,res)=> res.json({ ok:true }));
function rid(){ return Math.random().toString(36).slice(2)+Math.random().toString(36).slice(2); }

app.post('/meals', async (req,res)=>{
  try{
    const d = req.body || {};
    const meal = await prisma.meals.create({ data: {
      id: rid(), host_id: 'demo-host', mode: d.mode, title: d.title, description: d.description,
      photo_url: d.photo_url || null, price_cents: d.price_cents, qty_total: d.qty_total, qty_available: d.qty_total,
      address_text: d.address_text, lat: d.lat, lng: d.lng, place_id: d.place_id || null,
      start_time: d.start_time ? new Date(d.start_time) : null,
      end_time: d.end_time ? new Date(d.end_time) : null,
      geofence_radius_m: d.geofence_radius_m || 3000,
      status: d.mode === 'instant' ? 'live' : 'scheduled'
    }});
    res.status(201).json(meal);
  } catch(e){ console.error(e); res.status(400).json({ error:'invalid_request', detail:e.message }); }
});

app.get('/meals', async (req,res)=>{
  const { mode } = req.query;
  const meals = await prisma.meals.findMany({ where: { mode: mode || undefined }, orderBy: { created_at:'desc' }, take: 100 });
  res.json(meals);
});

app.get('/meals/:id', async (req,res)=>{
  const meal = await prisma.meals.findUnique({ where: { id: req.params.id }});
  if (!meal) return res.status(404).json({ error:'not_found' });
  res.json(meal);
});

app.post('/reservations', async (req,res)=>{
  try{
    const { meal_id, qty, beverage, mode } = req.body;
    const meal = await prisma.meals.findUnique({ where: { id: meal_id }});
    if (!meal || meal.qty_available < qty) return res.status(400).json({ error: 'unavailable' });
    const r = await prisma.reservations.create({ data: {
      id: rid(), meal_id, buyer_id: 'demo-buyer', qty, beverage, mode,
      price_cents_total: meal.price_cents * qty, payment_status: 'pending',
      qr_code: 'demo-qr', pickup_code: String(Math.floor(100000+Math.random()*899999))
    }});
    await prisma.meals.update({ where: { id: meal_id }, data: { qty_available: { decrement: qty }}});
    res.status(201).json(r);
  } catch(e){ console.error(e); res.status(400).json({ error:'invalid_request' }); }
});

app.post('/payments/pix', async (req,res)=>{
  const { reservation_id } = req.body || {};
  res.status(201).json({ payment: { id: rid(), reservation_id, method:'pix', status:'pending', amount_cents: 2200 }, qr_code:'demo-qr', copia_cola:'00020126...' });
});

app.post('/notifications/register-token', async (req,res)=>{
  try{
    const { expo_token, platform, user_id } = req.body || {};
    if (!expo_token) return res.status(400).json({ error:'missing_token' });
    await prisma.device_tokens.upsert({ where: { expo_token }, update: { platform, user_id }, create: { id: rid(), expo_token, platform, user_id: user_id || 'demo-user' } });
    res.status(201).json({ ok:true });
  }catch(e){ console.error(e); res.status(500).json({ error:'register_failed' }); }
});

app.post('/notifications/broadcast', async (req,res)=>{
  try{
    const { title, body } = req.body || {};
    const tokens = await prisma.device_tokens.findMany({});
    const messages = tokens.map(t => (Expo.isExpoPushToken(t.expo_token) ? { to: t.expo_token, sound:'default', title, body } : null)).filter(Boolean);
    const chunks = expo.chunkPushNotifications(messages);
    for (let chunk of chunks) { try { await expo.sendPushNotificationsAsync(chunk); } catch(e){ console.error(e); } }
    res.json({ sent: messages.length });
  }catch(e){ console.error(e); res.status(500).json({ error:'broadcast_failed' }); }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, ()=> console.log('API running on :' + PORT));

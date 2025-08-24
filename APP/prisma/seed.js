const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
function rid(){ return Math.random().toString(36).slice(2)+Math.random().toString(36).slice(2); }
async function main(){
  console.log('Seeding...');
  await prisma.users.upsert({ where:{ id:'demo-host' }, update:{}, create:{ id:'demo-host', name:'João Anfitrião', phone:'+550000000001', role:'both', rating:4.8 }});
  await prisma.users.upsert({ where:{ id:'demo-buyer' }, update:{}, create:{ id:'demo-buyer', name:'Maria Compradora', phone:'+550000000002', role:'buyer', rating:4.7 }});

  const data = [
    { title: 'Arroz Carreteiro POA',        lat: -30.0346, lng: -51.2177, addr: 'Posto Sul – BR-290 Km 5, Porto Alegre/RS', price: 2200 },
    { title: 'Feijão Tropeiro Curitiba',    lat: -25.4284, lng: -49.2733, addr: 'Posto BR – BR-116 Km 122, Curitiba/PR',    price: 2200 },
    { title: 'Marmita do João SP',          lat: -23.5505, lng: -46.6333, addr: 'Posto Centro – SP-010 Km 5, São Paulo/SP', price: 2700 },
    { title: 'Galinhada BH',                lat: -19.9167, lng: -43.9345, addr: 'Posto Mineiro – BR-040 Km 460, Belo Horizonte/MG', price: 2200 },
    { title: 'Moqueca Carioca',             lat: -22.9068, lng: -43.1729, addr: 'Posto Rio – BR-101 Km 120, Rio de Janeiro/RJ', price: 2700 },
    { title: 'Panelada Goiânia',            lat: -16.6864, lng: -49.2643, addr: 'Posto Goiás – BR-153 Km 500, Goiânia/GO', price: 2200 },
    { title: 'Feijoada Brasília',           lat: -15.7939, lng: -47.8828, addr: 'Posto DF – BR-020 Km 20, Brasília/DF',     price: 2700 },
    { title: 'Bobó de Camarão Salvador',    lat: -12.9777, lng: -38.5016, addr: 'Posto Bahia – BR-324 Km 10, Salvador/BA', price: 2700 },
    { title: 'Carne de Sol Recife',         lat: -8.0476,  lng: -34.8770, addr: 'Posto Nordeste – BR-232 Km 15, Recife/PE', price: 2700 },
    { title: 'Peixada Fortaleza',           lat: -3.7319,  lng: -38.5267, addr: 'Posto Ceará – BR-116 Km 10, Fortaleza/CE', price: 2700 },
  ];
  for (const m of data) {
    await prisma.meals.upsert({
      where: { id: m.title.toLowerCase().replace(/\s+/g, '-') },
      update: {},
      create: {
        id: m.title.toLowerCase().replace(/\s+/g, '-'),
        host_id: 'demo-host', mode: 'instant',
        title: m.title, description: 'Prato feito com acompanhamentos. Bebidas: suco, refrigerante, água, água com gás.',
        photo_url: null, price_cents: m.price, qty_total: 3, qty_available: 3,
        address_text: m.addr, lat: m.lat, lng: m.lng, geofence_radius_m: 2000, status: 'live'
      }
    });
  }
  console.log('Seed concluído.');
}
main().then(()=>process.exit(0)).catch(e=>{console.error(e);process.exit(1)});

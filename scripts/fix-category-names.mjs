/**
 * Fix category names (scraper mistakenly grabbed "Add to cart" button text)
 * and write proper EN/TR labels matching protedglobal.com.
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const file = path.join(ROOT, 'data', 'proted-categories.json')

const NAMES = {
  'carbon-foot': { en: 'Carbon Foot', tr: 'Karbon Ayak' },
  'prosthetic-foot': { en: 'Prosthetic Foot', tr: 'Protez Ayak' },
  'hydraulic-knee-joints': { en: 'Hydraulic Knee Joints', tr: 'Hidrolik Diz Eklemleri' },
  'pneumatic-knee-joints': { en: 'Pneumatic Knee Joints', tr: 'Pnömatik Diz Eklemleri' },
  'polycentric-knee-joint': { en: 'Polycentric Knee Joint', tr: 'Polisentrik Diz Eklemi' },
  'polycentric-disarticulation-knee-joint': {
    en: 'Polycentric Disarticulation Knee',
    tr: 'Polisentrik Dezartikülasyon Diz',
  },
  'monocentric-knee-joint': { en: 'Monocentric Knee Joint', tr: 'Monosenrik Diz Eklemi' },
  'microprocessor-knee-joint': {
    en: 'Microprocessor Knee Joint',
    tr: 'Mikroişlemcili Diz Eklemi',
  },
  'knee-joints': { en: 'Knee Joints', tr: 'Diz Eklemleri' },
  'hip-joints': { en: 'Hip Joints', tr: 'Kalça Eklemleri' },
  'silicone-liners': { en: 'Silicone Liners', tr: 'Silikon Linerlar' },
  'silicone-sleeve': { en: 'Silicone Sleeve', tr: 'Silikon Kolluk' },
  'pin-lock-systems': { en: 'Pin Lock Systems', tr: 'Pin Lock Sistemleri' },
  'active-vacuum-system': { en: 'Active Vacuum System', tr: 'Aktif Vakum Sistemi' },
  'adapter-tubes': { en: 'Adapter Tubes', tr: 'Adaptör Tüpler' },
  'adapters-and-structural-components': {
    en: 'Adapters & Structural Components',
    tr: 'Adaptörler & Yapısal Bileşenler',
  },
  'cosmetic-foams': { en: 'Cosmetic Foams', tr: 'Kozmetik Köpükler' },
  'socket-systems': { en: 'Socket Systems', tr: 'Soket Sistemleri' },
  'myoelectric-hand': { en: 'Myoelectric Hand', tr: 'Miyoelektrik El' },
  'prosthetic-hands': { en: 'Prosthetic Hands', tr: 'Protez Eller' },
  'cosmetic-gloves': { en: 'Cosmetic Gloves', tr: 'Kozmetik Eldivenler' },
  'elbow-shoulder-joints': { en: 'Elbow & Shoulder Joints', tr: 'Dirsek & Omuz Eklemleri' },
  'upper-extremity-parts': { en: 'Upper Extremity Parts', tr: 'Üst Ekstremite Parçaları' },
  'upper-extremity-prosthetics': {
    en: 'Upper Extremity Prosthetics',
    tr: 'Üst Ekstremite Protezleri',
  },
  'harness-systems': { en: 'Harness Systems', tr: 'Askı Sistemleri' },
  orthotics: { en: 'Orthotics', tr: 'Ortezler' },
  'orthotics-knee-joints': { en: 'Orthotics Knee Joints', tr: 'Ortez Diz Eklemleri' },
  'orthotics-ankle-joint': { en: 'Orthotics Ankle Joint', tr: 'Ortez Ayak Bileği' },
  'orthotics-hip-joint': { en: 'Orthotics Hip Joint', tr: 'Ortez Kalça Eklemi' },
  'lateral-bars': { en: 'Lateral Bars', tr: 'Lateral Barlar' },
  'kids-prosthetic-foot': { en: 'Kids Prosthetic Foot', tr: 'Çocuk Protez Ayak' },
  'kids-knee-joints': { en: 'Kids Knee & Hip Joints', tr: 'Çocuk Diz & Kalça' },
  'kids-connection-adapters': {
    en: 'Kids Connection Adapters',
    tr: 'Çocuk Bağlantı Adaptörleri',
  },
  'kids-adapter-tubes': { en: 'Kids Adapter Tubes', tr: 'Çocuk Adaptör Tüpler' },
  'kids-tube-adapters': { en: 'Kids Tube Adapters', tr: 'Çocuk Tüp Adaptörleri' },
  'kids-socket-adapters': { en: 'Kids Socket Adapters', tr: 'Çocuk Soket Adaptörleri' },
  'kids-pin-lock-system': { en: 'Kids Pin Lock System', tr: 'Çocuk Pin Lock' },
  'kids-cosmetic-foam': { en: 'Kids Cosmetic Foam', tr: 'Çocuk Kozmetik Köpük' },
  'tools-and-equipments': { en: 'Tools & Equipments', tr: 'Araçlar & Ekipmanlar' },
}

const ROOT_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const catImgDir = path.join(ROOT_DIR, 'public', 'categories')
const products = JSON.parse(
  fs.readFileSync(path.join(ROOT_DIR, 'data', 'proted-products.json'), 'utf8'),
)
const catFiles = fs.existsSync(catImgDir) ? fs.readdirSync(catImgDir) : []

function findCatFile(slug) {
  for (const ext of ['.jpg', '.jpeg', '.png', '.webp']) {
    if (catFiles.includes(`${slug}${ext}`)) return `/categories/${slug}${ext}`
  }
  return null
}

const productImageByCat = {}
for (const p of products) {
  const key = p.categorySlug || p.category
  if (
    key &&
    !productImageByCat[key] &&
    p.image &&
    !String(p.image).includes('placeholder')
  ) {
    productImageByCat[key] = p.image
  }
}

const cats = JSON.parse(fs.readFileSync(file, 'utf8'))
for (const c of cats) {
  const n = NAMES[c.id] || NAMES[c.slug]
  if (n) {
    c.name = n.en
    c.nameTr = n.tr
    c.description = `${n.en} — PROTED Global product range.`
    c.descriptionTr = `${n.tr} — PROTED Global ürün grubu.`
  } else {
    // fallback: humanize slug
    const human = String(c.id || c.slug)
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ')
    c.name = human
    c.nameTr = human
    c.description = `${human} — PROTED Global.`
    c.descriptionTr = `${human} — PROTED Global.`
  }

  // Restore / keep category images (scrape often left image empty)
  if (!c.image || !String(c.image).trim() || String(c.image).includes('placeholder')) {
    c.image =
      findCatFile(c.slug) ||
      findCatFile(c.id) ||
      productImageByCat[c.id] ||
      productImageByCat[c.slug] ||
      ''
  }
}

fs.writeFileSync(file, JSON.stringify(cats, null, 2), 'utf8')
console.log('Fixed', cats.length, 'categories')
console.log(cats.slice(0, 5).map((c) => `${c.id}: ${c.nameTr} → ${c.image}`).join('\n'))
const withImg = cats.filter((c) => c.image).length
console.log(`Images set: ${withImg}/${cats.length}`)

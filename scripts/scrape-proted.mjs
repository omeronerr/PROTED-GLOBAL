/**
 * Scrape all Proted Global categories + products into data/*.json
 * and download images into public/products + public/categories
 */
import fs from 'fs'
import path from 'path'
import https from 'https'
import http from 'http'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const OUT_DIR = path.join(ROOT, 'data')
const PROD_IMG = path.join(ROOT, 'public', 'products')
const CAT_IMG = path.join(ROOT, 'public', 'categories')

fs.mkdirSync(OUT_DIR, { recursive: true })
fs.mkdirSync(PROD_IMG, { recursive: true })
fs.mkdirSync(CAT_IMG, { recursive: true })

function fetchText(url, redirects = 0) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? https : http
    const req = lib.get(
      url,
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (compatible; ProtedCatalogBot/1.0; +local-dev)',
          Accept: 'text/html,*/*',
        },
        timeout: 25000,
      },
      (res) => {
        if (
          res.statusCode >= 300 &&
          res.statusCode < 400 &&
          res.headers.location &&
          redirects < 5
        ) {
          const next = new URL(res.headers.location, url).href
          res.resume()
          return resolve(fetchText(next, redirects + 1))
        }
        if (res.statusCode !== 200) {
          res.resume()
          return reject(new Error(`HTTP ${res.statusCode} for ${url}`))
        }
        const chunks = []
        res.on('data', (c) => chunks.push(c))
        res.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
      },
    )
    req.on('error', reject)
    req.on('timeout', () => {
      req.destroy()
      reject(new Error('timeout ' + url))
    })
  })
}

function downloadFile(url, dest) {
  return new Promise((resolve) => {
    if (fs.existsSync(dest) && fs.statSync(dest).size > 500) {
      return resolve(true)
    }
    const lib = url.startsWith('https') ? https : http
    const file = fs.createWriteStream(dest)
    const req = lib.get(url, { timeout: 30000 }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        file.close()
        fs.unlinkSync(dest)
        return resolve(downloadFile(new URL(res.headers.location, url).href, dest))
      }
      if (res.statusCode !== 200) {
        file.close()
        try { fs.unlinkSync(dest) } catch {}
        return resolve(false)
      }
      res.pipe(file)
      file.on('finish', () => {
        file.close()
        resolve(true)
      })
    })
    req.on('error', () => {
      try { file.close(); fs.unlinkSync(dest) } catch {}
      resolve(false)
    })
    req.on('timeout', () => {
      req.destroy()
      try { file.close(); fs.unlinkSync(dest) } catch {}
      resolve(false)
    })
  })
}

function decode(s) {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
}

function stripTags(s) {
  return decode(s.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim())
}

function unique(arr) {
  return [...new Set(arr)]
}

async function mapPool(items, concurrency, fn) {
  const results = new Array(items.length)
  let i = 0
  async function worker() {
    while (i < items.length) {
      const idx = i++
      results[idx] = await fn(items[idx], idx)
    }
  }
  await Promise.all(Array.from({ length: concurrency }, () => worker()))
  return results
}

async function main() {
  console.log('Fetching homepage…')
  const home = await fetchText('https://www.protedglobal.com/')
  let catUrls = unique(
    [...home.matchAll(/href="(https:\/\/www\.protedglobal\.com\/urunler\/[^"]+)"/g)].map(
      (m) => m[1],
    ),
  )

  console.log(`Found ${catUrls.length} category URLs`)

  const categories = []
  const productUrlToCat = new Map()

  for (const catUrl of catUrls) {
    try {
      const html = await fetchText(catUrl)
      const slugFull = catUrl.split('/urunler/')[1].replace(/\/$/, '')
      const slug = slugFull.split('/')[0]
      const idPart = slugFull.split('/')[1] || ''

      let name = slug
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ')
      // Prefer title from page heading that is NOT a button label
      const h1s = [...html.matchAll(/<h1[^>]*>([^<]+)<\/h1>/gi)].map((m) =>
        stripTags(m[1]),
      )
      const goodH1 = h1s.find(
        (t) => t && !/add to cart|sepete|buy now|order/i.test(t) && t.length < 80,
      )
      if (goodH1) name = goodH1
      else {
        // Use slug-based human name — ignore "Add to cart" crumbs
        name = slug
          .split('-')
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ')
      }

      const catImgM = html.match(
        /src="(https:\/\/www\.protedglobal\.com\/uploads\/images\/categories\/[^"]+)"/,
      )
      let image = ''
      if (catImgM) {
        const ext = path.extname(catImgM[1].split('?')[0]) || '.jpg'
        const dest = path.join(CAT_IMG, `${slug}${ext}`)
        await downloadFile(catImgM[1], dest)
        if (fs.existsSync(dest)) image = `/categories/${slug}${ext}`
      }

      const prods = unique([
        ...[...html.matchAll(/href="(https:\/\/www\.protedglobal\.com\/detay\/urunler\/[^"]+)"/g)].map(
          (m) => m[1],
        ),
        ...[...html.matchAll(/href="(\/detay\/urunler\/[^"]+)"/g)].map(
          (m) => `https://www.protedglobal.com${m[1]}`,
        ),
      ])

      for (const p of prods) productUrlToCat.set(p, slug)

      categories.push({
        id: slug,
        slug,
        siteId: idPart,
        name,
        nameTr: name,
        url: catUrl,
        image,
        productCount: prods.length,
        productUrls: prods,
      })
      console.log(`  CAT ${slug}: ${prods.length} products`)
    } catch (e) {
      console.log(`  FAIL cat ${catUrl}: ${e.message}`)
    }
  }

  const productUrls = unique([...productUrlToCat.keys()])
  console.log(`\nScraping ${productUrls.length} products…`)

  const products = await mapPool(productUrls, 8, async (url, idx) => {
    try {
      const html = await fetchText(url)
      const mUrl = url.match(/\/detay\/urunler\/([^/]+)\/(\d+)/)
      const slug = mUrl ? mUrl[1] : `product-${idx}`
      const siteId = mUrl ? mUrl[2] : String(idx)

      const h1 = html.match(/<h1[^>]*>([^<]+)<\/h1>/i)
      const name = h1 ? stripTags(h1[1]) : slug

      let sku = ''
      const skuMatch =
        html.match(/Stock Code[:\s]*<\/[^>]+>\s*([A-Z0-9][A-Z0-9.\-]*)/i) ||
        html.match(/Stock Code[:\s]*([A-Z0-9][A-Z0-9.\-]*)/i) ||
        html.match(/<h2[^>]*>\s*([A-Z0-9][A-Z0-9.\-]{2,})\s*<\/h2>/i)
      if (skuMatch) sku = skuMatch[1].trim()

      let categoryName = ''
      const catMatch = html.match(/Category[:\s]*<\/[^>]+>\s*([^<\n]+)/i) ||
        html.match(/Category[:\s]*([^<\n]{2,60})/i)
      if (catMatch) categoryName = stripTags(catMatch[1])

      const categorySlug = productUrlToCat.get(url) || ''

      // descriptions
      const paras = [...html.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)]
        .map((m) => stripTags(m[1]))
        .filter(
          (t) =>
            t.length > 60 &&
            !/Factory Address|ISO 13485|proted@|All rights|Tüm hakları/i.test(t),
        )
      let description = paras.slice(0, 2).join(' ')
      if (description.length > 1500) description = description.slice(0, 1500)

      // images
      const imgs = unique(
        [...html.matchAll(/src="(https:\/\/www\.protedglobal\.com\/uploads\/images\/[^"]+\.(?:jpg|jpeg|png|webp))"/gi)].map(
          (m) => m[1],
        ),
      ).filter((u) => !/settings|slider|menu|categories|indirim|banner|logo/i.test(u))

      let image = ''
      const mainImg = imgs[0]
      if (mainImg) {
        const ext = path.extname(mainImg.split('?')[0]) || '.jpg'
        const safe = slug.replace(/[^a-z0-9\-]/gi, '-').toLowerCase()
        const dest = path.join(PROD_IMG, `${safe}${ext}`)
        const ok = await downloadFile(mainImg, dest)
        if (ok) image = `/products/${safe}${ext}`
      }

      let warranty = '24 months limited warranty'
      const w = html.match(/(\d+)\s*months?\s*limited\s*warranty/i)
      if (w) warranty = `${w[1]} months limited warranty`

      const specs = []
      for (const row of html.matchAll(
        /<tr[^>]*>\s*<t[dh][^>]*>([\s\S]*?)<\/t[dh]>\s*<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi,
      )) {
        const label = stripTags(row[1])
        const value = stripTags(row[2])
        if (
          label &&
          value &&
          label.length < 50 &&
          value.length < 100 &&
          label !== value &&
          specs.length < 10
        ) {
          specs.push({ label, value })
        }
      }

      if ((idx + 1) % 25 === 0) {
        console.log(`  scraped ${idx + 1}/${productUrls.length}`)
      }

      return {
        id: slug,
        slug,
        siteId,
        name,
        nameTr: name,
        sku: sku || slug.toUpperCase().slice(0, 20),
        categoryName,
        categorySlug,
        description,
        descriptionTr: description,
        longDescription: description,
        longDescriptionTr: description,
        image: image || '/placeholder.svg',
        gallery: image ? [image] : [],
        sourceUrl: url,
        warranty,
        specs,
        featured: false,
        new: false,
        tags: [categorySlug].filter(Boolean),
        kLevels: [],
        materials: [],
        applicationTypes: [],
        stockStatus: 'in_stock',
        stockQty: 10,
        features: description
          ? [
              {
                title: 'Clinical quality',
                titleTr: 'Klinik kalite',
                description: 'CE marked under ISO 13485 quality systems.',
                descriptionTr:
                  'ISO 13485 kalite sistemleri altında CE işaretli.',
              },
            ]
          : [],
        variants: sku ? [{ code: sku, label: 'Standard' }] : [],
        compatibleSkus: [],
      }
    } catch (e) {
      console.log(`  FAIL ${url}: ${e.message}`)
      return null
    }
  })

  const cleanProducts = products.filter(Boolean)

  // Mark featured: first of major cats
  const featuredCats = new Set([
    'carbon-foot',
    'hydraulic-knee-joints',
    'silicone-liners',
    'active-vacuum-system',
    'myoelectric-hand',
    'pneumatic-knee-joints',
  ])
  const featuredOnce = new Set()
  for (const p of cleanProducts) {
    if (featuredCats.has(p.categorySlug) && !featuredOnce.has(p.categorySlug)) {
      p.featured = true
      featuredOnce.add(p.categorySlug)
    }
  }

  // Update category counts from actual products
  for (const c of categories) {
    c.productCount = cleanProducts.filter((p) => p.categorySlug === c.id).length
    c.description = `${c.name} products by PROTED Global.`
    c.descriptionTr = `PROTED Global ${c.name} ürün grubu.`
    delete c.productUrls
  }

  fs.writeFileSync(
    path.join(OUT_DIR, 'proted-categories.json'),
    JSON.stringify(categories, null, 2),
    'utf8',
  )
  fs.writeFileSync(
    path.join(OUT_DIR, 'proted-products.json'),
    JSON.stringify(cleanProducts, null, 2),
    'utf8',
  )

  console.log(`\nDONE`)
  console.log(`Categories: ${categories.length}`)
  console.log(`Products: ${cleanProducts.length}`)
  console.log(`With images: ${cleanProducts.filter((p) => p.image && !p.image.includes('placeholder')).length}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

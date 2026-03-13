import { Metadata, ResolvingMetadata } from 'next'
import { API_URL } from '@/lib/api'
import Link from 'next/link'
import ProductClientDetails from './ProductClientDetails'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export async function generateMetadata(
  { params }: { params: { slug: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  let product = await getProductData(slug);

  if (!product) {
    return {
      title: 'Product Not Found | Kraftix',
      description: 'The product you are looking for does not exist.'
    }
  }

  return {
    title: product.metaTitle || `${product.name} | Kraftix`,
    description: product.metaDescription || product.description.substring(0, 150),
    keywords: product.metaKeywords ? product.metaKeywords.split(',') : [product.name, 'Kraftix', 'Printing', 'Stickers'],
  }
}

async function getProductData(slug: string) {
  try {
     const res = await fetch(`${API_URL}/products/slug/${slug}`, {
         cache: 'no-store'
     })
     const json = await res.json()
     if (!json.success) {
         console.error("Failed to fetch product:", json)
         return null;
     }
     return json.data
  } catch(e) {
     console.error("Error fetching product:", e)
     return null
  }
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const product = await getProductData(slug)

  if (!product) {
    return (
      <>
        <Header />
        <div className="min-h-screen pt-44 pb-16 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Product Not Found</h1>
          <p className="text-slate-500 mb-8">This product doesn't exist or has been removed.</p>
          <Link href="/" className="px-6 py-3 bg-secondary text-white font-bold rounded-xl hover:brightness-110">
            Return Home
          </Link>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        {/* Load a client-side wrapper to handle interactions (state, options logic, tabs) */}
        <ProductClientDetails product={product} />
      </main>
      <Footer />
    </div>
  )
}



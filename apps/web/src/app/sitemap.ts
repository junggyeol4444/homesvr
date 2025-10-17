import type { MetadataRoute } from 'next';
import { apiFetch } from '../lib/api-client';

const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  const baseUrl = 'https://homesvr.dev';
  const { categories } = await apiFetch<{ categories: Array<{ slug: string }> }>('/categories');
  const productList = await apiFetch<{ items: Array<{ id: string }> }>('/products?pageSize=20');

  return [
    {
      url: baseUrl,
      lastModified: new Date()
    },
    {
      url: `${baseUrl}/compare`,
      lastModified: new Date()
    },
    {
      url: `${baseUrl}/tools`,
      lastModified: new Date()
    },
    {
      url: `${baseUrl}/alerts`,
      lastModified: new Date()
    },
    ...categories.map((category) => ({
      url: `${baseUrl}/categories/${category.slug}`,
      lastModified: new Date()
    })),
    ...productList.items.map((product) => ({
      url: `${baseUrl}/products/${product.id}`,
      lastModified: new Date()
    }))
  ];
};

export default sitemap;

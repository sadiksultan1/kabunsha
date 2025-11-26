import { Product } from './types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Sunshine Floral Dress',
    price: 1200,
    currency: 'ETB',
    category: 'Kids',
    image: 'https://picsum.photos/seed/kid1/400/500',
    description: 'Bright yellow floral patterns perfect for summer playdates.'
  },
  {
    id: '2',
    name: 'Denim Adventure Overalls',
    price: 1500,
    currency: 'ETB',
    category: 'Kids',
    image: 'https://picsum.photos/seed/kid2/400/500',
    description: 'Durable denim overalls built for messy adventures.'
  },
  {
    id: '3',
    name: 'Cozy Bear Onesie',
    price: 950,
    currency: 'ETB',
    category: 'Baby',
    image: 'https://picsum.photos/seed/baby1/400/500',
    description: 'Soft cotton blend to keep your newborn warm and cozy.'
  },
  {
    id: '4',
    name: 'Little Gentleman Suit',
    price: 2200,
    currency: 'ETB',
    category: 'Kids',
    image: 'https://picsum.photos/seed/kid3/400/500',
    description: 'Sharp looking 3-piece set for special family occasions.'
  },
  {
    id: '5',
    name: 'Sparkle Party Shoes',
    price: 800,
    currency: 'ETB',
    category: 'Accessories',
    image: 'https://picsum.photos/seed/shoes1/400/500',
    description: 'Comfortable flats with a touch of magic sparkle.'
  },
  {
    id: '6',
    name: 'Safari Explorer Hat',
    price: 450,
    currency: 'ETB',
    category: 'Accessories',
    image: 'https://picsum.photos/seed/hat1/400/500',
    description: 'Wide-brimmed hat for sun protection during outdoor fun.'
  }
];

export const SITE_INFO = {
  name: "KEBUU KIDS FASHION STORY",
  tagline: "Stylish, comfortable, and playful clothing for children.",
  phone: "+2011551830",
  email: "kebuukids@gmail.com",
  locations: ["Ethiopia", "Egypt"]
};
export interface Photo {
  title: string;
  altText: string;
  category: 'Japan' | 'Travel';
}

export const photography: Photo[] = [
  {
    title: 'Tokyo Neon',
    altText: 'Vibrant neon lights of Shinjuku at night',
    category: 'Japan',
  },
  {
    title: 'Kyoto Temple',
    altText: 'Serene traditional temple architecture in Kyoto',
    category: 'Japan',
  },
  {
    title: 'Mt Fuji',
    altText: 'Majestic view of Mount Fuji with cherry blossoms',
    category: 'Japan',
  },
];

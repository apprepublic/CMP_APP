-- Insert some mock articles
INSERT INTO public.articles (id, title, slug, excerpt, content, category, read_time_minutes, view_count, is_published, published_at)
VALUES
  (
    gen_random_uuid(),
    'The Future of the Creative Economy',
    'future-of-creative-economy',
    'Discover how blockchain and digital currencies are revolutionizing the way creators monetize their work globally.',
    '<p>The creative economy is rapidly evolving...</p>',
    'Technology',
    5,
    1200,
    true,
    now()
  ),
  (
    gen_random_uuid(),
    'Mastering Digital Art Sales',
    'mastering-digital-art-sales',
    'A comprehensive guide for digital artists looking to maximize their revenue streams through NFTs and direct sales.',
    '<p>Digital art has seen unprecedented growth...</p>',
    'Creativity',
    8,
    3450,
    true,
    now()
  ),
  (
    gen_random_uuid(),
    'Understanding Crypto Wallets',
    'understanding-crypto-wallets',
    'Everything you need to know about setting up, securing, and managing your digital assets safely.',
    '<p>Security is the foundation of digital wealth...</p>',
    'Finance',
    4,
    890,
    true,
    now()
  ),
  (
    gen_random_uuid(),
    'Building Your Personal Brand',
    'building-personal-brand',
    'How to leverage social media and community platforms to build a loyal audience that supports your creative journey.',
    '<p>Your personal brand is your most valuable asset...</p>',
    'Marketing',
    6,
    5600,
    true,
    now()
  ),
  (
    gen_random_uuid(),
    'The Rise of Independent Musicians',
    'rise-independent-musicians',
    'Why more artists are choosing to stay independent and use platforms like CMP to connect directly with fans.',
    '<p>The traditional music industry model is shifting...</p>',
    'Music',
    7,
    2100,
    true,
    now()
  );

import Image from 'next/image';

export function Art({ kind, priority = false, src, alt }: { kind: string; priority?: boolean; src?: string; alt?: string }) {
  const house = kind === 'residence';
  const source = src ?? (house ? '/images/residence.jpg' : '/images/grand-tourer.jpg');
  return <div className="art"><Image src={source} alt={alt ?? (house ? 'Contemporary residence with landscaped gardens' : 'Dark performance grand tourer on an open road')} fill sizes="(max-width: 700px) 100vw, 60vw" priority={priority} unoptimized={source.startsWith('https://')} className={house ? 'residence-photo' : 'car-photo'} /></div>;
}
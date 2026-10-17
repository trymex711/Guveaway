import Image from 'next/image';

export function Art({ kind, priority = false }: { kind: string; priority?: boolean }) {
  const house = kind === 'residence';
  return <div className="art"><Image src={house ? '/images/residence.jpg' : '/images/grand-tourer.jpg'} alt={house ? 'Contemporary residence with floor-to-ceiling windows and landscaped gardens' : 'Dark performance grand tourer on an open road'} fill sizes="(max-width: 700px) 100vw, 60vw" priority={priority} className={house ? 'residence-photo' : 'car-photo'} /></div>;
}
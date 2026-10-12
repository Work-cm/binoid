'use client';

import { usePathname } from 'next/navigation';

export default function Shell({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) {
    return <div className="flex flex-col flex-grow">{children}</div>;
  }

  return (
    <div className="flex flex-col flex-grow">
      {children}
    </div>
  );
}

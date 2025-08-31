'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Info, 
  BriefcaseMedical, 
  Image as ImageIcon, 
  Phone, 
  Newspaper, 
  Users, 
  ShieldCheck 
} from 'lucide-react';

export default function QuickLinks() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/aboutus', label: 'About Us', icon: Info },
    { href: '/india-treatment', label: 'India Treatment', icon: BriefcaseMedical },
    { href: '/gallery', label: 'Gallery', icon: ImageIcon },
    { href: '/blog', label: 'Blog', icon: Newspaper },
    { href: '/team', label: 'Our Team', icon: Users },
    { href: '/safety-measures', label: 'Safety Measures', icon: ShieldCheck },
    { href: '/contact', label: 'Contact Us', icon: Phone },
  ];

  return (
    <aside className="w-full px-6 py-4">
      <h2 className="text-xl font-semibold tracking-tight text-gray-700 mb-2">
        Quick Links
      </h2>

      <ul className="divide-y divide-gray-100">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center justify-between py-3 px-2 group transition-colors duration-200 ${
                  isActive
                    ? 'text-[#E22026] font-medium'
                    : 'text-gray-700 hover:text-[#E22026]'
                }`}
              >
                <span className="flex items-center gap-3">
                  <Icon
                    size={18}
                    className={`${
                      isActive
                        ? 'text-[#E22026]'
                        : 'text-gray-500 group-hover:text-[#E22026]'
                    }`}
                  />
                  {item.label}
                </span>
                <span
                  className={`h-2 w-2 rounded-full ${
                    isActive ? 'bg-[#E22026]' : 'bg-transparent group-hover:bg-gray-300'
                  }`}
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}

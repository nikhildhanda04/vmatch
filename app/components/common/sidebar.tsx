"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Heart, MessageSquare, User } from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();

  const links = [
    { name: "Feed", href: "/feed", icon: Home },
    { name: "Likes", href: "/likes", icon: Heart },
    { name: "DMs", href: "/dms", icon: MessageSquare },
    { name: "Profile", href: "/profile", icon: User },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 border-r border-white/10 p-6 z-50 bg-black">
        <div className="mb-10 font-bold text-2xl tracking-tight text-white/90 drop-shadow-md">
          Vmatch.
        </div>

        <nav className="flex flex-col gap-4">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || pathname.startsWith(link.href + "/");

            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-200 group
                  ${isActive 
                    ? "bg-white/10 text-white font-medium" 
                    : "text-neutral-500 hover:text-white hover:bg-white/5"
                  }
                `}
              >
                <Icon 
                  className={`w-6 h-6 transition-transform duration-200 group-hover:scale-110
                    ${isActive ? "text-orange-500" : ""}
                  `}
                />
                <span className="text-lg">{link.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 inset-x-0 h-20 bg-black/80 backdrop-blur-md border-t border-white/10 z-50 flex items-center justify-around px-2 pb-safe">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href || pathname.startsWith(link.href + "/");

          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex flex-col items-center justify-center w-16 h-16 rounded-full transition-all duration-200
                ${isActive ? "text-orange-500" : "text-neutral-500 hover:text-white"}
              `}
            >
              <Icon 
                className={`w-6 h-6 mb-1 ${isActive ? "scale-110" : ""}`}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className="text-[10px] font-medium hidden sm:block">{link.name}</span>
            </Link>
          );
        })}
      </div>
    </>
  );
}

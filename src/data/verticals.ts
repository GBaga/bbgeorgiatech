import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  Briefcase,
  CalendarCheck,
  CalendarDays,
  ClipboardCheck,
  CreditCard,
  FileText,
  Gauge,
  GraduationCap,
  HeartPulse,
  Images,
  Languages,
  Lock,
  Mail,
  MapPin,
  Newspaper,
  Palette,
  PhoneCall,
  Plane,
  Scissors,
  Search,
  ShieldCheck,
  ShoppingCart,
  Star,
  Stethoscope,
  Store,
  Tag,
  Truck,
  UserRound,
  Users,
  Wrench,
} from "lucide-react";
import type { PackageKey } from "./pricing";

// Industry landing pages (/[locale]/for/[slug]). Structure and visuals live
// here; all copy lives in messages/*.json under Verticals.<key>, with one
// Verticals.<key>.features.<feature key> entry per feature listed below.
// A vertical only gets a page while `ready` is true — anything else 404s.

export type ProjectKey = "kc" | "giga" | "travel";

// Real portfolio projects shown on matching industry pages. `msg` is the
// project's number in the DeployedSystems messages (c1/h1/m1 …).
export const PROJECTS: Record<ProjectKey, { name: string; image: string; url: string; accent: string; msg: number }> = {
  kc: { name: "KC Legal", image: "/KC-legal.webp", url: "https://www.kclegal.ge/ka", accent: "#c9a45c", msg: 1 },
  giga: { name: "Giga's Remonti", image: "/gigas-remonti.webp", url: "https://gigas-remonti.vercel.app/en", accent: "#f59e0b", msg: 2 },
  travel: { name: "BBGeorgiaTravel", image: "/bbgeorgiatravel.webp", url: "https://bbgeorgiatravel.com/", accent: "#2dd4bf", msg: 3 },
};

export type Vertical = {
  slug: string;
  key: string; // messages key under Verticals
  icon: LucideIcon;
  accent: string;
  project?: ProjectKey;
  recommended: PackageKey;
  features: { key: string; icon: LucideIcon }[];
  ready: boolean;
};

export const VERTICALS: Vertical[] = [
  {
    slug: "home-services",
    key: "homeServices",
    icon: Wrench,
    accent: "#f59e0b",
    project: "giga",
    recommended: "launch",
    features: [
      { key: "call", icon: PhoneCall },
      { key: "quote", icon: FileText },
      { key: "gallery", icon: Images },
      { key: "local", icon: MapPin },
      { key: "trust", icon: ShieldCheck },
      { key: "languages", icon: Languages },
    ],
    ready: true,
  },
  {
    slug: "professional-services",
    key: "professionalServices",
    icon: Briefcase,
    accent: "#c9a45c",
    project: "kc",
    recommended: "business",
    features: [
      { key: "practice", icon: Briefcase },
      { key: "team", icon: Users },
      { key: "booking", icon: CalendarCheck },
      { key: "trust", icon: ShieldCheck },
      { key: "insights", icon: Newspaper },
      { key: "languages", icon: Languages },
    ],
    ready: true,
  },
  {
    slug: "health-wellness",
    key: "healthWellness",
    icon: HeartPulse,
    accent: "#34d399",
    recommended: "business",
    features: [
      { key: "booking", icon: CalendarCheck },
      { key: "profiles", icon: UserRound },
      { key: "services", icon: Stethoscope },
      { key: "privacy", icon: Lock },
      { key: "local", icon: MapPin },
      { key: "languages", icon: Languages },
    ],
    ready: true,
  },
  {
    slug: "beauty",
    key: "beauty",
    icon: Scissors,
    accent: "#f472b6",
    recommended: "business",
    features: [
      { key: "booking", icon: CalendarCheck },
      { key: "gallery", icon: Images },
      { key: "prices", icon: Tag },
      { key: "team", icon: Users },
      { key: "local", icon: MapPin },
      { key: "reviews", icon: Star },
    ],
    ready: true,
  },
  {
    slug: "hospitality-tourism",
    key: "hospitalityTourism",
    icon: Plane,
    accent: "#2dd4bf",
    project: "travel",
    recommended: "business",
    features: [
      { key: "booking", icon: CalendarCheck },
      { key: "languages", icon: Languages },
      { key: "gallery", icon: Images },
      { key: "speed", icon: Gauge },
      { key: "local", icon: MapPin },
      { key: "reviews", icon: Star },
    ],
    ready: true,
  },
  {
    slug: "creative-personal-brands",
    key: "creativePersonalBrands",
    icon: Palette,
    accent: "#8b5cf6",
    recommended: "launch",
    features: [
      { key: "portfolio", icon: Images },
      { key: "brand", icon: Palette },
      { key: "inquiry", icon: Mail },
      { key: "booking", icon: CalendarCheck },
      { key: "seo", icon: Search },
      { key: "languages", icon: Languages },
    ],
    ready: true,
  },
  {
    slug: "education",
    key: "education",
    icon: GraduationCap,
    accent: "#facc15",
    recommended: "business",
    features: [
      { key: "courses", icon: CalendarDays },
      { key: "registration", icon: ClipboardCheck },
      { key: "payments", icon: CreditCard },
      { key: "teachers", icon: Users },
      { key: "resources", icon: BookOpen },
      { key: "languages", icon: Languages },
    ],
    ready: true,
  },
  {
    slug: "local-shops",
    key: "localShops",
    icon: Store,
    accent: "#fb7185",
    recommended: "pro",
    features: [
      { key: "shop", icon: ShoppingCart },
      { key: "payments", icon: CreditCard },
      { key: "delivery", icon: Truck },
      { key: "story", icon: BookOpen },
      { key: "local", icon: MapPin },
      { key: "languages", icon: Languages },
    ],
    ready: true,
  },
];

export const READY_VERTICALS = VERTICALS.filter((v) => v.ready);

export function getVertical(slug: string) {
  return READY_VERTICALS.find((v) => v.slug === slug);
}

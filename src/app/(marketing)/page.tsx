import Image from "next/image";

import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Briefcase,
  Code,
  LineChart,
  MonitorSmartphone,
  ChevronRight,
  Search,
} from "lucide-react";
import { Link } from "next-view-transitions";
import MentorSearch from "@/components/shared/mentor-search";
import Stats from "@/components/shared/stats-count-up";


// SEO metadata
export const metadata: Metadata = {
  title: "DUX - Find Your Perfect Mentor | Professional Guidance Platform",
  description:
    "Connect with top mentors in technology, business, career development, and sales. Get personalized guidance to achieve your career and personal growth goals.",
  keywords:
    "mentorship, career guidance, professional mentors, career development, business mentors",
};

// Dummy data for mentorship categories
const categories = [
  {
    id: 1,
    title: "Technology",
    icon: <Code className="h-8 w-8 text-primary" />,
    mentorsCount: 438,
    href: "/mentors?search=technology",
  },

  {
    id: 2,
    title: "Career Development",
    icon: <Briefcase className="h-8 w-8 text-primary" />,
    mentorsCount: 346,
    href: "/mentors?search=career",
  },
  {
    id: 3,
    title: "Business",
    icon: <MonitorSmartphone className="h-8 w-8 text-primary" />,
    mentorsCount: 211,
    href: "/mentors?search=business",
  },
  {
    id: 4,
    title: "Sales",
    icon: <LineChart className="h-8 w-8 text-primary" />,
    mentorsCount: 756,
    href: "/mentors?search=sales",
  },
];

// Dummy data for featured mentors
const featuredMentors = [
  {
    id: 1,
    name: "Priya Sharma",
    role: "Tech Lead",
    image: "/placeholder.svg?height=120&width=120",
  },
  {
    id: 2,
    name: "Ananya Patel",
    role: "Career Coach",
    image: "/placeholder.svg?height=120&width=120",
  },
  {
    id: 3,
    name: "Neha Gupta",
    role: "UX Designer",
    image: "/placeholder.svg?height=120&width=120",
  },
  {
    id: 4,
    name: "Ravi Kumar",
    role: "Business Consultant",
    image: "/placeholder.svg?height=120&width=120",
  },
  {
    id: 5,
    name: "Meera Joshi",
    role: "Marketing Expert",
    image: "/placeholder.svg?height=120&width=120",
  },
  {
    id: 6,
    name: "Sanjay Mehta",
    role: "Product Manager",
    image: "/placeholder.svg?height=120&width=120",
  },
  {
    id: 7,
    name: "Divya Singh",
    role: "Sales Director",
    image: "/placeholder.svg?height=120&width=120",
  },
  {
    id: 8,
    name: "Arjun Reddy",
    role: "Startup Advisor",
    image: "/placeholder.svg?height=120&width=120",
  },
  {
    id: 9,
    name: "Kavita Nair",
    role: "Data Scientist",
    image: "/placeholder.svg?height=120&width=120",
  },
];

// Dummy data for stats
const stats = [
  { id: 1, value: 8000, label: "No. of people mentored" },
  { id: 2, value: 25, label: "Mentors ready to guide" },
  { id: 3, value: 25000, label: "No. of sessions given" },
];

export default function Home() {
  return (
    <main>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-background py-10 md:py-10">
        <div className="container mx-auto px-2 md:px-4">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  "Your journey to growth and success begins here."
                </h1>
                {/* <div className="h-1 w-48 bg-primary rounded"></div> */}
                <p className="max-w-[600px] text-slate-600 md:text-xl mt-6">
                  Looking for the right mentor to guide my journey toward
                  achieving new career heights, with exploring innovative
                  opportunities.
                </p>
              </div>
              <MentorSearch/>

            </div>
            <div className="relative hidden lg:block">
              <img
                src="/mentor.jpg"
                alt="Professional mentor"
                className="w-full h-full object-fill rounded-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-white/20 rounded-lg"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Description */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Top Platform for Mentorship and Guidance Consultation
            </h2>
            <p className="text-lg text-slate-600">
              MentorConnect offers the best online mentorship and guidance
              services in India and worldwide. Connect with top mentors, career
              experts, and advisors via chat, phone, or video call for
              personalized guidance.
            </p>
          </div>

          {/* Categories */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={category.href}
                className="group flex flex-col items-center p-6 bg-background rounded-lg border border-foreground shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="mb-4">{category.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{category.title}</h3>
                <p className="text-sm text-slate-500 mb-3">
                  {category.mentorsCount} mentors available
                </p>
                <div className="flex items-center text-primary text-sm font-medium">
                  <span>View mentors</span>
                  <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>

          <div className="flex justify-center mt-12">
           <Link href="/mentors">
           <Button variant="outline" size="lg" className="gap-2">
              Explore All Mentorship Services
              <ChevronRight className="h-4 w-4" />
            </Button>
           </Link>
          </div>
        </div>
      </section>

      {/* Mentors Section */}
      <section className="py-16 md:py-24 bg-background ">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
                Consult Best Mentors in India
              </h2>
              <p className="text-lg text-slate-600 mb-6">
                Top Mentors, Career Coaches, and Industry Experts in India.
                Explore the List of Leading Mentors in India. Best Online
                Mentorship and Guidance Platform in India.
              </p>

              <h3 className="text-2xl font-bold mt-12 mb-4">
                Certified & Experienced
              </h3>
              <p className="text-lg text-slate-600 mb-6">
                Get the best online Mentorship & Guidance experience from
                Verified Experts. Top Mentors to help you achieve your career
                and personal growth goals.
              </p>

              <p className="text-lg text-slate-600 mb-8">
                We match you with the best mentor or advisor tailored to your
                needs. We select the perfect expert for you.
              </p>
              <Link href="/mentors">
                <Button size="lg" className="gap-2">
                  See all Mentors
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {featuredMentors.map((mentor) => (
                <div
                  key={mentor.id}
                  className="bg-background  p-2 rounded-lg border border-foreground hover:shadow-md transition-shadow"
                >
                  <Image
                    src={mentor.image || "/placeholder.svg"}
                    alt={mentor.name}
                    width={120}
                    height={120}
                    className="rounded-lg w-full aspect-square object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trust Banner */}
      <section className="py-16 md:py-24 text-center">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold max-w-3xl mx-auto">
            Dux is the most preferred and trusted online mentorship and guidance
            platform in India.
          </h2>

         <Stats stats={stats} />
        </div>
      </section>
    </main>
  );
}

import { FilterSidebar } from "@/components/shared/filter-sidebar";
import MentorGrid from "@/components/shared/mentor-grid";
import { SearchBar } from "@/components/shared/search-bar";
import { Button } from "@/components/ui/button";
import { getAllUsersWithPagination } from "@/lib/db/user";
import { Link } from "next-view-transitions";

export default async function MentorsPage() {

  //  const result = await getAllUsersWithPagination(1,5);
  //  console.log(result);


  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex justify-between ">
              {" "}
              <h1 className="text-4xl font-bold tracking-tight">
                Explore Our Expert Mentors
              </h1>
              <Link href="/register-as-mentor">< Button > Register As Mentor</Button></Link>
            </div>
            <p className="text-muted-foreground max-w-3xl">
              Our team of expert mentors is committed to offering personalized
              guidance. Each mentor brings unique experience and a compassionate
              approach to help you achieve your career and personal growth
              goals.
            </p>
          </div>
          <SearchBar />
          <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
            <FilterSidebar />
            <MentorGrid mentors={[]}/>
          </div>
        </div>
      </main>
    </div>
  );
}

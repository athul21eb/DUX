import { FilterSidebar } from "@/components/shared/filter-sidebar";
import MentorGrid from "@/components/shared/mentor-grid";
import { SearchBar } from "@/components/shared/search-bar";
import { Button } from "@/components/ui/button";
import { getAllUsersWithPagination } from "@/lib/db/user";
import { Get_All_Mentor_With_Pagination_Server_Action } from "@/server/actions/admin/mentorsManagement/get-all-mentors-with-pagination.server-action";
import { Link } from "next-view-transitions";

export default async function MentorsPage() {

   const initialData = await Get_All_Mentor_With_Pagination_Server_Action(1,10);

   if (!initialData.success) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-100 p-4 rounded-md text-red-700">
          Failed to fetch mentor : {initialData.message}
        </div>
      </div>
    );
  }

  // initialData.data&&console.log(initialData.data);


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

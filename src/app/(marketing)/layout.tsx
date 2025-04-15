import { Footer } from "@/components/navigation/footer";
import { NavBar } from "@/components/navigation/navBar";



export default async function Layout({
  children,

}: {
  children: React.ReactNode;

}) {

  return (
    <div className="w-full">
    <NavBar />
    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">

      {children}
      <Footer/>
    </div>
    </div>
  );
}

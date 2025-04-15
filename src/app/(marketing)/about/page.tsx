import { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Link } from "next-view-transitions";

export const metadata: Metadata = {
  title: "About Us | Dux - Guiding Your Journey to Success",
  description: "Discover Dux's mission to empower individuals through personalized mentorship, expert guidance, and a supportive community dedicated to your personal and professional growth.",
};

export default function AboutUsPage() {
  return (
    <div className="bg-gradient-to-b from-background to-background/80">
      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 max-w-6xl">
      <div className="relative mb-12 md:mb-16">
          <div className="absolute inset-0 bg-primary/5 rounded-3xl blur-3xl opacity-50"></div>
          <div className="relative flex flex-col items-center text-center p-6 md:p-10">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
            About Us
            </h1>
            <p className="text-muted-foreground max-w-3xl mx-auto text-lg">
            Guiding your journey to personal and professional excellence
            </p>
          </div>
        </div>
        {/* <div className="text-center space-y-6 mb-20">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight"></h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">

          </p>
          <Separator className="max-w-md mx-auto" />
        </div> */}

        {/* Mission Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Our Vision & Mission</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              At Dux, we are passionate about empowering individuals to achieve their fullest potential by fostering
              personal and professional growth. Our name, inspired by the Latin word for "leader," reflects our commitment
              to guiding you on your path to success.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We believe that everyone deserves access to transformative mentorship that can change the trajectory of their
              careers and lives. Our mission is to bridge the gap between aspirations and achievement through expert guidance,
              community support, and innovative resources.
            </p>
          </div>
          <Card className="overflow-hidden shadow-lg border-0">
            <div className="bg-primary/10 h-64 w-full flex items-center justify-center">
              <div className="text-primary text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span className="block mt-4 font-medium">Trusted by thousands worldwide</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Values Section */}
        <section className="mb-24">
          <h2 className="text-3xl font-bold text-center mb-12">Our Core Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Excellence",
                description: "We are committed to providing exceptional mentorship experiences that exceed expectations and drive meaningful results.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                )
              },
              {
                title: "Integrity",
                description: "We build trust through honest communication, ethical practices, and delivering on our promises to mentees and partners.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                )
              },
              {
                title: "Innovation",
                description: "We constantly evolve our approaches and technologies to deliver cutting-edge mentorship solutions for today's challenges.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                )
              }
            ].map((value, index) => (
              <Card key={index} className="shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="text-primary mb-2">
                    {value.icon}
                  </div>
                  <CardTitle>{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* What We Offer Section */}
        <section className="mb-24">
          <h2 className="text-3xl font-bold mb-12">What We Offer</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-primary">Personalized Mentorship</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Connect with mentors who understand your unique goals and challenges. Our personalized matching system ensures you find the right guide for your specific journey.
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-primary">Community Connection</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Join a vibrant community of like-minded individuals who share knowledge, offer support, and celebrate each other's successes in a safe, inclusive environment.
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-primary">Expert Guidance</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Gain insights from industry veterans and subject matter experts who have navigated the challenges you face and can provide practical, actionable advice.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-primary">Skills Development</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Access workshops, resources, and training modules designed to enhance both technical skills and soft skills essential for career advancement.
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-primary">Career Strategy</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Develop comprehensive career plans with guidance on setting goals, identifying opportunities, and navigating transitions to achieve long-term success.
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-primary">Networking Opportunities</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Expand your professional network through facilitated connections, virtual events, and industry meetups that open doors to new possibilities.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="mb-24">
          <Card className="bg-primary/5 border-0">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold">Why Choose Dux?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Our holistic approach combines proven strategies with a deep understanding of individual needs. We don't believe in one-size-fits-all solutions; instead, we tailor our mentorship programs to address your specific challenges and goals.
                  </p>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    With Dux, you'll benefit from:
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <svg className="h-6 w-6 text-primary mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-muted-foreground">Mentors who have achieved success in your field of interest</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-6 w-6 text-primary mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-muted-foreground">Flexible programs that adapt to your evolving needs</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-6 w-6 text-primary mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-muted-foreground">Data-driven insights to track and accelerate your progress</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-6 w-6 text-primary mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-muted-foreground">A supportive community that celebrates your wins and helps you through challenges</span>
                    </li>
                  </ul>
                </div>
                <Card className="shadow-lg">
                  <CardContent className="pt-6">
                    <div className="text-center space-y-4">
                      <span className="inline-block p-3 rounded-full bg-primary/10">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                        </svg>
                      </span>
                      <h3 className="text-2xl font-bold">Your Success Is Our Success</h3>
                      <p className="text-muted-foreground">
                        We measure our effectiveness by your progress. Our mentors are invested in seeing you thrive and will go above and beyond to help you overcome obstacles.
                      </p>
                      <Link href='/signup'>
                      <Button size="lg" className="mt-4" >
                        Start Your Journey Today
                      </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Team Section
        <section className="mb-24">
          <h2 className="text-3xl font-bold text-center mb-12">Meet Our Leadership Team</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Alex Morgan",
                title: "Founder & CEO",
                bio: "With over 15 years of experience in leadership development, Alex founded Dux with the vision of making quality mentorship accessible to all."
              },
              {
                name: "Sam Rivera",
                title: "Chief Mentorship Officer",
                bio: "Sam brings extensive expertise in designing effective mentorship programs that create measurable impact for professionals at all career stages."
              },
              {
                name: "Taylor Chen",
                title: "Head of Community",
                bio: "Taylor is passionate about creating inclusive spaces where individuals can connect, learn, and grow together through shared experiences."
              }
            ].map((member, index) => (
              <Card key={index} className="shadow-lg overflow-hidden">
                <div className="h-32 bg-gradient-to-r from-primary to-primary/60"></div>
                <CardContent className="pt-16 relative">
                  <div className="absolute -top-10 left-1/2 transform -translate-x-1/2">
                    <Avatar className="h-20 w-20 border-4 border-background">
                      <AvatarFallback className="text-2xl bg-primary/10 text-primary">{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-bold">{member.name}</h3>
                    <Badge variant="secondary" className="my-2">{member.title}</Badge>
                    <p className="text-muted-foreground mt-2">{member.bio}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>


        <Card className="bg-primary text-primary-foreground border-0 shadow-xl">
          <CardContent className="pt-10 pb-10 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Journey?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Join thousands of professionals who have accelerated their growth with Dux's personalized mentorship platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="secondary" size="lg">
                Find Your Mentor
              </Button>
              <Button variant="outline" size="lg" className="border-primary-foreground hover:bg-primary-foreground hover:text-primary">
                Learn More
              </Button>
            </div>
          </CardContent>
        </Card> */}
      </section>
    </div>
  );
}
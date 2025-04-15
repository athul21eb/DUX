import { ContactForm } from "@/components/forms/ContactForm"
import { ContactInfo } from "@/components/shared/contact-info"
import type { Metadata } from "next"
import Image from "next/image"

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with our team",
}

export default function ContactPage() {
  return (
    <main className="w-full py-12 md:py-16 lg:py-24 bg-gradient-to-b from-background to-background/80">
      <div className="container px-4 md:px-6 max-w-6xl mx-auto">
        {/* Header Section with Gradient Accent */}
        <div className="relative mb-12 md:mb-16">
          <div className="absolute inset-0 bg-primary/5 rounded-3xl blur-3xl opacity-50"></div>
          <div className="relative flex flex-col items-center text-center p-6 md:p-10">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
              Contact Us
            </h1>
            <p className="text-muted-foreground max-w-3xl mx-auto text-lg">
              Have questions or need assistance? We're here to help you every step of the way.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid gap-8 lg:grid-cols-5 items-stretch">
          {/* Contact Form Section - Takes more space */}
          <div className="lg:col-span-3 bg-card rounded-2xl shadow-lg border border-border/50 overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="bg-primary/5 px-6 py-5 border-b border-border/50 flex items-center">
              <div>
                <h2 className="text-2xl font-semibold">Send us a message</h2>
                <p className="text-sm text-muted-foreground mt-1">We aim to respond within 24 hours</p>
              </div>
            </div>
            <div className="p-6 md:p-8">
              <ContactForm />
            </div>
          </div>

          {/* Contact Info Section - Side Panel */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="bg-card rounded-2xl shadow-lg border border-border/50 overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full">
              <div className="bg-primary/5 px-6 py-5 border-b border-border/50">
                <h2 className="text-2xl font-semibold">Contact Information</h2>
                <p className="text-sm text-muted-foreground mt-1">Multiple ways to reach us</p>
              </div>
              <div className="p-6 md:p-8">
                <ContactInfo />
              </div>
            </div>
          </div>
        </div>



        {/* FAQ or Additional Information */}
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-2">
            Can't find what you're looking for? Check our comprehensive
            <a href="#" className="text-primary hover:underline ml-1">FAQ section</a>
          </p>
        </div>
      </div>
    </main>
  )
}
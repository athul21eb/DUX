import { Facebook, Instagram, Youtube, MapPin, Phone, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export function ContactInfo() {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="bg-primary/10 p-2 rounded-full">
            <Phone className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium">Phone</h3>
            <p className="text-muted-foreground">Mob - (+91) 8587706088</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="bg-primary/10 p-2 rounded-full">
            <MapPin className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium">Address</h3>
            <p className="text-muted-foreground">CUSAT P.O.,</p>
            <p className="text-muted-foreground">Kalamassery, Kochi, Kerala</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="bg-primary/10 p-2 rounded-full">
            <Mail className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium">Email</h3>
            <p className="text-muted-foreground">info@DUX.in</p>
          </div>
        </div>
      </div>

      <Separator />

      <div className="space-y-3">
        <h3 className="font-medium">Connect with us</h3>
        <div className="flex space-x-3">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
            asChild
          >
            <a href="#" aria-label="Facebook">
              <Facebook className="h-4 w-4" />
            </a>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
            asChild
          >
            <a href="#" aria-label="Instagram">
              <Instagram className="h-4 w-4" />
            </a>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
            asChild
          >
            <a href="#" aria-label="YouTube">
              <Youtube className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
    </div>
  )
}


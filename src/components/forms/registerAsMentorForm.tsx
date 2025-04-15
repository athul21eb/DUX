"use client"

import type React from "react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { motion } from "framer-motion"
import { Plus, X, Clock } from "lucide-react"

import toast from "react-hot-toast"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import TimeSlotSelector from "../shared/time-slot-selector"
import { DatePickerWithYear } from "../ui/customizedDatePickerWithYear"
import { ImageCropper } from "../ui/imageCropper"
import DUX from "../ui/Dux"
import { RegisterMentorFormSchema, RegisterMentorFormType } from "@/utils/validator/registerMentor"
import { Register_Mentor_Server_Action } from "@/server/actions/auth/registerAsMentor/register-mentor.server-action"
import { useTransitionRouter } from "next-view-transitions"





// Define the expertise options
const expertiseOptions = [
  "Software Development",
  "Sales",
  "Marketing",
  "Data Science",
  "Design",
  "Finance",
  "Human Resources",
  "Product Management",
  "Business Strategy",
  "Leadership",
  "Other",
]


const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function MentorProfileForm({
  availableSkills = [],
}: {
  availableSkills?: any[]
}) {
  const router = useTransitionRouter()
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [previewURL, setPreviewURL] = useState<string | null>(null)
  const [selectedDocuments, setSelectedDocuments] = useState<File[]>([])
  const [newLanguage, setNewLanguage] = useState<string>("")
  const [showAllSkills, setShowAllSkills] = useState<boolean>(false)

  // Image cropping states
  const [cropDialogOpen, setCropDialogOpen] = useState<boolean>(false)
  const [imageToCrop, setImageToCrop] = useState<string | null>(null)

  // Default form values
  const defaultValues: RegisterMentorFormType = {
    name: "",
    email: "",
    phone: "",
    dob: new Date(2000, 0, 1),
    gender: "prefer-not-to-say",
    hourlyRate: "500",
    expertise: "",
    skills: [],
    aboutMe: "",
    experiences: [
      {
        role: "",
        company: "",
        startDate: new Date(),
        endDate: null,
        description: "",
      },
    ],
    educations: [
      {
        degree: "",
        institution: "",
        startDate: new Date(),
        endDate: null,
        description: "",
      },
    ],
    languages: [],
    timeSlots: [],
  }

  const form = useForm<RegisterMentorFormType>({
    resolver: zodResolver(RegisterMentorFormSchema),
    defaultValues,
  })

  const allowedImageTypes = ["jpg", "jpeg", "png", "gif"]
  const allowedDocumentTypes = ["pdf", "doc", "docx"]

// Replace your existing handleImageChange function with this:
const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files && e.target.files[0]) {
    const file = e.target.files[0]
    const fileExtension = file.name.split(".").pop()?.toLowerCase()

    if (!fileExtension || !allowedImageTypes.includes(fileExtension)) {
      toast.error("Invalid image format! Allowed formats: jpg, jpeg, png, gif")
      return
    }

    // Create a URL for the image and set it for cropping
    const imageUrl = URL.createObjectURL(file)
    setImageToCrop(imageUrl)
    setCropDialogOpen(true)
  }
}

  const handleCropComplete = (croppedFile: File, croppedUrl: string) => {
    // Make sure we have a valid cropped file before setting state
    if (croppedFile && croppedUrl) {
      setSelectedImage(croppedFile)
      setPreviewURL(croppedUrl)

      // Clean up the temporary image URL
      if (imageToCrop) {
        URL.revokeObjectURL(imageToCrop)
      }
    } else {
      toast.error("Failed to crop image. Please try again.")
    }
  }

  const handleAddLanguage = () => {
    const value = newLanguage.trim()
    if (value) {
      const currentLanguages = form.getValues("languages")
      form.setValue("languages", [...currentLanguages, value])
      setNewLanguage("")
    }
  }

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const fileExtension = file.name.split(".").pop()?.toLowerCase()

      if (!fileExtension || !allowedDocumentTypes.includes(fileExtension)) {
        toast.error("Invalid document format! Allowed formats: pdf, doc, docx")
        return
      }

      setSelectedDocuments((prev) => [...prev, file])

      // Reset the input value so the same file can be selected again
      e.target.value = ""
    }
  }

  const onSubmit = async (data: RegisterMentorFormType) => {
    setIsSubmitting(true)

    try {
      if (selectedDocuments.length < 3) {
        toast.error("please upload id proof, experience, education documents!")
        setIsSubmitting(false)
        return
      }
      if (!selectedImage) {
        toast.error("please upload a profile picture!")
        setIsSubmitting(false)
        return
      }

      console.log("Form submitted successfully:", data)
      console.log("Selected time slots:", data.timeSlots)

     
      // Uncomment this when you have the server action ready
      const res = await Register_Mentor_Server_Action(
        data,
        selectedImage,
        selectedDocuments
      );

      if (!res.success) {
        toast.error(res.message, { duration: 5000 });
        return;
      } else {
        toast.success(res.message);
        router.push("/");
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      toast.error("Error submitting form")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Display only first 10 skills if not showing all
  const displayedSkills = showAllSkills ? availableSkills : availableSkills.slice(0, 10)



  return (
    <div className="container mx-auto py-8 px-4">
      <motion.div initial="hidden" animate="visible" variants={fadeIn} transition={{ duration: 0.5 }}>
        <Card className="w-full">
          <CardHeader className="bg-primary/5 border-b">
            <CardTitle className="text-2xl md:text-3xl flex flex-col-reverse md:flex-row md:justify-between mx-5">
              <span className="text-center">Mentor Registration</span> <DUX />
            </CardTitle>
            <p className="text-sm text-muted-foreground text-center md:text-start mx-5">
              Complete your profile to become a mentor and start helping others
            </p>
          </CardHeader>
          <CardContent className="p-6 md:p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Main sections in a responsive grid */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                  {/* Left column - Profile image and basic info */}
                  <div className="lg:col-span-1 space-y-6">
                    <div className="flex flex-col items-center space-y-4">
                      <Avatar className="w-32 h-32 border-4 border-primary/20">
                        <AvatarImage src={previewURL || ""} alt="Profile" />
                        <AvatarFallback className="text-2xl">{form.watch("name")?.charAt(0) || "M"}</AvatarFallback>
                      </Avatar>
                      <div className="w-full flex flex-col items-center">
                        <Input
                          id="profileImage"
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="w-full"
                        />
                        <p className="text-xs text-muted-foreground mt-1">Upload a professional profile picture</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="hourlyRate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Hourly Rate (₹)</FormLabel>
                            <FormControl>
                              <Input {...field} type="number" min="500" placeholder="500" />
                            </FormControl>
                            <FormMessage />
                            <p className="text-xs text-muted-foreground">Minimum rate: ₹500 per hour</p>
                          </FormItem>
                        )}
                      />

                      <div>
                        <FormLabel>Supporting Documents</FormLabel>
                        <p className="text-xs text-muted-foreground mb-2">
                          Upload ID proof, certifications, portfolios, etc.
                        </p>
                        <Input type="file" accept=".pdf,.doc,.docx" onChange={handleDocumentChange} />
                        {selectedDocuments.length > 0 && (
                          <div className="mt-2 space-y-2 max-h-40 overflow-y-auto">
                            {selectedDocuments.map((doc, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between bg-secondary/20 p-2 rounded-md"
                              >
                                <span className="text-sm truncate max-w-[180px]">{doc.name}</span>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                  onClick={() => {
                                    setSelectedDocuments(selectedDocuments.filter((_, i) => i !== index))
                                  }}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Middle columns - Personal details and skills */}
                  <div className="lg:col-span-3 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="John Doe" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input {...field} type="email" placeholder="john@example.com" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input {...field} type="tel" placeholder="9876543210" maxLength={10} />
                            </FormControl>
                            <p className="text-xs text-muted-foreground">10-digit mobile number</p>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <DatePickerWithYear form={form} name="dob" label="Date of Birth" />

                      <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Gender</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                                <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="expertise"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Primary Expertise</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select your field" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="max-h-52 overflow-y-auto">
                                {expertiseOptions.map((option) => (
                                  <SelectItem key={option} value={option}>
                                    {option}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      <FormField
                        control={form.control}
                        name="aboutMe"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>About Me</FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                placeholder="Tell us about yourself, your background, and mentoring style..."
                                className="min-h-24"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>

                {/* Time Slots Section */}
                <div className="bg-primary/5 p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-4 flex items-center">
                    <Clock className="h-5 w-5 mr-2" /> Available Time Slots
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Select your default available time slots. You can modify these later in your dashboard.
                  </p>

                  <TimeSlotSelector form={form} name="timeSlots" />
                </div>

                {/* Skills section */}
                <div className="bg-secondary/10 p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-4">Skills & Languages</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Skills */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <FormLabel>Skills</FormLabel>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowAllSkills(!showAllSkills)}
                        >
                          {showAllSkills ? "Show Less" : "Show More"}
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        Select technologies and skills you can mentor in
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mb-4 max-h-48 overflow-y-auto p-2 bg-background/80 rounded-md">
                        {displayedSkills.map((skill) => (
                          <FormField
                            key={skill.id}
                            control={form.control}
                            name="skills"
                            render={({ field }) => {
                              return (
                                <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-2">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.some((s) => s.id === skill.id)}
                                      onCheckedChange={(checked) => {
                                        if (checked) {
                                          field.onChange([...(field.value || []), skill])
                                        } else {
                                          field.onChange(field.value?.filter((s) => s.id !== skill.id))
                                        }
                                      }}
                                    />
                                  </FormControl>

                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <FormLabel className="font-normal cursor-pointer">{skill.name}</FormLabel>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>{skill.description ?? "No description available"}</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                </FormItem>
                              )
                            }}
                          />
                        ))}
                      </div>
                      {form.formState.errors.skills && (
                        <p className="text-sm font-medium text-destructive mt-2">
                          {form.formState.errors.skills.message}
                        </p>
                      )}
                    </div>

                    {/* Languages */}
                    <div>
                      <FormLabel>Languages</FormLabel>
                      <p className="text-xs text-muted-foreground mb-2">Add languages you can mentor in</p>
                      <div className="flex flex-wrap gap-2 mb-2 min-h-12 max-h-24 overflow-y-auto p-2 bg-background/80 rounded-md">
                        {form.watch("languages").map((language, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-primary/10 flex items-center px-3 py-1 rounded-full"
                          >
                            <span className="truncate">{language}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-auto p-1 ml-1"
                              onClick={() => {
                                const currentLanguages = form.getValues("languages")
                                form.setValue(
                                  "languages",
                                  currentLanguages.filter((_, i) => i !== index),
                                )
                              }}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </motion.div>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Input
                          id="newLanguage"
                          placeholder="Add a language..."
                          className="flex-1"
                          value={newLanguage}
                          onChange={(e) => setNewLanguage(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault()
                              handleAddLanguage()
                            }
                          }}
                        />
                        <Button type="button" variant="outline" onClick={handleAddLanguage}>
                          <Plus className="h-4 w-4 mr-1" /> Add
                        </Button>
                      </div>
                      {form.formState.errors.languages && (
                        <p className="text-sm font-medium text-destructive mt-2">
                          {form.formState.errors.languages.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Experience & Education Tabs */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Experiences */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium">Experience</h3>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const currentExperiences = form.getValues("experiences")
                          form.setValue("experiences", [
                            ...currentExperiences,
                            {
                              role: "",
                              company: "",
                              startDate: new Date(),
                              endDate: null,
                              description: "",
                            },
                          ])
                        }}
                      >
                        <Plus className="h-4 w-4 mr-1" /> Add Experience
                      </Button>
                    </div>
                    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                      {form.watch("experiences").map((_, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Card className="border-primary/20">
                            <CardContent className="pt-6">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <FormField
                                  control={form.control}
                                  name={`experiences.${index}.role`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Role</FormLabel>
                                      <FormControl>
                                        <Input {...field} placeholder="Senior Developer" />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control}
                                  name={`experiences.${index}.company`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Company</FormLabel>
                                      <FormControl>
                                        <Input {...field} placeholder="Tech Company Inc." />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <DatePickerWithYear
                                  form={form}
                                  name={`experiences.${index}.startDate`}
                                  label="Start Date"
                                />
                                <DatePickerWithYear
                                  form={form}
                                  name={`experiences.${index}.endDate`}
                                  label="End Date"
                                  isEndDate={true}
                                />
                              </div>

                              <FormField
                                control={form.control}
                                name={`experiences.${index}.description`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                      <Textarea
                                        {...field}
                                        className="min-h-24"
                                        placeholder="Describe your responsibilities and achievements..."
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              {index > 0 && (
                                <div className="flex justify-end mt-4">
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => {
                                      const currentExperiences = form.getValues("experiences")
                                      form.setValue(
                                        "experiences",
                                        currentExperiences.filter((_, i) => i !== index),
                                      )
                                    }}
                                  >
                                    Remove
                                  </Button>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Educations */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium">Education</h3>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const currentEducations = form.getValues("educations")
                          form.setValue("educations", [
                            ...currentEducations,
                            {
                              degree: "",
                              institution: "",
                              startDate: new Date(),
                              endDate: null,
                              description: "",
                            },
                          ])
                        }}
                      >
                        <Plus className="h-4 w-4 mr-1" /> Add Education
                      </Button>
                    </div>
                    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                      {form.watch("educations").map((_, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Card className="border-primary/20">
                            <CardContent className="pt-6">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <FormField
                                  control={form.control}
                                  name={`educations.${index}.degree`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Degree</FormLabel>
                                      <FormControl>
                                        <Input {...field} placeholder="B.Tech Computer Science" />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control}
                                  name={`educations.${index}.institution`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Institution</FormLabel>
                                      <FormControl>
                                        <Input {...field} placeholder="University Name" />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <DatePickerWithYear
                                  form={form}
                                  name={`educations.${index}.startDate`}
                                  label="Start Date"
                                />
                                <DatePickerWithYear
                                  form={form}
                                  name={`educations.${index}.endDate`}
                                  label="End Date"
                                  isEndDate={true}
                                />
                              </div>

                              <FormField
                                control={form.control}
                                name={`educations.${index}.description`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                      <Textarea
                                        {...field}
                                        className="min-h-24"
                                        placeholder="Describe your course, achievements, projects, etc..."
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              {index > 0 && (
                                <div className="flex justify-end mt-4">
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => {
                                      const currentEducations = form.getValues("educations")
                                      form.setValue(
                                        "educations",
                                        currentEducations.filter((_, i) => i !== index),
                                      )
                                    }}
                                  >
                                    Remove
                                  </Button>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                {imageToCrop && (
                  <ImageCropper
                    imageSrc={imageToCrop}
                    aspectRatio={1}
                    circularCrop={true}
                    onCropComplete={handleCropComplete}
                    open={cropDialogOpen}
                    onOpenChange={(isOpen) => {
                      setCropDialogOpen(isOpen);
                      if (!isOpen && !selectedImage) {
                        // Only revoke the URL if we don't have a selected image
                        if (imageToCrop) {
                          URL.revokeObjectURL(imageToCrop);
                          setImageToCrop(null);
                        }
                      }
                    }}
                  />
                )}

                {/* Submit section */}
                <div className="flex justify-end mt-8">
                  <Button type="submit" size="lg" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Complete Registration"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}


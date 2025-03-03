"use client";

import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";

import { ChevronLeft, ChevronRight, Download, ExternalLink, Calendar, Briefcase, GraduationCap, Languages, DollarSign, FileText, IndianRupee } from "lucide-react";
import { MentorsWithRelations } from "@/server/core/dtos/mentorDtos";
import toast from "react-hot-toast";

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface ApprovalClientProps {
  mentor: MentorsWithRelations;
  mentorId: string;
}

const formatDate = (date: Date | null | undefined) => {
  if (!date) return "Present";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  });
};



export function ApprovalClient({ mentor, mentorId }: ApprovalClientProps) {
  const [currentDocIndex, setCurrentDocIndex] = useState(0);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleApproveOrReject = async () => {
    setIsLoading(true);
    try {


      // const result = await approveMentorOrReject(mentorId,status);
      // if (result.success) {
        toast.success("approved");
      // }
    } catch (error) {
      toast.error("failed to status chage mentor")
    } finally {
      setIsLoading(false);
    }
  };



  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Profile Header */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={mentor.profile?.image || ""} alt={mentor.profile?.name || "Mentor"} />
                <AvatarFallback>{mentor.profile?.name?.substring(0, 2) || "MN"}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">{mentor.profile?.name}</CardTitle>
                <CardDescription className="text-lg">{mentor.expertise}</CardDescription>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={
                    mentor.verified === "verified" ? "default" :
                    mentor.verified === "rejected" ? "destructive" : "secondary"
                  }>
                    {mentor.verified?.toUpperCase()}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <IndianRupee className="h-3 w-3" /> {mentor.hourlyRate}/hr
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                variant="default"
                onClick={handleApproveOrReject}
                disabled={isLoading || mentor.verified === "verified"}
              >
                Approve
              </Button>
              <Button
                variant="destructive"
                onClick={handleApproveOrReject}
                disabled={isLoading || mentor.verified === "rejected"}
              >
                Reject
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Mentor Details Tabs */}
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="experience">Experience</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>About Me</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{mentor.aboutMe || "No information provided."}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p>{mentor.profile?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p>{mentor.profile?.phone || "Not provided"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Gender</p>
                  <p>{mentor.profile?.gender ? mentor.profile.gender.charAt(0).toUpperCase() + mentor.profile.gender.slice(1) : "Not provided"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date of Birth</p>
                  <p>{mentor.profile?.dob ? formatDate(mentor.profile.dob) : "Not provided"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Skills & Languages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {mentor.skills.length > 0 ? (
                      mentor.skills.map((skill) => (
                        <Badge key={skill.id} variant="secondary" className="text-sm py-1">
                          {skill.name}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-muted-foreground">No skills listed</p>
                    )}
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Languages className="h-4 w-4" /> Languages
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {mentor.languages.length > 0 ? (
                      mentor.languages.map((language, index) => (
                        <Badge key={index} variant="outline" className="text-sm py-1 capitalize">
                          {language}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-muted-foreground">No languages listed</p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Experience Tab */}
        <TabsContent value="experience">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" /> Work Experience
              </CardTitle>
            </CardHeader>
            <CardContent>
              {mentor.experiences.length > 0 ? (
                <div className="space-y-6">
                  {mentor.experiences.map((exp,index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="relative pl-6 pb-6 border-l border-muted last:pb-0"
                    >
                      <div className="absolute w-3 h-3 bg-primary rounded-full -left-1.5 top-1.5" />
                      <h3 className="font-semibold text-lg">{exp.role}</h3>
                      <p className="text-muted-foreground">{exp.company}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                      </p>
                      <p className="mt-2">{exp.description}</p>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No experience information provided.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Education Tab */}
        <TabsContent value="education">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" /> Education
              </CardTitle>
            </CardHeader>
            <CardContent>
              {mentor.educations.length > 0 ? (
                <div className="space-y-6">
                  {mentor.educations.map((edu,index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="relative pl-6 pb-6 border-l border-muted last:pb-0"
                    >
                      <div className="absolute w-3 h-3 bg-primary rounded-full -left-1.5 top-1.5" />
                      <h3 className="font-semibold text-lg">{edu.degree}</h3>
                      <p className="text-muted-foreground">{edu.institution}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                      </p>
                      <p className="mt-2">{edu.description}</p>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No education information provided.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" /> Document Verification
              </CardTitle>
              <CardDescription>
                Review uploaded documents for verification purposes
              </CardDescription>
            </CardHeader>
            <CardContent>
              {mentor.documents.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <p className="font-medium">
                      Document {currentDocIndex + 1} of {mentor.documents.length}
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentDocIndex((prev) => Math.max(0, prev - 1))}
                        disabled={currentDocIndex === 0}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(mentor.documents[currentDocIndex], '_blank')}
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        View
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                      >
                        <a href={mentor.documents[currentDocIndex]} download target="_blank" rel="noreferrer">
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </a>
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentDocIndex((prev) => Math.min(mentor.documents.length - 1, prev + 1))}
                        disabled={currentDocIndex === mentor.documents.length - 1}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="border rounded-lg overflow-hidden bg-muted/30">
                    <Document
                      file={mentor.documents[currentDocIndex]}
                      onLoadSuccess={onDocumentLoadSuccess}
                      loading={
                        <div className="h-96 flex items-center justify-center">
                          <p>Loading document...</p>
                        </div>
                      }
                      error={
                        <div className="h-96 flex items-center justify-center">
                          <p>Failed to load PDF. Try downloading instead.</p>
                        </div>
                      }
                    >
                      <Page
                        pageNumber={1}
                        width={700}
                        className="max-w-full mx-auto"
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                      />
                    </Document>
                    {numPages && numPages > 1 && (
                      <div className="text-center p-2 bg-muted/50">
                        <p>This document has {numPages} pages. View all pages by opening the PDF.</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">No documents provided.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
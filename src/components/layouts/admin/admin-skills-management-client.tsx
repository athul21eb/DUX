'use client'

import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { Pencil, Trash2, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { createSkill, deleteSkill, getAllSkills, updateSkill } from "@/lib/actions/admin/skillsManagement/skillsManagementActions";
import toast from "react-hot-toast";
import ReusableTable from "../../shared/reusableTable";
import PaginationComponent from "../../shared/reusablePagenation";
import ConfirmDialog from "../../shared/reusableConfirmAlertDialog";
import FormDialog from "../../shared/reusableFormDialog";
import { skillFormType, skillSchema } from "@/utils/validator/skillform";
import { getAllSkillsDTO } from "@/server/core/dtos/skillDtos";

import { Get_All_Skills_With_Pagination_Server_Action } from "@/server/actions/admin/skillManagement/get-all-skills.server-action";
import { Skill } from "@/server/core/entities/skill";
import { Admin_Create_Skill_Server_Action } from "@/server/actions/admin/skillManagement/create-skill.server-action";
import { Admin_Delete_Skill_Server_Action } from "@/server/actions/admin/skillManagement/delete-skill.server-action";
import { Admin_Update_Skill_Server_Action } from "@/server/actions/admin/skillManagement/update-skill.server-action";

// Define the Skill management props interface
interface SkillManagementProps extends getAllSkillsDTO {
  currentPage: number;
  itemsPerPage: number;
}

const SkillManagement = ({
  skills: initialSkills,
  totalPages: initialTotalPages,
  currentPage: initialCurrentPage,
  totalCount: initialTotalCount,
  itemsPerPage
}: SkillManagementProps) => {
  // Table headers definition
  const headers = ["No", "Skill Name", "Description", "Actions"];

  // State management
  const [skills, setSkills] = useState<Skill[]>(initialSkills ?? []);
  const [totalPages, setTotalPages] = useState<number>(initialTotalPages ?? 1);
  const [currentPage, setCurrentPage] = useState<number>(initialCurrentPage ?? 1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentSkill, setCurrentSkill] = useState<Skill | null>(null);
  const [totalCount,setTotalCount] = useState<number>(initialTotalCount??1)
  const [isPending, startTransition] = useTransition();


  //  useEffect(() => {
  //   setSkills(initialSkills ?? []);
  //   setTotalPages(initialTotalPages ?? 1);
  //   setCurrentPage(initialCurrentPage ?? 1);
  // }, [initialSkills, initialTotalPages, initialCurrentPage]);

  // Initialize form with Zod schema
  const form = useForm<skillFormType>({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      name: "",
      description: "",
    }
  });

  // Pagination handler
  const handlePageChange = async (newPage: number) => {
    startTransition(async () => {
      const result = await Get_All_Skills_With_Pagination_Server_Action(newPage, itemsPerPage);

      if (result.success && result.data) {
        setCurrentPage(newPage);
        setSkills(result.data.skills);
        setTotalPages(result.data.totalPages);
        setTotalCount(result.data.totalCount);
      }
    });
  };

  // Event handlers
  const handleEdit = (skill: Skill) => {
    setCurrentSkill(skill);
    form.reset({
      ...skill,
      description: skill.description ?? "", // Convert null to empty string
    });
    setDialogOpen(true);
  };

  const handleDelete = (skill: Skill) => {
    setCurrentSkill(skill);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (currentSkill) {
      const result = await Admin_Delete_Skill_Server_Action(currentSkill.id);

      if (result.success) {

        setDeleteDialogOpen(false);

        // Adjust page if we delete the last item on a page
        const newPageCount = Math.ceil((totalCount - 1) / itemsPerPage);
        if (currentPage > newPageCount && newPageCount > 0) {
          setCurrentPage(newPageCount);
          await handlePageChange(newPageCount);
        } else {
          // Refresh current page
          await handlePageChange(currentPage);
        }

        toast.success(result.message || "Skill deleted successfully");
      } else {
        console.error(result.message);
        toast.error(result.message || "Failed to delete skill");
      }
    }
  };

  const onSubmit = async (data: skillFormType) => {
    let result: any;

    if (currentSkill?.id) {
      // Edit existing skill
      result = await Admin_Update_Skill_Server_Action({ ...data, id: currentSkill.id });

      if (result.success) {
        await handlePageChange(currentPage);
        toast.success(result.message || "Skill updated successfully");
      }
    } else {
      // Add new skill
      result = await Admin_Create_Skill_Server_Action(data);

      if (result.success) {
        const newPageCount = Math.ceil((totalCount + 1) / itemsPerPage);

        if (newPageCount > totalPages) {
          // Go to the new last page if a new page was created
          setCurrentPage(newPageCount);
          await  handlePageChange(newPageCount);
        } else {
          // Otherwise refresh current page
          await  handlePageChange(currentPage);
        }

        toast.success(result.message || "Skill created successfully");
      }
    }

    if (result.success) {
      // Reset form and close the dialog
      form.reset();
      setDialogOpen(false);
      setCurrentSkill(null);
    } else {
      console.error("Error:", result?.message);
      toast.error(result?.message || "An error occurred");
    }
  };

  const openNewSkillDialog = () => {
    form.reset({ name: "", description: "" });
    setCurrentSkill(null);
    setDialogOpen(true);
  };

  // Form fields renderer
  const renderSkillFields = (form: any) => (
    <>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Skill Name</FormLabel>
            <FormControl>
              <Input placeholder="Enter skill name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Input placeholder="Enter skill description" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );

  // Calculate starting number for the skill list
  const skillNumberStart = 1 + (currentPage - 1) * itemsPerPage;

  // Generate table rows from skills data
  const rows = skills.map((skill, index) => [
    skillNumberStart + index,
    skill.name,
    skill.description,
    <div key={`actions-${skill.id}`} className="flex  space-x-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleEdit(skill)}
      >
        <Pencil className="h-4 w-4 mr-1" />
        Edit
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
        onClick={() => handleDelete(skill)}
      >
        <Trash2 className="h-4 w-4 mr-1" />
        Delete
      </Button>
    </div>
  ]);

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Skill Management</h1>
        <Button onClick={openNewSkillDialog}>
          <Plus className="h-4 w-4 mr-1" />
          Add New Skill
        </Button>
      </div>

      {/* Table component */}
      <ReusableTable headers={headers} rows={rows} />

      {/* Pagination component */}
      <PaginationComponent
        currentPage={currentPage}
        pageCount={totalPages}
        onPageChange={handlePageChange}
        isLoading={isPending}
      />

      {/* Form dialog for add/edit */}
      <FormDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={onSubmit}
        title={currentSkill ? "Edit Skill" : "Add New Skill"}
        currentItem={currentSkill}
        form={form}
        renderFields={renderSkillFields}
      />

      {/* Confirmation dialog for delete */}
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Are you sure?"
        description={`This will permanently delete the skill "${currentSkill?.name}". This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="destructive"
      />
    </div>
  );
};

export default SkillManagement;
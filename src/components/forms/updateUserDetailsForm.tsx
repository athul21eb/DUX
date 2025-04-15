"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { CardWrapper } from "../shared/cardWrapper";
import { DatePicker } from "@/components/ui/date-picker";
import toast from "react-hot-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"; // Import Shadcn Avatar components

import { UserFormValues, UserSchema } from "@/utils/validator/userformupdate";
import { getSession, useSession } from "next-auth/react";
import { IUser } from "@/server/core/entities/user";
import { Gender, UserProfileDTO } from "@/server/core/dtos/userDtos";
import { update_User_Details_Server_Action } from "@/server/actions/user/updateUserDetails.serverAction";

export function UserProfileForm({ user }: { user: UserProfileDTO }) {
  const [loading, setLoading] = useState<boolean>(false);
  const [imagePreview, setImagePreview] = useState<string>(user?.image || "");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imageError, setImageError] = useState<boolean>(false); // State for image loading error
  const { data: session, update } = useSession();

  const form = useForm<UserFormValues>({
    resolver: zodResolver(UserSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      gender: (user?.gender as Gender) || undefined,

      dob: user?.dob ? new Date(user.dob) : undefined,
      image: user?.image || "",
    },
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        // File size is greater than 10MB

        toast.error("Please select an image less than 10MB.");
        return;
      }

      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
      setImageError(false); // Reset error state on new image selection
    }
  };

  const handleImageError = () => {
    setImageError(true); // Set error state if image fails to load
  };
  const onSubmit = async (data: UserFormValues) => {
    try {
      setLoading(true);
      console.log("Form submitted", data);

      const res = await update_User_Details_Server_Action(data, selectedImage);

      if (res.success) {
        if (res.data?.name || res.data?.image) {
          const updatedUser = {
            ...session?.user, // Ensure session exists
            name: res.data?.name,
            image: res.data?.image, // Update with new image URL
          };

          await update({ user: updatedUser });

          await getSession();
        }

        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <CardWrapper title="User Profile" description="Manage your profile details">
      <div className="flex flex-col items-center ">
        <div className="relative w-24 h-24">
          <Avatar className="w-24 h-24">
            <AvatarImage
              src={imagePreview}
              alt="User Avatar"
              onError={handleImageError} // Handle image loading errors
            />
            <AvatarFallback>
              {user?.name?.charAt(0) || "U"}{" "}
              {/* Fallback to user's initial or "U" */}
            </AvatarFallback>
          </Avatar>
          <label
            htmlFor="image-upload"
            className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-1 cursor-pointer hover:bg-blue-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z"
                clipRule="evenodd"
              />
            </svg>
          </label>
        </div>
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />
        {imageError && (
          <p className="text-sm text-red-500 mt-2">
            Failed to load image. Please try again.
          </p>
        )}
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="John Doe" className="w-full" />
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
                  <Input
                    {...field}
                    placeholder="johndoe@email.com"
                    type="email"
                    disabled
                    className="w-full"
                  />
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
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="123-456-7890"
                    type="tel"
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="prefer-not-to-say">
                      Prefer not to say
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dob"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date of Birth</FormLabel>
                <FormControl>
                  <DatePicker
                    selected={field.value}
                    onChange={(date) => field.onChange(date)}
                    placeholderText="Select date"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="col-span-1 md:col-span-2 flex justify-end">
            <Button
              type="submit"
              className="w-full md:w-auto"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Profile"}
            </Button>
          </div>
        </form>
      </Form>
    </CardWrapper>
  );
}

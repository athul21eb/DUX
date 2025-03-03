'use client'

import React, { useState, useRef } from "react";
import ReactCrop, {
  type Crop as CropType,
  centerCrop,
  makeAspectCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Crop } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// Helper function to create a cropped image
async function getCroppedImg(image: HTMLImageElement, crop: CropType): Promise<Blob> {
  const canvas = document.createElement("canvas");
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  canvas.width = crop.width;
  canvas.height = crop.height;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("No 2d context");
  }

  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    crop.width,
    crop.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Canvas is empty"));
          return;
        }
        resolve(blob);
      },
      "image/jpeg",
      0.95
    );
  });
}

interface ImageCropperProps {
  imageSrc: string;
  onCropComplete: (file: File, previewUrl: string) => void;
  aspectRatio?: number;
  circularCrop?: boolean;
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export const ImageCropper: React.FC<ImageCropperProps> = ({
  imageSrc,
  onCropComplete,
  aspectRatio = 1,
  circularCrop = true,
  open,
  onOpenChange,
}) => {
  const [crop, setCrop] = useState<CropType>({
    unit: "%",
    width: 90,
    height: 90,
    x: 5,
    y: 5,
  });

  const imgRef = useRef<HTMLImageElement | null>(null);

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    imgRef.current = e.currentTarget;

    const newCrop = centerCrop(
      makeAspectCrop(
        {
          unit: "%",
          width: 90,
        },
        aspectRatio,
        width,
        height
      ),
      width,
      height
    );

    setCrop(newCrop);
  };


  // In your ImageCropper component, modify the completeCrop function:
  const completeCrop = async () => {
    if (imgRef.current) {
      try {
        let cropToApply = crop;

        // Apply default crop if dimensions are not set
        if (!crop.width || !crop.height) {
          const { width, height } = imgRef.current;
          cropToApply = centerCrop(
            makeAspectCrop(
              {
                unit: "%",
                width: 90,
              },
              aspectRatio,
              width,
              height
            ),
            width,
            height
          );
        }

        const croppedImageBlob = await getCroppedImg(imgRef.current, cropToApply);
        const croppedImageFile = new File([croppedImageBlob], "cropped-image.jpg", {
          type: "image/jpeg",
        });

        onCropComplete(croppedImageFile, URL.createObjectURL(croppedImageBlob));
      } catch (error) {
        console.error("Error cropping image:", error);
      }
    }
  };


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full sm:w-[400px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Crop Image</DialogTitle>
          <DialogDescription>
            Adjust the crop area to select the part of the image you want to use
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center my-4">
          {imageSrc && (
            <ReactCrop
              crop={crop}
              onChange={(c) => setCrop(c)}
              aspect={aspectRatio}
              circularCrop={circularCrop}
              keepSelection
            >
              <img
                src={imageSrc}
                alt="Crop preview"
                onLoad={onImageLoad}
                className="max-h-[60vh] object-contain"
              />
            </ReactCrop>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              completeCrop();
              onOpenChange(false);
            }}
          >
            <Crop className="h-4 w-4 mr-2" /> Apply Crop
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

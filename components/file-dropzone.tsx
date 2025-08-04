"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Upload, X, FileImage } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FileDropzoneProps {
  onFileSelect: (file: File | null) => void
  accept?: string
  maxSize?: number
  currentFile?: string
  placeholder?: string
}

export function FileDropzone({
  onFileSelect,
  accept = ".jpeg,.png,.jpg,.gif,.svg,.webp",
  maxSize = 5 * 1024 * 1024, // 5MB
  currentFile,
  placeholder = "Glissez votre fichier ici ou cliquez pour sélectionner",
}: FileDropzoneProps) {
  const [preview, setPreview] = useState<string | null>(currentFile || null)

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = () => {
          setPreview(reader.result as string)
        }
        reader.readAsDataURL(file)
        onFileSelect(file)
      }
    },
    [onFileSelect],
  )

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: {
      "image/*": accept.split(",").map((ext) => ext.trim()),
    },
    maxSize,
    multiple: false,
  })

  const removeFile = () => {
    setPreview(null)
    onFileSelect(null)
  }

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25"}
          ${preview ? "border-green-500 bg-green-50 dark:bg-green-950" : ""}
          hover:border-primary hover:bg-primary/5
        `}
      >
        <input {...getInputProps()} />

        {preview ? (
          <div className="space-y-4">
            <div className="relative inline-block">
              <img
                src={preview || "/placeholder.svg"}
                alt="Preview"
                className="max-w-32 max-h-32 object-cover rounded-lg mx-auto"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                onClick={(e) => {
                  e.stopPropagation()
                  removeFile()
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
            <p className="text-sm text-green-600 dark:text-green-400">✅ Fichier sélectionné</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="mx-auto w-12 h-12 text-muted-foreground">
              {isDragActive ? <Upload className="w-full h-full" /> : <FileImage className="w-full h-full" />}
            </div>
            <div>
              <p className="text-sm font-medium">{isDragActive ? "Déposez le fichier ici" : placeholder}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Formats acceptés: {accept} (max {Math.round(maxSize / 1024 / 1024)}MB)
              </p>
            </div>
          </div>
        )}
      </div>

      {fileRejections.length > 0 && (
        <div className="text-sm text-red-600 dark:text-red-400">
          {fileRejections.map(({ file, errors }) => (
            <div key={file.name}>
              {errors.map((error) => (
                <p key={error.code}>❌ {error.message}</p>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

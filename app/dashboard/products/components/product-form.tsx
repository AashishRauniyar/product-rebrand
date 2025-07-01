"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemeCustomizer } from "./theme-customizer";
import type { ProductTheme } from "@/lib/models/product-theme";
import { Plus, Trash2, AlertCircle } from "lucide-react";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface IngredientWithPreview {
  id?: string;
  title: string;
  description: string;
  image?: string | File;
  image_preview?: string;
  display_order: number;
}

interface WhyChoose {
  id?: string;
  title: string;
  description: string;
  display_order: number;
}

interface ProductFormProps {
  productId?: string;
  initialData?: {
    name: string;
    paragraph: string;
    bullet_points: string[];
    redirect_link: string;
    generated_link: string;
    money_back_days: number;
    image?: string;
    badge_image?: string;
    theme?: ProductTheme;
    ingredients?: IngredientWithPreview[];
    why_choose?: WhyChoose[];
  };
}

export function ProductForm({ productId, initialData }: ProductFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState("general");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [ingredientErrors, setIngredientErrors] = useState<
    Record<string, Record<string, string>>
  >({});
  const [whyChooseErrors, setWhyChooseErrors] = useState<
    Record<string, Record<string, string>>
  >({});

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    paragraph: initialData?.paragraph || "",
    bullet_points: initialData?.bullet_points || [],
    redirect_link: initialData?.redirect_link || "",
    generated_link: initialData?.generated_link || "",
    money_back_days: initialData?.money_back_days || 60,
    image: null as File | null,
    badge_image: null as File | null,
    theme: initialData?.theme || undefined,
  });

  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData?.image || null
  );
  const [badgeImagePreview, setBadgeImagePreview] = useState<string | null>(
    initialData?.badge_image || null
  );

  const [ingredients, setIngredients] = useState<IngredientWithPreview[]>(
    initialData?.ingredients || []
  );

  const [whyChoose, setWhyChoose] = useState<WhyChoose[]>(
    initialData?.why_choose || []
  );

  const [nameError, setNameError] = useState("");
  const [isCheckingName, setIsCheckingName] = useState(false);
  const debouncedName = useDebounce(formData.name, 500);

  const [descriptionError, setDescriptionError] = useState("");
  const [paragraphError, setParagraphError] = useState("");
  const [bulletPointsError, setBulletPointsError] = useState("");

  // Add name validation effect
  useEffect(() => {
    const checkProductName = async () => {
      if (!debouncedName) {
        setNameError("");
        return;
      }

      setIsCheckingName(true);
      try {
        const response = await fetch(
          `/api/products/check-name?name=${encodeURIComponent(debouncedName)}${
            productId ? `&excludeId=${productId}` : ""
          }`
        );
        const data = await response.json();

        if (data.exists) {
          setNameError("A product with this name already exists");
          toast.error("A product with this name already exists");
        } else {
          setNameError("");
        }
      } catch (error) {
        console.error("Error checking product name:", error);
        toast.error("Failed to check product name");
      } finally {
        setIsCheckingName(false);
      }
    };

    checkProductName();
  }, [debouncedName, productId]);

  // Add image validation state
  const [imageError, setImageError] = useState("");

  // Handle form input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newFormData = { ...prev, [name]: value };

      // Auto-generate product link when name changes
      if (name === "name") {
        const baseUrl = window.location.origin;
        const slug = value
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");
        newFormData.generated_link = `${baseUrl}/preview/${slug}`;
      }

      return newFormData;
    });
  };

  // Update handleImageChange to include validation
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const fieldName = e.target.name;

      // Validate file type
      if (!file.type.startsWith("image/")) {
        setImageError("Please upload an image file");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setImageError("Image size should be less than 5MB");
        return;
      }

      setImageError("");
      setFormData((prev) => ({ ...prev, [fieldName]: file }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        if (fieldName === "image") {
          setImagePreview(event.target?.result as string);
        } else if (fieldName === "badge_image") {
          setBadgeImagePreview(event.target?.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle theme changes
  const handleThemeChange = (theme: ProductTheme) => {
    setFormData((prev) => ({ ...prev, theme }));
  };

  // Add a new ingredient
  const addIngredient = () => {
    setIngredients((prev) => [
      ...prev,
      {
        title: "",
        description: "",
        image: undefined,
        display_order: prev.length,
      },
    ]);
  };

  // Remove an ingredient
  const removeIngredient = (index: number) => {
    setIngredients((prev) => prev.filter((_, i) => i !== index));

    // Remove any errors for this ingredient
    setIngredientErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[index.toString()];
      return newErrors;
    });
  };

  // Handle ingredient input changes
  const handleIngredientChange = (
    index: number,
    field: string,
    value: string
  ) => {
    setIngredients((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });

    // Clear error for this field if it exists
    if (ingredientErrors[index]?.[field]) {
      setIngredientErrors((prev) => {
        const newErrors = { ...prev };
        if (newErrors[index]) {
          delete newErrors[index][field];
          if (Object.keys(newErrors[index]).length === 0) {
            delete newErrors[index];
          }
        }
        return newErrors;
      });
    }
  };

  // Handle ingredient image changes
  const handleIngredientImageChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      setIngredients((prev) => {
        const updated = [...prev];
        updated[index] = { ...updated[index], image: file };
        return updated;
      });

      // Create preview for the ingredient image
      const reader = new FileReader();
      reader.onload = (event) => {
        setIngredients((prev) => {
          const updated = [...prev];
          updated[index] = {
            ...updated[index],
            image_preview: event.target?.result as string,
          };
          return updated;
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Add a new why choose point
  const addWhyChoose = () => {
    setWhyChoose((prev) => [
      ...prev,
      {
        title: "",
        description: "",
        display_order: prev.length,
      },
    ]);
  };

  // Remove a why choose point
  const removeWhyChoose = (index: number) => {
    setWhyChoose((prev) => prev.filter((_, i) => i !== index));

    // Remove any errors for this why choose point
    setWhyChooseErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[index.toString()];
      return newErrors;
    });
  };

  // Handle why choose input changes
  const handleWhyChooseChange = (
    index: number,
    field: string,
    value: string
  ) => {
    setWhyChoose((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });

    // Clear error for this field if it exists
    if (whyChooseErrors[index]?.[field]) {
      setWhyChooseErrors((prev) => {
        const newErrors = { ...prev };
        if (newErrors[index]) {
          delete newErrors[index][field];
          if (Object.keys(newErrors[index]).length === 0) {
            delete newErrors[index];
          }
        }
        return newErrors;
      });
    }
  };

  // Handle paragraph changes - New function
  const handleParagraphChange = (value: string) => {
    if (value.length <= 160) {
      setFormData((prev) => ({ ...prev, paragraph: value }));
      // Validate paragraph on change
      if (!value.trim()) {
        setParagraphError("Introduction paragraph is required");
      } else {
        setParagraphError("");
      }
    }
  };

  // Handle bullet point changes - Update to use formData.bullet_points
  const handleBulletPointChange = (index: number, value: string) => {
    const newBulletPoints = [...formData.bullet_points];
    newBulletPoints[index] = value;
    setFormData((prev) => ({ ...prev, bullet_points: newBulletPoints }));

    // Validate bullet points on change
    validateBulletPoints(newBulletPoints);
  };

  const addBulletPoint = () => {
    if (formData.bullet_points.length < 7) {
      setFormData((prev) => ({
        ...prev,
        bullet_points: [...prev.bullet_points, ""],
      }));
    }
  };

  const removeBulletPoint = (index: number) => {
    const newBulletPoints = formData.bullet_points.filter(
      (_, i) => i !== index
    );
    setFormData((prev) => ({ ...prev, bullet_points: newBulletPoints }));

    // Validate bullet points after removing
    validateBulletPoints(newBulletPoints);
  };

  // Update validateBulletPoints function
  const validateBulletPoints = (points: string[]) => {
    if (points.length < 4) {
      setBulletPointsError("Minimum 4 bullet points are required");
      return false;
    }
    if (points.length > 7) {
      setBulletPointsError("Maximum 7 bullet points are allowed");
      return false;
    }
    if (points.some((point) => !point.trim())) {
      setBulletPointsError("All bullet points must be filled");
      return false;
    }
    setBulletPointsError("");
    return true;
  };

  // Update validateCurrentStep to check paragraph and bullet_points separately
  const validateCurrentStep = () => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    switch (currentStep) {
      case "general":
        if (!formData.name.trim()) {
          newErrors.name = "Product name is required";
          isValid = false;
        }

        // Validate paragraph
        if (!formData.paragraph.trim()) {
          setParagraphError("Introduction paragraph is required");
          isValid = false;
        } else {
          setParagraphError("");
        }

        // Validate bullet points
        if (!validateBulletPoints(formData.bullet_points)) {
          newErrors.bullet_points = bulletPointsError; // Use the specific bullet points error
          isValid = false;
        }

        if (!formData.redirect_link.trim()) {
          newErrors.redirect_link = "Redirect link is required";
          isValid = false;
        } else if (!isValidUrl(formData.redirect_link)) {
          newErrors.redirect_link = "Invalid URL format";
          isValid = false;
        }
        if (!formData.generated_link.trim()) {
          newErrors.generated_link = "Generated link is required";
          isValid = false;
        } else if (!isValidUrl(formData.generated_link)) {
          newErrors.generated_link = "Invalid URL format";
          isValid = false;
        }
        if (
          !formData.money_back_days ||
          isNaN(Number(formData.money_back_days))
        ) {
          newErrors.money_back_days =
            "Money back guarantee days must be a number";
          isValid = false;
        }
        // Add image validation
        if (!productId && !formData.image && !imagePreview) {
          newErrors.image = "Product image is required";
          setImageError("Product image is required");
          isValid = false;
        }
        break;

      case "ingredients":
        ingredients.forEach((ingredient, index) => {
          if (!ingredient.title.trim()) {
            newErrors[`ingredient_${index}_title`] = "Title is required";
            isValid = false;
          }
          if (!ingredient.description.trim()) {
            newErrors[`ingredient_${index}_description`] =
              "Description is required";
            isValid = false;
          }
        });
        break;

      case "why-choose":
        whyChoose.forEach((item, index) => {
          if (!item.title.trim()) {
            newErrors[`why_choose_${index}_title`] = "Title is required";
            isValid = false;
          }
          if (!item.description.trim()) {
            newErrors[`why_choose_${index}_description`] =
              "Description is required";
            isValid = false;
          }
        });
        break;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle step navigation
  const handleNextStep = () => {
    if (validateCurrentStep()) {
      const steps = ["general", "ingredients", "why-choose", "appearance"];
      const currentIndex = steps.indexOf(currentStep);
      if (currentIndex < steps.length - 1) {
        setCurrentStep(steps[currentIndex + 1]);
      }
    }
  };

  const handlePreviousStep = () => {
    const steps = ["general", "ingredients", "why-choose", "appearance"];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  // Check if a string is a valid URL
  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  // Add this function at the top-level inside ProductForm
  function mapThemeToBackend(theme: any) {
    if (!theme) return undefined;
    return {
      primary_bg_color: theme.primary_bg_color,
      secondary_bg_color: theme.secondary_bg_color,
      accent_bg_color: theme.accent_bg_color,
      primary_text_color: theme.primary_text_color,
      secondary_text_color: theme.secondary_text_color,
      accent_text_color: theme.accent_text_color,
      link_color: theme.link_color,
      link_hover_color: theme.link_hover_color,
      primary_button_bg: theme.primary_button_bg,
      primary_button_text: theme.primary_button_text,
      primary_button_hover_bg: theme.primary_button_hover_bg,
      secondary_button_bg: theme.secondary_button_bg,
      secondary_button_text: theme.secondary_button_text,
      secondary_button_hover_bg: theme.secondary_button_hover_bg,
      card_bg_color: theme.card_bg_color,
      card_border_color: theme.card_border_color,
      card_shadow_color: theme.card_shadow_color,
      header_bg_color: theme.header_bg_color,
      header_text_color: theme.header_text_color,
      footer_bg_color: theme.footer_bg_color,
      footer_text_color: theme.footer_text_color,
      font_family: theme.font_family,
      h1_font_size: theme.h1_font_size,
      h1_font_weight: theme.h1_font_weight,
      h2_font_size: theme.h2_font_size,
      h2_font_weight: theme.h2_font_weight,
      h3_font_size: theme.h3_font_size,
      h3_font_weight: theme.h3_font_weight,
      body_font_size: theme.body_font_size,
      body_line_height: theme.body_line_height,
      section_padding: theme.section_padding,
      card_padding: theme.card_padding,
      button_padding: theme.button_padding,
      border_radius_sm: theme.border_radius_sm,
      border_radius_md: theme.border_radius_md,
      border_radius_lg: theme.border_radius_lg,
      border_radius_xl: theme.border_radius_xl,
      max_width: theme.max_width,
      container_padding: theme.container_padding,
      gradient_start: theme.gradient_start,
      gradient_end: theme.gradient_end,
      shadow_color: theme.shadow_color,
      custom_css: theme.custom_css,
    };
  }

  // Handle form submission - Update to send paragraph and bullet_points separately
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (nameError) {
      toast.error("Please fix the product name error before submitting");
      return;
    }

    if (!validateCurrentStep()) {
      // Scroll to the first tab with an error if necessary
      const steps = ["general", "ingredients", "why-choose", "appearance"];
      for (const step of steps) {
        const stepErrors = Object.keys(errors).filter((key) =>
          step === "general"
            ? !key.startsWith("ingredient_") && !key.startsWith("why_choose_")
            : step === "ingredients"
            ? key.startsWith("ingredient_")
            : step === "why-choose"
            ? key.startsWith("why_choose_")
            : false
        );
        if (
          stepErrors.length > 0 ||
          (step === "general" && (paragraphError || bulletPointsError))
        ) {
          setCurrentStep(step);
          break;
        }
      }
      toast.error("Please fix the errors before submitting");
      return;
    }

    setIsLoading(true);
    setErrors({}); // Clear form errors before submitting
    setParagraphError(""); // Clear paragraph error
    setBulletPointsError(""); // Clear bullet points error

    try {
      const submitData = new FormData();
      submitData.append("name", formData.name);
      // Append paragraph and bullet_points separately
      submitData.append("paragraph", formData.paragraph);
      submitData.append(
        "bullet_points",
        JSON.stringify(formData.bullet_points)
      );
      submitData.append("redirect_link", formData.redirect_link);
      submitData.append("generated_link", formData.generated_link);
      submitData.append("money_back_days", formData.money_back_days.toString());

      if (formData.image) {
        submitData.append("image", formData.image);
      }

      if (formData.badge_image) {
        submitData.append("badge_image", formData.badge_image);
      }

      if (formData.theme) {
        const backendTheme = mapThemeToBackend(formData.theme);
        submitData.append("theme", JSON.stringify(backendTheme));
      }

      // Add ingredients data
      submitData.append(
        "ingredients",
        JSON.stringify(
          ingredients.map((ing) => ({
            id: ing.id, // Include ID for existing ingredients
            title: ing.title,
            description: ing.description,
            display_order: ing.display_order,
            // We'll handle the image files separately
          }))
        )
      );

      // Add ingredient images
      ingredients.forEach((ingredient, index) => {
        if (ingredient.image instanceof File) {
          submitData.append(`ingredient_image_${index}`, ingredient.image);
        } else if (typeof ingredient.image === "string") {
          // If it's an existing image path, send it back
          submitData.append(
            `ingredient_image_${index}_existing`,
            ingredient.image
          );
        }
      });

      // Add why choose data
      submitData.append(
        "why_choose",
        JSON.stringify(
          whyChoose.map((wc) => ({
            id: wc.id, // Include ID for existing why choose points
            title: wc.title,
            description: wc.description,
            display_order: wc.display_order,
          }))
        )
      );

      const url = productId ? `/api/products/${productId}` : "/api/products";
      const method = productId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        body: submitData,
      });

      const data = await response.json();

      if (!response.ok) {
        // Check for specific validation errors from backend
        if (data.errors) {
          setErrors(data.errors);
          // Also check for paragraph/bullet points specific errors if sent by backend
          if (data.errors.paragraph) setParagraphError(data.errors.paragraph);
          if (data.errors.bullet_points)
            setBulletPointsError(data.errors.bullet_points);
          // Scroll to the first tab with an error if necessary
          const steps = ["general", "ingredients", "why-choose", "appearance"];
          for (const step of steps) {
            const stepErrors = Object.keys(data.errors).filter(
              (key) =>
                step === "general"
                  ? !key.startsWith("ingredient_") &&
                    !key.startsWith("why_choose_") &&
                    key !== "paragraph" &&
                    key !== "bullet_points" // General errors excluding paragraph/bullet_points
                  : step === "ingredients"
                  ? key.startsWith("ingredient_") // Ingredient errors
                  : step === "why-choose"
                  ? key.startsWith("why_choose_")
                  : false // Why Choose errors
            );
            // Check if the current step has errors or if it's the general step with paragraph/bullet point errors
            if (
              stepErrors.length > 0 ||
              (step === "general" &&
                (data.errors.paragraph || data.errors.bullet_points))
            ) {
              setCurrentStep(step);
              break;
            }
          }
        } else {
          setErrors({ general: data.error || "Something went wrong" });
        }
        toast.error(data.error || "Failed to save product");
        return;
      }

      toast.success(productId ? "Product updated!" : "Product created!");
      // Redirect to product page or dashboard
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrors({ general: "Failed to submit form" });
      toast.error("Failed to submit form");
    } finally {
      setIsLoading(false);
    }
  };

  // Prevent form submission when Enter is pressed unless explicitly clicking submit button
  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter') {
      // Only allow Enter submission if we're on the appearance step AND the target is the submit button
      const target = e.target as HTMLElement;
      const isSubmitButton = target.getAttribute('type') === 'submit';
      
      if (currentStep !== 'appearance' || !isSubmitButton) {
        e.preventDefault();
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
      <Tabs value={currentStep} onValueChange={setCurrentStep}>
        <TabsList className="mb-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
          <TabsTrigger value="why-choose">Why Choose</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>
                {productId ? "Edit Product" : "Create New Product"}
              </CardTitle>
              <CardDescription>
                {productId
                  ? "Update your product information"
                  : "Add a new product to your catalog"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <div className="relative">
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter product name"
                    className={`mt-1 block w-full rounded-md border ${
                      nameError ? "border-red-500" : "border-gray-300"
                    } shadow-sm focus:border-blue-500 focus:ring-blue-500`}
                  />
                  {isCheckingName && (
                    <div className="absolute right-2 top-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                  )}
                </div>
                {nameError && (
                  <p className="mt-1 text-sm text-red-500">{nameError}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Product Description</Label>
                <div className="space-y-6">
                  {/* Paragraph Section */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label
                        htmlFor="paragraph"
                        className="text-sm font-medium"
                      >
                        Introduction Paragraph
                      </Label>
                      <span
                        className={`text-sm ${
                          formData.paragraph.length > 160
                            ? "text-red-500"
                            : "text-gray-500"
                        }`}
                      >
                        {formData.paragraph.length}/160 characters
                      </span>
                    </div>
                    <Textarea
                      id="paragraph"
                      name="paragraph"
                      value={formData.paragraph}
                      onChange={(e) => handleParagraphChange(e.target.value)}
                      placeholder="Enter a detailed introduction paragraph about your product (max 160 characters)"
                      rows={4}
                      maxLength={160}
                      className={paragraphError ? "border-red-500" : ""}
                    />
                    {paragraphError && (
                      <p className="text-sm text-red-500">{paragraphError}</p>
                    )}
                    <p className="text-sm text-gray-500">
                      Write a compelling introduction paragraph that describes
                      your product. Maximum 160 characters allowed.
                    </p>
                  </div>

                  {/* Bullet Points Section */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Key Features (4-7 bullet points)
                    </Label>
                    <div className="space-y-2">
                      {formData.bullet_points.map((point, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            value={point}
                            onChange={(e) =>
                              handleBulletPointChange(index, e.target.value)
                            }
                            placeholder={`Feature ${index + 1}`}
                            className={
                              bulletPointsError ? "border-red-500" : ""
                            }
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            onClick={() => removeBulletPoint(index)}
                            disabled={formData.bullet_points.length <= 4}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>

                    {formData.bullet_points.length < 7 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={addBulletPoint}
                        className="w-full"
                      >
                        <Plus className="mr-2 h-4 w-4" /> Add Feature Point
                      </Button>
                    )}

                    {bulletPointsError && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{bulletPointsError}</AlertDescription>
                      </Alert>
                    )}

                    <p className="text-sm text-gray-500">
                      Add 4-7 key features or benefits of your product. Each
                      point should be clear and concise.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="redirect_link">Redirect Link</Label>
                <Input
                  id="redirect_link"
                  name="redirect_link"
                  value={formData.redirect_link}
                  onChange={handleChange}
                  placeholder="https://example.com/checkout"
                />
                {errors.redirect_link && (
                  <p className="text-red-500 text-sm">{errors.redirect_link}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="generated_link">Product Link</Label>
                <div className="flex gap-2">
                  <Input
                    id="generated_link"
                    name="generated_link"
                    value={formData.generated_link}
                    onChange={handleChange}
                    placeholder="Product link will be generated automatically"
                    readOnly
                    className="bg-gray-50"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      if (formData.generated_link) {
                        window.open(formData.generated_link, "_blank");
                      }
                    }}
                    disabled={!formData.generated_link}
                  >
                    Preview
                  </Button>
                </div>
                <p className="text-sm text-gray-500">
                  This link will be automatically generated based on your
                  product name
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="money_back_days">
                  Money Back Guarantee (Days)
                </Label>
                <Input
                  id="money_back_days"
                  name="money_back_days"
                  type="number"
                  value={formData.money_back_days}
                  onChange={handleChange}
                  min={0}
                  required
                />
                {errors.money_back_days && (
                  <p className="text-red-500 text-sm">
                    {errors.money_back_days}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="image">Product Image</Label>
                  <Input
                    id="image"
                    name="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    required={!productId}
                    className={imageError ? "border-red-500" : ""}
                  />
                  {imageError && (
                    <p className="text-sm text-red-500">{imageError}</p>
                  )}
                  {imagePreview && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 mb-1">Preview:</p>
                      <img
                        src={
                          imagePreview.startsWith("data:")
                            ? imagePreview
                            : `/${imagePreview}`
                        }
                        alt="Product preview"
                        className="max-w-xs max-h-40 object-contain border rounded-md"
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="badge_image">Badge Image</Label>
                  <Input
                    id="badge_image"
                    name="badge_image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  {badgeImagePreview && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 mb-1">Preview:</p>
                      <img
                        src={
                          badgeImagePreview.startsWith("data:")
                            ? badgeImagePreview
                            : `/${badgeImagePreview}`
                        }
                        alt="Badge preview"
                        className="max-w-xs max-h-40 object-contain border rounded-md"
                      />
                    </div>
                  )}
                </div>
              </div>

              {errors.general && (
                <p className="text-red-500">{errors.general}</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ingredients">
          <Card>
            <CardHeader>
              <CardTitle>Product Ingredients</CardTitle>
              <CardDescription>
                Add the key ingredients of your product
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {ingredients.map((ingredient, index) => (
                  <div key={index} className="p-4 border rounded-lg relative">
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() => removeIngredient(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`ingredient-title-${index}`}>
                          Title
                        </Label>
                        <Input
                          id={`ingredient-title-${index}`}
                          value={ingredient.title}
                          onChange={(e) =>
                            handleIngredientChange(
                              index,
                              "title",
                              e.target.value
                            )
                          }
                          placeholder="Ingredient name"
                          className={
                            ingredientErrors[index]?.title
                              ? "border-red-500"
                              : ""
                          }
                        />
                        {ingredientErrors[index]?.title && (
                          <p className="text-red-500 text-sm">
                            {ingredientErrors[index].title}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`ingredient-image-${index}`}>
                          Image
                        </Label>
                        <Input
                          id={`ingredient-image-${index}`}
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            handleIngredientImageChange(index, e)
                          }
                        />
                        {(ingredient.image_preview ||
                          (typeof ingredient.image === "string" &&
                            ingredient.image)) && (
                          <div className="mt-2">
                            <p className="text-sm text-gray-500 mb-1">
                              Preview:
                            </p>
                            <img
                              src={
                                ingredient.image_preview
                                  ? ingredient.image_preview
                                  : typeof ingredient.image === "string"
                                  ? `/${ingredient.image}`
                                  : ""
                              }
                              alt={`Ingredient ${index + 1}`}
                              className="max-w-xs max-h-20 object-contain border rounded-md"
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 space-y-2">
                      <Label htmlFor={`ingredient-description-${index}`}>
                        Description
                      </Label>
                      <Textarea
                        id={`ingredient-description-${index}`}
                        value={ingredient.description}
                        onChange={(e) =>
                          handleIngredientChange(
                            index,
                            "description",
                            e.target.value
                          )
                        }
                        placeholder="Describe the ingredient and its benefits"
                        rows={3}
                        className={
                          ingredientErrors[index]?.description
                            ? "border-red-500"
                            : ""
                        }
                      />
                      {ingredientErrors[index]?.description && (
                        <p className="text-red-500 text-sm">
                          {ingredientErrors[index].description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  onClick={addIngredient}
                  className="w-full"
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Ingredient
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="why-choose">
          <Card>
            <CardHeader>
              <CardTitle>Why Choose This Product</CardTitle>
              <CardDescription>
                Add reasons why customers should choose this product
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {whyChoose.map((item, index) => (
                  <div key={index} className="p-4 border rounded-lg relative">
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() => removeWhyChoose(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>

                    <div className="space-y-2">
                      <Label htmlFor={`why-choose-title-${index}`}>Title</Label>
                      <Input
                        id={`why-choose-title-${index}`}
                        value={item.title}
                        onChange={(e) =>
                          handleWhyChooseChange(index, "title", e.target.value)
                        }
                        placeholder="Feature or benefit title"
                        className={
                          whyChooseErrors[index]?.title ? "border-red-500" : ""
                        }
                      />
                      {whyChooseErrors[index]?.title && (
                        <p className="text-red-500 text-sm">
                          {whyChooseErrors[index].title}
                        </p>
                      )}
                    </div>

                    <div className="mt-4 space-y-2">
                      <Label htmlFor={`why-choose-description-${index}`}>
                        Description
                      </Label>
                      <Textarea
                        id={`why-choose-description-${index}`}
                        value={item.description}
                        onChange={(e) =>
                          handleWhyChooseChange(
                            index,
                            "description",
                            e.target.value
                          )
                        }
                        placeholder="Explain this feature or benefit"
                        rows={3}
                        className={
                          whyChooseErrors[index]?.description
                            ? "border-red-500"
                            : ""
                        }
                      />
                      {whyChooseErrors[index]?.description && (
                        <p className="text-red-500 text-sm">
                          {whyChooseErrors[index].description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  onClick={addWhyChoose}
                  className="w-full"
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Reason
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <ThemeCustomizer
            initialTheme={formData.theme}
            onChange={handleThemeChange}
          />
        </TabsContent>
      </Tabs>

      <div className="mt-6 flex justify-between gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/dashboard")}
          disabled={isLoading}
        >
          Cancel
        </Button>

        <div className="flex gap-4">
          {currentStep !== "general" && (
            <Button
              type="button"
              variant="outline"
              onClick={handlePreviousStep}
              disabled={isLoading}
            >
              Previous
            </Button>
          )}

          {currentStep !== "appearance" ? (
            <Button
              type="button"
              onClick={handleNextStep}
              disabled={
                isLoading ||
                nameError !== "" ||
                isCheckingName ||
                paragraphError !== "" || // Disable if paragraph has errors
                bulletPointsError !== "" || // Disable if bullet points have errors
                // Check for image only on create and if on general tab
                (currentStep === "general" &&
                  !productId &&
                  !formData.image &&
                  !imagePreview)
              }
            >
              Next
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={
                isLoading ||
                nameError !== "" ||
                isCheckingName ||
                paragraphError !== "" || // Disable if paragraph has errors
                bulletPointsError !== "" || // Disable if bullet points have errors
                // Check for image only on create
                (!productId && !formData.image && !imagePreview)
              }
            >
              {isLoading
                ? "Saving..."
                : productId
                ? "Update Product"
                : "Create Product"}
            </Button>
          )}
        </div>
      </div>
    </form>
  );
}

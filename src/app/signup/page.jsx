"use client";
import FormCreator from "@/src/components/form-creator";
import { createUserDocument } from "@/src/utils/get-url";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import bcrypt from "bcryptjs";
import { useRouter } from "next/navigation";

async function hashPassword(plainTextPassword) {
  const saltRounds = 10; // Adjust for higher security (slower)
  const salt = await bcrypt.genSalt(saltRounds);
  const hash = await bcrypt.hash(plainTextPassword, salt);
  return hash;
}

const SignUp = (props) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    control,
  } = useForm();

  const router = useRouter();

  async function onSubmit(data) {
    console.log(data);
    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    } else {
      const collectionName = "user";
      let userData = {
        email: data.email.toLowerCase(),
        password: await hashPassword(data.password),
        name: data.name,
        userName: data.userName,
        role: "user",
        // fullName: "Full Name",
        gender: "",
        pronouns: "",
        description: "",
        links: "",
      };
      console.log(userData);
      try {
        await createUserDocument(collectionName, userData);
        toast.success(collectionName + " created successfully!");
        router.push("/signin"); // Redirect to Sign in page
      } catch (error) {
        console.log(error, "error");
        console.error("Error:", error);
        if (
          error.message.includes("E11000") &&
          error.message.includes("index: email_1")
        ) {
          // Duplicate key error
          toast.error("An account with this email already exists.");
        } else if (
          error.message.includes("E11000") &&
          error.message.includes("index: userName_1")
        ) {
          // Duplicate key error
          toast.error("An account with this username already exists.");
        } else {
          console.error(
            "There was a problem with your fetch operation:",
            error
          );
          toast.error("There was a problem creating the session.");
        }
      }
    }
  }
  // const createWorldFields: FormField[] = [
  const createSignUpFields = [
    {
      label: "Full Name",
      name: "name",
      errors: errors.name,
      field: "field",
      required: true,
      validation: {
        required: "Full name is required",
        minLength: {
          value: 2,
          message: "Name must be at least 2 characters long",
        },
        maxLength: {
          value: 50,
          message: "Name must not exceed 50 characters",
        },
      },
    },
    {
      label: "User Name",
      name: "userName",
      errors: errors.name,
      field: "field",
      required: true,
      validation: {
        required: "Username is required",
        pattern: {
          value: /^[a-zA-Z0-9_]+$/,
          message:
            "Username can only contain letters, numbers, and underscores",
        },
        minLength: {
          value: 3,
          message: "Username must be at least 3 characters long",
        },
        maxLength: {
          value: 20,
          message: "Username must not exceed 20 characters",
        },
      },
    },
    {
      label: "Email",
      name: "email",
      inputType: "email",
      errors: errors.name,
      field: "field",
      required: true,
      validation: {
        required: "Email is required",
        pattern: {
          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
          message: "Invalid email address",
        },
      },
    },
    {
      label: "Password",
      name: "password",
      inputType: "password",
      errors: errors.name,
      field: "field",
      required: true,
      validation: {
        required: "Password is required",
        minLength: {
          value: 8,
          message: "Password must be at least 8 characters long",
        },
        pattern: {
          value:
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
          message:
            "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
        },
      },
    },
    {
      label: "Confirm Password",
      name: "confirmPassword",
      inputType: "password",
      errors: errors.name,
      field: "field",
      required: true,
      validation: {
        required: "Please confirm your password",
        validate: (value) =>
          value === watch("password") || "Passwords do not match",
      },
    },
  ];
  return (
    
    <div className="w-full flex py-4 justify-center">
      <div className="flex flex-col mx-1  max-w-[450px] w-full">
      <FormCreator
        key="createSignUp"
        fields={createSignUpFields}
        register={register}
        control={control}
        onSubmit={onSubmit}
        handleSubmit={handleSubmit}
        buttonText="Sign Up"
        errors={errors}
      />
      <div className=" pt-4 font-bold self-center w-full text-center">
        Already a user?{" "}
        <a href="/signin" className="text-blue-600">
          Click here to Sign In.
        </a>
      </div>
    </div>
    </div>

  );
};
export default SignUp;

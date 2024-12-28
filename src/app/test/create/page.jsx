"use client";
import FormCreator from "@/src/components/form-creator";
import { useForm } from "react-hook-form";

const FormPage = (props) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
    control,
  } = useForm();

  async function onSubmit(data) {
    console.log(data);
  }
  // const createWorldFields: FormField[] = [
  const createWorldFields = [
    {
      label: "name",
      name: "name",
      errors: errors.name,
      field: "textField",
      required: true,
    },
    {
      label: "Scene Id",
      name: "sceneId",
      fileName: "sceneId",
      errors: errors.sceneId,
      field: "textField",
      required: true,
    },
    {
      label: "Scene Image Url",
      name: "imageUrl",
      fileName: "imageUrl",
      errors: errors.brandLogo,
      field: "textField",
      required: true,
    },
  ];
  return (
    <>
      <FormCreator
        key="createWorld"
        fields={createWorldFields}
        register={register}
        control={control}
        onSubmit={onSubmit}
        handleSubmit={handleSubmit}
        buttonText="Create Scene"
      />
    </>
  );
};
export default FormPage;

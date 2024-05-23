import { IconBxLoaderCircle } from "@app/components/icons/Loader";

export const Loader = () => {
  return (
    <div className="h-screen flex justify-center items-center">
      <IconBxLoaderCircle className="animate-spin h-8 w-8" />
    </div>
  );
};

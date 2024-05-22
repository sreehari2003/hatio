import { useRouter } from 'next/router';

type Prop = {
  name: string;
  id: string;
};

export const OrgCard = ({ name, id }: Prop) => {
  const router = useRouter();

  const goToOrg = () => {
    router.push(`/org/${id}`);
  };

  return (
    <div
      onClick={goToOrg}
      className="flex flex-col group justify-between border-solid border p-3  w-[300px] h-[150px] border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition rounded-sm hover:cursor-pointer"
    >
      <div className="flex justify-between w-full">
        <h2 className="text-2xl font-bold capitalize">{name}</h2>
        <BsChevronRight className="text-lg" />
      </div>
    </div>
  );
};

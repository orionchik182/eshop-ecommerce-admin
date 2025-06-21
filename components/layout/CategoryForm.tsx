import Link from "next/link";
import AddPropertyButton from "../ui/AddPropertyButton";

export default function CategoryForm({
  action,
  categories,
  category = null,
}: CategoryFormType) {
  const parentId: string = category?.parent
    ? typeof category.parent === "string"
      ? category.parent // ← строка-id
      : category.parent._id // ← объект → берём его _id
    : "";

  return (
    <form action={action}>
      <label htmlFor="name">{category ? "Edit" : "New"} category name</label>
      <div className="flex flex-col gap-1">
        <div className="flex gap-1">
          <input
            type="hidden"
            name="id"
            value={category?._id.toString() ?? ""}
          />

          <input
            className="!mb-0"
            type="text"
            placeholder="Category name"
            id="name"
            name="name"
            defaultValue={category?.name || ""}
          />
          <select
            name="parentCategory"
            className="!mb-0"
            defaultValue={parentId || ""}
          >
            <option value="">No parent category</option>
            {categories.length > 0 &&
              categories
                .filter((c) => c?._id.toString() !== category?._id?.toString())
                .map((category) => (
                  <option
                    value={category._id.toString()}
                    key={category._id.toString()}
                  >
                    {category.name}
                  </option>
                ))}
          </select>
        </div>
        <div className="mb-2">
          <label className="block">Properties</label>
          <AddPropertyButton initial={category?.properties ?? []} />
        </div>
      </div>
      {category && (
        <Link href={"/categories"} className="btn-default mr-2">
          Cancel
        </Link>
      )}
      <button className="btn-primary py-1">Save</button>
    </form>
  );
}

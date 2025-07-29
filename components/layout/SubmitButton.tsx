import Link from "next/link";
import { useFormStatus } from "react-dom";

export default function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <div className="flex gap-2">
      <Link href={"/products"} className="btn-default">
        Cancel
      </Link>
      <button
        type="submit"
        disabled={pending}
        className={`btn-primary self-start transition-colors duration-200 ${
          pending ? "cursor-not-allowed !bg-gray-400" : "hover:bg-blue-700"
        }`}
      >
        {pending ? "Saving..." : "Save"}
      </button>
    </div>
  );
}

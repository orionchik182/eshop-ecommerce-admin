"use client";
import React, { useState } from "react";

export default function AddPropertyButton({
  initial = [],
}: AddPropertyButtonProps) {
  const [properties, setProperties] = useState<Property[]>(initial);

  function handleAddProperty() {
    setProperties((prev) => [...prev, { name: "", value: [] }]);
  }

  const handleRemoveProperty = (idx: number) =>
    setProperties((prev) => prev.filter((_, i) => i !== idx));

  return (
    <div>
      <button
        type="button"
        className="btn-default mb-2 text-sm"
        onClick={handleAddProperty}
      >
        Add new property
      </button>
      {properties.map((property, index) => (
        <div key={index} className="mb-2 flex gap-1">
          <input
            type="text"
            placeholder="Property name"
            name={`properties[${index}].name`}
            defaultValue={property.name}
            className="!mb-0"
          />
          <input
            type="text"
            placeholder="Property value"
            name={`properties[${index}].value`}
            defaultValue={property.value?.join(", ") ?? ""}
            className="!mb-0"
          />
          <button
            onClick={() => handleRemoveProperty(index)}
            className="btn-default"
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}

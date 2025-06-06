import React from "react";
import Select from "react-select";

type Props = {
  defaultValues: { label: string; value: string }[];
  placeholder: string;
  label: string;
  onChange: (values: { label: string; value: string }[]) => void;
  value: { label: string; value: string }[];
};

const TagInput = ({
  defaultValues,
  placeholder,
  label,
  onChange,
  value,
}: Props) => {
  return (
    <div className="flex items-center rounded-md border">
      <span className="ml-3 text-sm text-gray-500">{label}</span>
      <Select
        value={value}
        // @ts-ignore
        onChange={onChange}
        placeholder={placeholder}
        isMulti
        defaultValue={defaultValues}
      />
    </div>
  );
};

export default TagInput;

import { KBarResults, useMatches } from "kbar";
import React from "react";
import ResultItem from "./result-item";

const RenderResults = () => {
  const { results, rootActionId } = useMatches();

  return (
    <KBarResults
      items={results}
      onRender={({ item, active }) => {
        // if the item is a string which means it's a section header e.g. "Navigation"
        if (typeof item === "string") {
          return (
            <div className="px-4 py-2 text-sm text-gray-600 uppercase opacity-50 dark:text-gray-400">
              {item}
            </div>
          );
        }
        return (
          <ResultItem
            action={item}
            active={active}
            currentRootActionId={rootActionId ?? " "}
          />
        );
      }}
    />
  );
};

export default RenderResults;

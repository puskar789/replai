import React, { useEffect } from "react";
import { searchValueAtom } from "./search-bar";
import { useAtom } from "jotai";
import { api } from "@/trpc/react";
import { useDebounceValue } from "usehooks-ts";
import useThreads from "@/hooks/use-threads";
import DOMPurify from "dompurify";

const SearchDisplay = () => {
  const { accountId } = useThreads();
  const [searchValue] = useAtom(searchValueAtom);
  const search = api.account.searchEmails.useMutation();
  const [debouncedSearchValue] = useDebounceValue(searchValue, 500);

  useEffect(() => {
    if (!debouncedSearchValue || !accountId) {
      return;
    }
    search.mutate({ accountId, query: debouncedSearchValue });
  }, [debouncedSearchValue, accountId]);

  return (
    <div className="max-h-[calc(100vh-50px)] overflow-y-scroll p-4">
      <div className="mb-4 flex items-center gap-2">
        <h2 className="text-sm text-gray-600 dark:text-gray-400">
          {`Your search for "${searchValue}" came back with ...`}
        </h2>
      </div>
      {search.data?.hits.length === 0 ? (
        <p>No results found.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {search.data?.hits.map((hit) => {
            return (
              <li
                key={hit.id}
                className="cursor-pointer list-none rounded-md border p-4 transition-all hover:bg-gray-100 dark:hover:bg-gray-200"
              >
                <h3 className="text-base font-medium">
                  {hit.document.subject}
                </h3>
                <p className="text-sm text-gray-500">
                  From: {hit.document.from}
                </p>
                <p className="text-sm text-gray-500">
                  To: {hit.document.to.join(", ")}
                </p>
                <p
                  className="mt-2 text-sm"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(hit.document.rawBody, {
                      USE_PROFILES: { html: true },
                    }),
                  }}
                ></p>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default SearchDisplay;

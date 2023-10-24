import { keepPreviousData, useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { debounce } from 'lodash-es';
import { Suspense, useEffect, useMemo, useState } from 'react';
import { CircleSpinner, Combobox, ComboboxOption } from 'ui-components';

import { queries } from '@/queries';
import { ScanTypeEnum } from '@/types/common';

export type Props = {
  scanType: ScanTypeEnum | 'none';
  onChange?: (value: string[]) => void;
  onClearAll?: () => void;
  defaultSelectedContainers?: string[];
  valueKey?: 'nodeId' | 'nodeName';
  active?: boolean;
  triggerVariant?: 'select' | 'button';
};
const PAGE_SIZE = 15;
const SearchableContainer = ({
  scanType,
  onChange,
  onClearAll,
  defaultSelectedContainers,
  valueKey = 'nodeId',
  active = true,
  triggerVariant,
}: Props) => {
  const [searchText, setSearchText] = useState('');

  const [selectedContainers, setSelectedContainers] = useState<string[]>(
    defaultSelectedContainers ?? [],
  );

  const isSelectVariantType = useMemo(() => {
    return triggerVariant === 'select';
  }, [triggerVariant]);

  useEffect(() => {
    setSelectedContainers(defaultSelectedContainers ?? []);
  }, [defaultSelectedContainers]);

  const { data, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useSuspenseInfiniteQuery({
      ...queries.search.containers({
        scanType,
        size: PAGE_SIZE,
        searchText,
        active,
        order: {
          sortBy: 'node_name',
          descending: false,
        },
      }),
      placeholderData: keepPreviousData,
      getNextPageParam: (lastPage, allPages) => {
        return allPages.length * PAGE_SIZE;
      },
      getPreviousPageParam: (firstPage, allPages) => {
        if (!allPages.length) return 0;
        return (allPages.length - 1) * PAGE_SIZE;
      },
    });

  const searchContainer = debounce((query) => {
    setSearchText(query);
  }, 1000);

  const onEndReached = () => {
    if (hasNextPage) fetchNextPage();
  };

  return (
    <>
      <input
        type="text"
        name="selectedContainerLength"
        hidden
        readOnly
        value={selectedContainers.length}
      />
      <Combobox
        startIcon={
          isFetchingNextPage ? <CircleSpinner size="sm" className="w-3 h-3" /> : undefined
        }
        name="containerFilter"
        triggerVariant={triggerVariant || 'button'}
        label={isSelectVariantType ? 'Container' : undefined}
        getDisplayValue={() =>
          isSelectVariantType && selectedContainers.length > 0
            ? `${selectedContainers.length} selected`
            : null
        }
        placeholder="Select container"
        multiple
        value={selectedContainers}
        onChange={(values) => {
          setSelectedContainers(values);
          onChange?.(values);
        }}
        onQueryChange={searchContainer}
        clearAllElement="Clear"
        onClearAll={onClearAll}
        onEndReached={onEndReached}
      >
        {data?.pages
          .flatMap((page) => {
            return page.containers;
          })
          .map((container, index) => {
            return (
              <ComboboxOption
                key={`${container.nodeId}-${index}`}
                value={container[valueKey]}
              >
                {container.nodeName}
              </ComboboxOption>
            );
          })}
      </Combobox>
    </>
  );
};

export const SearchableContainerList = (props: Props) => {
  const { triggerVariant } = props;
  const isSelectVariantType = useMemo(() => {
    return triggerVariant === 'select';
  }, [triggerVariant]);

  return (
    <Suspense
      fallback={
        <Combobox
          label={isSelectVariantType ? 'Container' : undefined}
          triggerVariant={triggerVariant}
          startIcon={<CircleSpinner size="sm" className="w-3 h-3" />}
          placeholder="Select container"
          multiple
          onQueryChange={() => {
            // no operation
          }}
        />
      }
    >
      <SearchableContainer {...props} />
    </Suspense>
  );
};

import { cn } from 'tailwind-preset';
import { Dropdown, DropdownItem, IconButton } from 'ui-components';

import { CaretDown } from '@/components/icons/common/CaretDown';
import { DownloadLineIcon } from '@/components/icons/common/DownloadLine';
import { HistoryIcon } from '@/components/icons/common/History';
import { TrashLineIcon } from '@/components/icons/common/TrashLine';
import { ScanStatusBadge } from '@/components/ScanStatusBadge';
import { isScanComplete, isScanFailed } from '@/utils/scan';

export const ScanHistoryDropdown = ({
  scans,
  currentTimeStamp,
}: {
  scans: Array<{
    id: string;
    timestamp: string;
    status: string;
    isCurrent: boolean;
    onDeleteClick: (id: string) => void;
    onDownloadClick: (id: string) => void;
    onScanClick: (id: string) => void;
  }>;
  currentTimeStamp: string;
}) => {
  return (
    <Dropdown
      content={
        <>
          {scans.map((scan) => {
            return (
              <DropdownItem
                key={scan.timestamp}
                onClick={() => scan.onScanClick(scan.id)}
              >
                <div className="flex items-center gap-1.5" key={scan.id}>
                  <ScanStatusBadge
                    status={scan.status}
                    justIcon
                    className={cn('gap-1 text-p7', {
                      'dark:text-text-input-value': scan.isCurrent,
                    })}
                  />
                  <span
                    className={cn('text-p7 dark:text-text-text-and-icon', {
                      'dark:text-text-input-value': scan.isCurrent,
                    })}
                  >
                    {scan.timestamp}
                  </span>

                  <div className="flex items-center dark:text-text-link">
                    {isScanComplete(scan.status) ? (
                      <IconButton
                        variant="flat"
                        icon={
                          <span className="h-3 w-3">
                            <DownloadLineIcon />
                          </span>
                        }
                        onClick={() => {
                          scan.onDownloadClick(scan.id);
                        }}
                      />
                    ) : null}
                    {isScanComplete(scan.status) || isScanFailed(scan.status) ? (
                      <IconButton
                        variant="flat"
                        icon={
                          <span className="h-3 w-3">
                            <TrashLineIcon />
                          </span>
                        }
                        onClick={() => {
                          scan.onDeleteClick(scan.id);
                        }}
                      />
                    ) : null}
                  </div>
                </div>
              </DropdownItem>
            );
          })}
        </>
      }
    >
      <span className="text-h5 flex items-center dark:text-text-input-value gap-x-2">
        {currentTimeStamp}
        <div className="h-4 w-4 dark:text-accent-accent">
          <CaretDown />
        </div>
      </span>
    </Dropdown>
  );
};

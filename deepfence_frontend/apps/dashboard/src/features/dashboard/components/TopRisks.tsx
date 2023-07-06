import { useSuspenseQuery } from '@suspensive/react-query';
import { EChartsOption } from 'echarts';
import { ReactNode, Suspense } from 'react';
import { preset } from 'tailwind-preset';
import { Card, CircleSpinner } from 'ui-components';

import { ReactECharts } from '@/components/ReactEcharts';
import { SeverityLegend } from '@/components/SeverityBadge';
import { MalwareIcon } from '@/components/sideNavigation/icons/Malware';
import { SecretsIcon } from '@/components/sideNavigation/icons/Secrets';
import { VulnerabilityIcon } from '@/components/sideNavigation/icons/Vulnerability';
import { SEVERITY_COLORS } from '@/constants/charts';
import { CardHeader } from '@/features/dashboard/components/CardHeader';
import { queries } from '@/queries';
import { abbreviateNumber } from '@/utils/number';

function useSummary(type: 'vulnerability' | 'secret' | 'malware') {
  return {
    vulnerability: useSuspenseQuery({
      ...queries.vulnerability.uniqueVulnerabilitiesCount(),
      enabled: type === 'vulnerability',
    }),
    secret: useSuspenseQuery({
      ...queries.secret.uniqueSecretsCount(),
      enabled: type === 'secret',
    }),
    malware: useSuspenseQuery({
      ...queries.malware.uniqueMalwaresCount(),
      enabled: type === 'malware',
    }),
  }[type];
}

const RISK_TYPES: {
  [x in 'vulnerability' | 'secret' | 'malware']: {
    title: string;
    icon: ReactNode;
    link: string;
  };
} = {
  vulnerability: {
    title: 'Vulnerabilities',
    icon: <VulnerabilityIcon />,
    link: '/vulnerability',
  },
  secret: {
    title: 'Secrets',
    icon: <SecretsIcon />,
    link: '/secret',
  },
  malware: {
    title: 'Malwares',
    icon: <MalwareIcon />,
    link: '/malware',
  },
};

export const TopRisks = ({ type }: { type: 'vulnerability' | 'secret' | 'malware' }) => {
  return (
    <Card className="rounded-[5px] flex flex-col h-full">
      <CardHeader
        icon={RISK_TYPES[type].icon}
        title={RISK_TYPES[type].title}
        link={RISK_TYPES[type].link}
      />
      <div className="flex-1 flex items-center justify-center">
        <Suspense fallback={<CircleSpinner size="md" />}>
          <TopRisksContent type={type} />
        </Suspense>
      </div>
    </Card>
  );
};

const TopRisksContent = ({ type }: { type: 'vulnerability' | 'secret' | 'malware' }) => {
  const { data } = useSummary(type);
  if (!data) throw new Error('data is empty');
  const chartOptions = getChartOptions({
    data: data.severityBreakdown,
    total: data.total,
  });
  return (
    <div className="flex-1 flex flex-col items-center py-1.5">
      <div className="max-w-[162px] max-h-[162px] h-[162px] w-[162px]">
        <ReactECharts theme="dark" option={chartOptions} />
      </div>
      <div className="mt-4 flex flex-col min-w-[184px] self-center">
        {Object.keys(data.severityBreakdown).map((severity) => {
          return (
            <div
              key={severity}
              className="flex items-center w-full justify-between py-[3px] pr-2"
            >
              <SeverityLegend severity={severity} className="text-p4" />
              <div className="dark:text-text-input-value text-p7">
                {abbreviateNumber(
                  data.severityBreakdown[severity as keyof typeof data.severityBreakdown],
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

function getChartOptions({
  data,
  total,
}: {
  data: { [key: string]: number };
  total: number;
}) {
  const option: EChartsOption = {
    backgroundColor: 'transparent',
    tooltip: {
      show: false,
    },
    legend: {
      show: false,
    },
    dataset: {
      source: Object.keys(data).map((key) => ({
        Secrets: key,
        value: data[key],
      })),
    },
    series: [
      {
        type: 'pie',
        radius: ['72%', '100%'],
        itemStyle: {
          borderWidth: 2,
          borderColor: preset.theme.extend.colors.bg.card,
        },
        label: {
          position: 'center',
          formatter: function () {
            return abbreviateNumber(total).toString();
          },
          fontSize: '30px',
          color: preset.theme.extend.colors.text['input-value'],
          fontWeight: 600,
          fontFamily: preset.theme.extend.fontFamily.sans.join(','),
        },
        cursor: 'default',
        emphasis: {
          disabled: true,
        },
        color: [
          SEVERITY_COLORS['critical'],
          SEVERITY_COLORS['high'],
          SEVERITY_COLORS['medium'],
          SEVERITY_COLORS['low'],
          SEVERITY_COLORS['unknown'],
        ],
      },
    ],
  };
  return option;
}

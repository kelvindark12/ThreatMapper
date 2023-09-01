/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  threatmapper: [
    {
      type: 'html',
      value: 'Deepfence ThreatMapper',
      className: 'sidebar-title',
    },

    'index',

    {
      type: 'category',
      label: 'Architecture',
      link: {
        type: 'doc',
        id: 'architecture/index'
      },
      items: [
        'architecture/console',
        'architecture/cloudscanner',
        'architecture/sensors',
        'architecture/threatgraph',
      ],
    },
    'demo',

    {
      type: 'category',
      label: 'Installation',
      link: {
        type: 'doc',
        id: 'installation'
      },
      items: [
        {
          type: 'category',
          label: 'Management Console',
          link: {
            type: 'doc',
            id: 'console/index'
          },
          items: [
            'console/requirements',
            'console/docker',
            'console/kubernetes',
            'console/managed-database',
            'console/initial-configuration',
            'console/manage-users',
            'console/database-export-import',
            'console/troubleshooting',
          ],
        },

        {
          type: 'category',
          label: 'Cloud Scanner',
          link: {
            type: 'doc',
            id: 'cloudscanner/index'
          },
          items: [
            'cloudscanner/aws',
            'cloudscanner/azure',
            'cloudscanner/gcp',
            'cloudscanner/other',
           ],
        },

        {
          type: 'category',
          label: 'Kubernetes Scanner',
          link: {
            type: 'doc',
            id: 'kubernetes-scanner/index'
          },
          items: [],
        },

        {
          type: 'category',
          label: 'Sensor Agent container',
          link: {
            type: 'doc',
            id: 'sensors/index'
          },
          items: [
            'sensors/kubernetes',
            'sensors/docker',
            'sensors/aws-ecs',
            'sensors/aws-fargate',
            'sensors/linux-host',
          ],
        },
      ],
    },

    {
      type: 'category',
      label: 'Operations',
      link: {
        type: 'doc',
        id: 'operations/index'
      },
      items: [
        'operations/scanning',
        'operations/sboms',
        'operations/compliance',
        {
          type: 'category',
          label: 'Scanning Registries',
          link: {
            type: 'doc',
            id: 'registries/index'
          },
          items: [
            'registries/aws-ecr',
          ],
        },
        {
          type: 'category',
          label: 'Scanning in CI',
          link: {
            type: 'doc',
            id: 'ci-cd/index'
          },
          items: [
            'ci-cd/circle-ci',
            'ci-cd/gitlab',
            'ci-cd/jenkins',
          ],
        },
        'operations/support',
      ],
    },

    {
      type: 'category',
      label: 'Integrations',
      link: {
        type: 'doc',
        id: 'integrations/index'
      },
      items: [
        'integrations/pagerduty',
        'integrations/slack',
        'integrations/microsoft-teams',
        'integrations/sumo-logic',
        'integrations/jira',
      ],
    },

    {
      type: 'category',
      label: 'Developers',
      link: {
        type: 'doc',
        id: 'developers/index'
      },
      items: [
        'developers/build',
        'developers/deploy-console',
        'developers/deploy-agent',
      ],
    },

    {
      type: 'category',
      label: 'Tips',
      link: {
        type: 'generated-index',
        description:
          "Tips and Techniques to get the most from ThreatMapper"
      },
      items: [
        {
          type: 'autogenerated',
          dirName: 'tips',
        },
      ],
    },
  ],
};

module.exports = sidebars;

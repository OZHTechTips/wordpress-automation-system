import { TempDomainProvider } from '../types';

export const tempDomainProviders: TempDomainProvider[] = [
  {
    id: 'netlify',
    name: 'Netlify',
    baseUrl: 'netlify.app',
    setupTime: '~2 minutes',
    features: ['Free SSL', 'Custom subdomains', 'Easy WordPress deployment']
  },
  {
    id: 'vercel',
    name: 'Vercel',
    baseUrl: 'vercel.app',
    setupTime: '~3 minutes',
    features: ['Free SSL', 'Preview deployments', 'Edge network']
  },
  {
    id: 'pantheon',
    name: 'Pantheon',
    baseUrl: 'pantheonsite.io',
    setupTime: '~5 minutes',
    features: ['WordPress optimized', 'Dev/Test/Live environments', 'Git integration']
  },
  {
    id: 'flywheel',
    name: 'Flywheel',
    baseUrl: 'flywheelsites.com',
    setupTime: '~4 minutes',
    features: ['WordPress specific', 'Staging sites', 'Blueprint templates']
  },
  {
    id: 'cloudways',
    name: 'Cloudways',
    baseUrl: 'cloudwaysapps.com',
    setupTime: '~6 minutes',
    features: ['Multiple cloud providers', 'Server stack optimized for WP', 'Staging areas']
  }
];
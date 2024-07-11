import process from 'node:process';
import { loadConfig } from 'c12';
import type { CliOption } from '../types';

const defaultOptions: CliOption = {
  cwd: process.cwd(),
  cleanupDirs: [
    '**/dist',
    '**/package-lock.json',
    '**/yarn.lock',
    '**/pnpm-lock.yaml',
    '**/node_modules',
    '!node_modules/**'
  ],
  gitCommitTypes: [
    ['feat', '功能变更'],
    ['fix', 'bug 修复'],
    ['other', '其他修改']
  ],
  gitCommitScopes: [
    ['projects', '整个项目'],
    ['components', '组件内'],
    ['other', '其他']
  ],
  ncuCommandArgs: ['--deep', '-u'],
  changelogOptions: {}
};

export async function loadCliOptions(overrides?: Partial<CliOption>, cwd = process.cwd()) {
  const { config } = await loadConfig<Partial<CliOption>>({
    name: 'soybean',
    defaults: defaultOptions,
    overrides,
    cwd,
    packageJson: true
  });

  return config as CliOption;
}

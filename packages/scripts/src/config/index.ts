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
    ['feat', '新功能'],
    ['fix', 'bug 修复'],
    ['style', '样式修改'],
    ['other', '其他修改'],
    ['refactor', '代码更改既没有修复错误也没有添加功能'],
    ['perf', '改进代码以提高性能'],
    ['optimize', '优化代码质量的代码更改'],
    ['test', '添加缺失的测试或更正现有的测试'],
    ['build', '影响构建系统或外部依赖项的更改'],
    ['ci', '更改我们的 CI 配置文件和脚本'],
    ['chore', '不修改 src 或测试文件的其他更改'],
    ['docs', '文档修改'],
    ['revert', '恢复之前的提交']
  ],
  gitCommitScopes: [
    ['projects', 'project'],
    ['packages', 'packages'],
    ['components', 'components'],
    ['hooks', 'hook functions'],
    ['utils', 'utils functions'],
    ['types', 'TS declaration'],
    ['styles', 'style'],
    ['deps', 'project dependencies'],
    ['release', 'release project'],
    ['other', 'other changes']
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

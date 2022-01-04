// This is the default config but with main instead of master as branch

module.exports = {
  branches: [
    '+([0-9])?(.{+([0-9]),x}).x',
    'main', // main instead of master
    'next',
    'next-major',
    { name: 'beta', prerelease: true },
    { name: 'alpha', prerelease: true },
  ],
}

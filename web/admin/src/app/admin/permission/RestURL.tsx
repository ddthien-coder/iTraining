export const PermissionRestURL = {
  app: {
    load: (module: string, name: string) => { return `/security/app/${module}/${name}` },
    search: "/security/app/all",
    save: 'security/app',
  },
  permissions: {
    // load: (module: string, name: string) => { return `/security/app/${module}/${name}` },
    search: "security/app/permission/search",
    save: 'security/app/permissions',
    delete: 'security/app/permissions/delete',
  },
};


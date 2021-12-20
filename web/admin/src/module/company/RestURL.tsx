export const CompanyRestURL = {
  company: {
    search: "/company/search",
    load: (id: number) => { return `/company/id/${id}`; },
    save: "/company/update",
    create: "/company/create",
  },

  config: {
    load: (id: number) => { return `/company/config/id/${id}`; },
    save: "/company/config/save",
  },
};

export const LocationRestURL = {
  serviceLocation: {
    load: (code: string) => { return `/company/settings/location/${code}`; },
    save: "/company/settings/location",
    search: "/company/settings/location/search",
    saveState: "/company/settings/location/storage-state"
  },
};


export const AccountRestURL = {
  group: {
    loadChildren: (groupId?: number) => {
      if (!groupId) groupId = 0;
      return `/account/group/${groupId}/children`;
    },
    save: `/account/group`,
    membership: (groupId: number) => { return `/account/group/${groupId}/memberships` },
    createChild: (parentId: number) => { return `/account/group/${parentId}/create` },
    delete: (id: number) => { return `/account/group/${id}` },
  },

  account: {
    load: (loginId: string) => { return `/account/account/model/${loginId}` },
    save: "/account/account",

    create: "/account/account/create",
    search: "/account/account/search",
    saveState: "/account/account/storage-state",
    printURL: (name: string, format: string) => { return `/account/print/${name}/${format}`; },
    changePassword: "/account/change-password",
    resetPassword: "/account/reset-password"
  },

  profile: {
    load: (loginId: string) => { return `/account/profile/${loginId}` },
    uploadAvatar: (loginId: string) => { return `/account/profile/${loginId}/upload-avatar` },
    modifyAvatar: (loginId: string) => { return `/account/profile/${loginId}/modify-avatar` },
    saveUser: "/account/profile/user",
    saveOrg: "/account/profile/org",
  },

  contact: {
    findByLoginId: (loginId: string) => { return `/account/contact/${loginId}/find`; },
    save: (loginId: string) => { return `/account/contact/${loginId}/save`; },
    delete: (loginId: string) => { return `/account/contact/${loginId}` },
  },
  education: {
    findByLoginId: (loginId: string) => { return `/account/user-education/${loginId}/find`; },
    save: (loginId: string) => { return `/account/user-education/${loginId}/save`; },
    delete: (loginId: string) => { return `/account/user-education/${loginId}` }
  },
  work: {
    findByLoginId: (loginId: string) => { return `/account/user-work/${loginId}/find`; },
    save: (loginId: string) => { return `/account/user-work/${loginId}/save`; },
    delete: (loginId: string) => { return `/account/user-work/${loginId}` }
  },
  relation: {
    findByLoginId: (loginId: string) => { return `/account/user-relation/${loginId}/find`; },
    save: (loginId: string) => { return `/account/user-relation/${loginId}/save`; },
    delete: (loginId: string) => { return `/account/user-relation/${loginId}` }
  },
  bankAccount: {
    search: "/account/bank-account/search",
    findByLoginId: (loginId: string) => { return `/account/bank-account/${loginId}/find`; },
    save: (loginId: string) => { return `/account/bank-account/${loginId}/save`; },
    delete: (loginId: string) => { return `/account/bank-account/${loginId}` }
  },
  identity: {
    findByLoginId: (loginId: string) => { return `/account/user-identity/${loginId}/find`; },
    save: (loginId: string) => { return `/account/user-identity/${loginId}/save`; },
    delete: (loginId: string) => { return `/account/user-identity/${loginId}` }
  }
};
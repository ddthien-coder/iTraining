
export class AppCapability {
  capability: 'None' | 'Read' | 'Write' | 'Moderator' | 'Admin' = 'Read';
  order: number;

  constructor(cap: 'None' | 'Read' | 'Write' | 'Moderator' | 'Admin') {
    this.capability = cap;
    if (cap === 'None') this.order = 0;
    else if (cap === 'Read') this.order = 1;
    else if (cap === 'Write') this.order = 2;
    else if (cap === 'Moderator') this.order = 3;
    else this.order = 4;
  }

  hasCapability(other: AppCapability) {
    return this.order >= other.order;
  }
}

const NONE = new AppCapability('None');
const READ = new AppCapability('Read');
const WRITE = new AppCapability('Write');
const MODERATOR = new AppCapability('Moderator');
const ADMIN = new AppCapability('Admin');

export { NONE, READ, WRITE, MODERATOR, ADMIN }

export class LoginCapability {
  capability: AppCapability;
  
  constructor(cap: AppCapability = NONE) {
    this.capability = cap;
  }
  
  hasReadCapability() { 
    return this.capability.hasCapability(READ) ;
  }

  hasWriteCapability() { 
    return this.capability.hasCapability(WRITE);
  }

  hasModeratorCapability() { 
    return this.capability.hasCapability(MODERATOR) ;
  }

  hasAdminCapability() { 
    return this.capability.hasCapability(ADMIN) ;
  }
}
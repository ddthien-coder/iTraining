import { ApplicationPlugin }       from '../../api/api';
import { HelloApplicationPlugin }  from './hello';
import { SampleApplicationPlugin } from './sample';
import { AccountApplicationPlugin } from './account';

export class PluginCategory {
  name:    string;
  plugins: Map<string, ApplicationPlugin>;

  constructor(name: string) {
    this.name    = name;
    this.plugins = new Map<string, ApplicationPlugin>();
  }

  add(plugin: ApplicationPlugin) {
    this.plugins.set(plugin.name, plugin);
  }
}

export class PluginManager {
  categories: Map<string, PluginCategory>;
  plugins: Map<string, ApplicationPlugin>;

  constructor() {
    this.categories = new Map<string, PluginCategory>();
    this.plugins    = new Map<string, ApplicationPlugin>();

    this.addPlugin(new HelloApplicationPlugin());
    this.addPlugin(new SampleApplicationPlugin());
    this.addPlugin(new AccountApplicationPlugin());
  }

  getCategories() { return this.categories; }

  getPlugin(key: string) {
    return this.plugins.get(key);
  }

  addPlugin(plugin: ApplicationPlugin) {
    let category = this.categories.get(plugin.category);
    if(category == null) {
      category = new PluginCategory(plugin.category);
      this.categories.set(plugin.category, category);
    }
    category.add(plugin);
    this.plugins.set(plugin.key, plugin);
  }
}
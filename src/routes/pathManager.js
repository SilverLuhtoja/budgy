import { appLocalDataDir } from '@tauri-apps/api/path';

class PathManager {    
    static instance = null;

    // Private constructor to prevent instantiation
    constructor() {
        if (PathManager.instance) {
        throw new Error("Use PathManager.getInstance() to get the singleton instance.");
        }

        this.paths = null;
    }

    static async getInstance() {
        if (!PathManager.instance) {
            PathManager.instance = new PathManager();
          await PathManager.instance.initPaths(); // Initialize paths when first created
        }
        return PathManager.instance;
      }

     // Private method to initialize paths
    async initPaths() {
        const appDir = await appLocalDataDir();
        
        this.paths = {
            ORIGINAL_FILE_PATH: `${appDir}/resources/original_files`,
            PROCESSED_FILE_PATH: `${appDir}resources/processed_files`,
            CONFIG_FILE_PATH: `${appDir}resources/configurations`,
            CONFIGURATIONS_FILE_PATH: `${appDir}resources/configurations/configurations.json`,
            EXPENDITURE_SETTINGS_PATH: `${appDir}resources/configurations/expenditure_settings.json`,
        };
    }

    // Public getter method to access paths
    getPaths() {
        if (!this.paths) {
            throw new Error("Paths have not been initialized yet.");
        }
        return this.paths;
    }
}

// Asynchronous export of the paths
const initRouteManagerPaths = async () => {
    const manager = await PathManager.getInstance();
    
    return manager.paths;
  };

export default await initRouteManagerPaths() 
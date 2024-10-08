import { appLocalDataDir } from '@tauri-apps/api/path';

class PathManager {    
    constructor() {
        if (PathManager.instance) {
            return PathManager.instance;
        }
        PathManager.instance = this;
        this.paths = null; 
    }

    getPaths() {
        return this.paths;
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
}

const pathManager = new PathManager();
export default pathManager;
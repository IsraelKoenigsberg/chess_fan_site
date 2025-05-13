// Environment variables configuration
import dotenv from 'dotenv';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get directory path for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

class EnvConfig {
    constructor() {
        // Load environment variables from .env file
        const result = dotenv.config({ path: path.join(rootDir, '.env') });

        if (result.error) {
            console.warn('No .env file found or error loading .env file.');
            this._createEnvFileIfNotExists();
        }

        // Default configuration values
        this.defaults = {
            PORT: 3000,
            NODE_ENV: 'development',
            JWT_SECRET: this._generateRandomSecret(),
            JWT_EXPIRY: '5s',
            MONGODB_URI: 'mongodb+srv://yisraelkoenigsberg:VkhPXBb1J7XAVWv6@cluster0.wbu0e35.mongodb.net/UserInformation?retryWrites=true&w=majority',
            DB_NAME: 'ChessBasics',
            CORS_ORIGIN: '*'
        };

        // Initialize configuration
        this._initConfig();


    }

    // Initialize configuration by merging environment variables with defaults
    _initConfig() {
        this.config = {
            PORT: process.env.PORT || this.defaults.PORT,
            NODE_ENV: process.env.NODE_ENV || this.defaults.NODE_ENV,
            JWT_SECRET: process.env.JWT_SECRET || this.defaults.JWT_SECRET,
            JWT_EXPIRY: process.env.JWT_EXPIRY || this.defaults.JWT_EXPIRY,
            MONGODB_URI: process.env.MONGODB_URI || this.defaults.MONGODB_URI,
            DB_NAME: process.env.DB_NAME || this.defaults.DB_NAME,
            CORS_ORIGIN: process.env.CORS_ORIGIN || this.defaults.CORS_ORIGIN
        };


    }

    // Generate a random secret for JWT
    _generateRandomSecret() {
        return crypto.randomBytes(64).toString('hex');
    }

    // Create .env file with defaults if it doesn't exist
    _createEnvFileIfNotExists() {
        const envPath = path.join(rootDir, '.env');

        // Check if .env file exists
        if (!fs.existsSync(envPath)) {
            console.log('Creating default .env file...');

            // Create content for .env file
            let envContent = '';
            for (const [key, value] of Object.entries(this.defaults)) {
                // Generate a new random JWT_SECRET for the file
                if (key === 'JWT_SECRET') {
                    envContent += `${key}=${this._generateRandomSecret()}\n`;
                } else {
                    envContent += `${key}=${value}\n`;
                }
            }

            // Write .env file
            try {
                fs.writeFileSync(envPath, envContent);
                console.log('.env file created successfully with default values.');

                // Reload environment variables
                dotenv.config({ path: envPath });
            } catch (error) {
                console.error('Error creating .env file:', error);
            }
        }
    }


    // Get configuration value
    get(key) {
        return this.config[key];
    }

    // Get all configuration
    getAll() {
        return this.config;
    }


}

// Create singleton instance
const envConfig = new EnvConfig();

export default envConfig;
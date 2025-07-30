// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';

export default tseslint.config(
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
    languageOptions: {
      globals: globals.node,
    },
  },
  eslint.configs.recommended,
  tseslint.configs.recommended,
  tseslint.configs.stylistic,
  {
    rules: {
      // Console rules - allow console in scripts and config files
      "no-console": ["warn", { 
        allow: ["warn", "error", "info"] 
      }],
      
      // TypeScript specific rules
      "@typescript-eslint/no-unused-vars": ["error", { 
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        ignoreRestSiblings: true 
      }],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-non-null-assertion": "warn",
      "@typescript-eslint/no-extraneous-class": "off", // Allow utility classes
      "@typescript-eslint/no-empty-object-type": "warn",
      "@typescript-eslint/no-inferrable-types": "error",
      
      // General rules
      "no-useless-escape": "error",
      "prefer-const": "error",
      "no-var": "error",
      
      // Stylistic rules
      "semi": ["error", "always"],
      "quotes": ["error", "single", { "allowTemplateLiterals": true }],
      "comma-dangle": ["error", "always-multiline"],
    }
  },
  {
    // Special rules for scripts and config files
    files: ['src/scripts/**/*.ts', 'src/config/**/*.ts'],
    rules: {
      "no-console": "off", // Allow console in scripts
    }
  }
);
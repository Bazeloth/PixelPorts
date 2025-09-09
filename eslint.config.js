import globals from 'globals';
import tseslint from 'typescript-eslint';
import reactX from 'eslint-plugin-react-x';
import reactDom from 'eslint-plugin-react-dom';

export default tseslint.config(
    { ignores: ['dist', 'src/lib/database.types.ts'] },
    {
        files: ['**/*.{ts,tsx}'],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
        },
        plugins: {
            'react-x': reactX,
            'react-dom': reactDom,
        },
        rules: {
            ...reactX.configs['recommended-typescript'].rules,
            ...reactDom.configs.recommended.rules,
            semi: ['error', 'always'],
            'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
            'object-curly-spacing': ['error', 'always'],
            'react-dom/no-missing-button-type': 'off',
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    argsIgnorePattern: '^_',
                },
            ],
        },
        extends: [...tseslint.configs.recommended],
    }
);

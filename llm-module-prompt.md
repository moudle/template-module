Act as an expert full-stack TypeScript developer. I want you to reconstruct a modular, plug-and-play feature module based exactly on a specific reference architecture. 

The goal is to create a fully isolated feature module (e.g. for `Product`, `Blog`, or `Task` management) that follows this exact pattern. The final output must be ready to be packaged via NPM (e.g., `[module-name]`) and consumed by a main `@moudle/start` host application.

Please generate the file structure and exact code for a **[INSERT YOUR USE CASE HERE, e.g., Product Management Module]**.

### General Rules & Naming Convention
- **STRICT FOLDER BOUNDARY: You MUST ONLY modify or create files inside the `module/` folder. You may install new dependencies via NPM, but NEVER modify `tsconfig.json`, `index.ts.example`, or any other configuration file outside the `module/` folder. Leave all root-level integrations to the user.**
- **Module Name Consistency:** You must consistently replace the placeholder `[MODULE_NAME_UPPERCASE]` with the uppercase name of the module (e.g., `PRODUCT`, `BLOG`, `TASK`) across all exported constants and files to avoid naming collisions when multiple modules are installed in a host app.
- **Strict Boilerplate:** The user should only need to modify the `"name"` property in `package.json`. The rest of the package configuration should be left as the default when first cloned.
- **Additional Libraries:** You may install and use any NPM packages necessary to fulfill the requested use case, as long as you do not break the fundamental file structure and architectural rules outlined below.

### Tech Stack
- **Backend:** Express.js, Node.js (`@types/express`)
- **Frontend:** React, React Router v7 (`@react-router/express`, `react-router-dom`)
- **Database & ORM:** TypeORM (You may use any database driver supported by TypeORM, e.g., `mysql2`, `pg`, `sqlite3`)
- **Validation:** Zod
- **Build:** TypeScript (`tsc`), `copyfiles` for assets

### Architectural Rules & File Structure
You must strictly follow this literal file structure and export pattern. The module is split into API logic, UI components, Database entities, and configuration injection.

```text
/
├── package.json
├── tsconfig.json
└── module/
    ├── api.ts
    ├── ui.tsx
    ├── db.ts
    ├── config-api.ts
    ├── config-ui.ts
    ├── api/
    │   ├── [action1].ts
    │   └── [action2].ts
    └── page/
        ├── [Page1].tsx
        ├── [Page2].tsx
        └── components/
```

### Specific File Instructions & Boilerplates

**1. `package.json`**
Set up the `package.json` exactly like this (include any extra dependencies you need):
```json
{
  "name": "[module-name]",
  ...
}
```

**2. Module Configuration (`module/config-api.ts` & `module/config-ui.ts`)**
*Explanation: Instead of relying on `.env` variables (which makes the module hard to reuse), this module uses `Config API` and `Config UI` as a stub and interface. The master/kernel project that installs this module MUST implement or set the values on these configuration objects. These configurations can be static variables (like dummy strings) or stub functions that the master project replaces with actual implementations later.*

- `module/config-api.ts`: Export a mutable `let CONFIG_API_[MODULE_NAME_UPPERCASE]` containing API settings.
```typescript
export let CONFIG_API_[MODULE_NAME_UPPERCASE] = {
  // Example: instead of process.env.API_SECRET, use this dummy string
  // The master project will overwrite this with the actual secret.
  api_secret_key: 'dummy-secret',
  
  // Example: A stub function that the master project will implement
  onItemCreated: async (itemId: number) => { 
    console.log("Stub implementation: Item created", itemId); 
  }
}
```

- `module/config-ui.ts`: Export a mutable `let CONFIG_UI_[MODULE_NAME_UPPERCASE]` containing UI settings (e.g., redirect paths).
```typescript
export let CONFIG_UI_[MODULE_NAME_UPPERCASE] = {
  // Example: instead of process.env.SUCCESS_REDIRECT, use this stub
  // The master project will overwrite this with the actual URL route.
  success_redirect_path: '/dummy-success',
  
  // Example: A stub UI function
  onUIAction: () => { console.log("Stub action"); }
}
```

**3. Database Layer (`module/db.ts`)**
- Define the TypeORM `@Entity()` classes extending `BaseEntity`.
- Export all entities directly from this file.
```typescript
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn } from "typeorm"

@Entity()
export class [EntityName] extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;
  
  // Add other columns
}
```

**4. API Controllers (`module/api/*.ts`)**
- Create separate files for each action (e.g., `create.ts`, `list.ts`).
- Each file must export an async function `(request: Request, response: Response)`.
- Use `zod` to validate `request.body`.
- Respond using `response.send(...)` or `response.status(400).send(...)`.

**5. API Router (`module/api.ts`)**
- Import all controller functions.
- Export a constant `export const LIST_API_[MODULE_NAME_UPPERCASE]`.
- The keys for `LIST_API_` **must** be formatted as `<Method name> <Path URL>`. 
- If a route requires path parameters, use standard Express-style routing (e.g., `'/api/product/:id'`).
```typescript
import { createProduct } from "./api/createProduct";
import { getProduct } from "./api/getProduct";

export const LIST_API_[MODULE_NAME_UPPERCASE] = {
  'POST /api/product': createProduct,
  'GET /api/product/:id': getProduct
}
```

**6. UI Pages (`module/page/*.tsx`)**
- Create standard React components.

**7. UI Router (`module/ui.tsx`)**
*Explanation: The `loader` and `Component` keys in this configuration are based directly on the **React Router (Data Router Mode)** paradigm (e.g., `createBrowserRouter`), taking advantage of modern data loading, redirects, and rendering mechanics.*

- Export a constant `export const LIST_PAGE_[MODULE_NAME_UPPERCASE]`.
- The keys for `LIST_PAGE_` **must** be the exact page path (e.g., `'/product'`, `'/login'`). 
- If a page requires path parameters, use standard React Router-style routing (e.g., `'/product/:id'`).
- Import configuration from `module/config-ui.ts` to handle dynamic routing/redirects if needed.
```typescript
import { ProductPage } from "./page/ProductPage";
import { ProductDetailPage } from "./page/ProductDetailPage";
import { CONFIG_UI_[MODULE_NAME_UPPERCASE] } from "./config-ui";

export const LIST_PAGE_[MODULE_NAME_UPPERCASE] = {
  '/product': {
    async loader() {
      // Logic executed by React Router before rendering
      // e.g., Return a React Router redirect() or an empty object
      return {};
    },
    Component: ProductPage
  },
  '/product/:id': {
    async loader({ params }) {
      return {};
    },
    Component: ProductDetailPage
  }
}
```

### Task Execution
Generate the entire folder structure and file contents for the requested use case matching these exact literal constraints. Provide the raw code for every file.

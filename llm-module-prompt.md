Act as an expert full-stack TypeScript developer. I want you to reconstruct a modular, plug-and-play feature module based exactly on a specific reference architecture. 

The goal is to create a fully isolated feature module (e.g. for `Product`, `Blog`, or `Task` management) that follows this exact pattern. The final output must be ready to be packaged via NPM (e.g., `[module-name]`) and consumed by a main `@moudle/start` host application.

Please generate the file structure and exact code for a **[INSERT YOUR USE CASE HERE, e.g., Product Management Module]**.

### General Rules & Naming Convention
- **STRICT FOLDER BOUNDARY: You MUST ONLY modify or create files inside the `module/` folder. You may install new dependencies via NPM, but NEVER modify `tsconfig.json`, `index.ts.example`, or any other configuration file outside the `module/` folder. Leave all root-level integrations to the user.**
- **Module Name Consistency:** You must consistently replace the placeholder `[MODULE_NAME_UPPERCASE]` with the uppercase name of the module (e.g., `PRODUCT`, `BLOG`, `TASK`) across all exported constants and files to avoid naming collisions when multiple modules are installed in a host app.
- **Interface Naming Prefix:** All TypeScript interfaces representing core domain models (e.g., Product, Blog, Task) must follow the `I` prefix naming convention (e.g., `IProduct`, `IBlog`, `ITask`) to clearly distinguish them from TypeORM database entities or normal classes.
- **Avoid Orphan/Dead Imports & Code:** When replacing template files or stripping/emptying entities from database layer files (like `module/db.ts`), you MUST also clean up any references, imports, or usages of those removed entities in helper files (such as `module/jwt.ts`). Leaving dead imports of deleted database models will trigger TypeScript compiler (`tsc`) errors during the build.
- **Strict Boilerplate:** The user should only need to modify the `"name"` property in `package.json`. The rest of the package configuration should be left as the default when first cloned.
- **Additional Libraries:** You may install and use any NPM packages necessary to fulfill the requested use case, as long as you do not break the fundamental file structure and architectural rules outlined below. **Before installing a new library, you MUST check the existing `package.json` to ensure you are not duplicating dependencies.**
- **Scan for Existing Modules/Helpers:** Before implementing configurations or functions (like JWT helpers, DB utilities, or specific API configurations), inspect the `module/` directory to see if helpers are already present (e.g., `module/jwt.ts`). You MUST align all new properties with the exact names and contracts used in these existing utilities to prevent build/runtime compilation errors.
- **No Truncation:** Ensure all generated files are complete, functional, and production-ready. Do not use code placeholders (e.g., `// TODO: add other routes` or `// ... rest of the code`).

### Tech Stack
- **Backend:** Express.js, Node.js (`@types/express`)
- **Frontend:** React, React Router v7 (`@react-router/express`, `react-router-dom`)
- **Styling:** Tailwind CSS (You MUST use Tailwind utility classes for all styling on React pages and components)
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

- `module/config-api.ts`: Export a mutable `let CONFIG_API_[MODULE_NAME_UPPERCASE]` containing API settings. Ensure you also add lifecycle event hooks (e.g. `onItemCreated`) and authorization hooks (e.g. `getUserContext`) so the master project can inject user context without breaking isolation.
*Explanation: Instead of relying on `.env` variables (which makes the module hard to reuse), this module uses `Config API` and `Config UI` as a stub and interface. The master/kernel project that installs this module MUST implement or set the values on these configuration objects. To configure multiple table names, define unique keys for each entity.*

- `module/config-api.ts`: Export a mutable `let CONFIG_API_[MODULE_NAME_UPPERCASE]` containing API settings.
```typescript
export let CONFIG_API_[MODULE_NAME_UPPERCASE] = {
  // Use this for dynamic table names. If there are multiple entities, create a config for each:
  table_name_entity_one: 'default_table_one',
  table_name_entity_two: 'default_table_two',
  
  // Example: A stub for resolving the current user making the request
  getUserContext: async (req: Request): Promise<{ id: number } | null> => { return { id: 1 }; },
  // Example: instead of process.env.API_SECRET, use this dummy string
  // The master project will overwrite this with the actual secret.
  api_secret_key: 'dummy-secret',
  
  // Example: A stub function that the master project will implement
  onItemCreated: async (itemId: number) => { 
    console.log("Stub implementation: Item created", itemId); 
  }
}
```

- `module/config-ui.ts`: Export a mutable `let CONFIG_UI_[MODULE_NAME_UPPERCASE]` containing UI settings (e.g., redirect paths) and session hooks. The module should NOT use `localStorage` for tokens directly; it must rely on these hooks.
```typescript
export let CONFIG_UI_[MODULE_NAME_UPPERCASE] = {
  // Example: instead of process.env.SUCCESS_REDIRECT, use this stub
  // The master project will overwrite this with the actual URL route.
  success_redirect_path: '/dummy-success',
  
  // Example: A stub for retrieving the auth token/session from the master project
  getSession: async (): Promise<{ token: string } | null> => { return null; },
  
  // Example: A stub for triggering logout
  logout: () => { console.log("Logout triggered"); },
  
  // Example: A stub UI function
  onUIAction: () => { console.log("Stub action"); }
}
```

**3. Database Layer (`module/db.ts`)**
- Define the TypeORM `@Entity()` classes extending `BaseEntity`.
- **Dynamic Table Names:** Inject the table name from `CONFIG_API` using `{ name: CONFIG_API_MODULE.table_name_... }`.
- Export all entities directly from this file.
```typescript
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn } from "typeorm"
import { CONFIG_API_[MODULE_NAME_UPPERCASE] } from "./config-api";

@Entity({ name: CONFIG_API_[MODULE_NAME_UPPERCASE].table_name_entity_one || 'default_table_one'})
export class EntityOne extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;
  
  // Add other columns
}

@Entity({ name: CONFIG_API_[MODULE_NAME_UPPERCASE].table_name_entity_two || 'default_table_two'})
export class EntityTwo extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;
}
```

**4. API Controllers (`module/api/*.ts`)**
- Create separate files for each action (e.g., `create.ts`, `list.ts`).
- Each file must export an async function `(request: Request, response: Response)`.
- Use `CONFIG_API_[MODULE_NAME_UPPERCASE].getUserContext(req)` to resolve the active user instead of verifying JWTs directly.
- **Type Safety:** When reading URL parameters in Express 5, explicitly cast them to strings before parsing (e.g., `parseInt(req.params.id as string)`).
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

**6. UI Pages & Styling (`module/page/*.tsx`)**
- Create standard React components.
- **API Requests:** When using `axios` or `fetch`, always retrieve the token using `await CONFIG_UI_[MODULE_NAME_UPPERCASE].getSession()` and pass it in the `Authorization` header. DO NOT hardcode `localStorage.getItem('token')`.
- **Dynamic Route Bindings (NO HARDCODING):** Do NOT hardcode route links (e.g., `<Link to="/products">` or `<Link to={`/products/${id}`}>`) inside React page JSX files or navigation bars. Always read the path configurations from `CONFIG_UI_[MODULE_NAME_UPPERCASE]` (e.g., `<Link to={CONFIG_UI_PUBLIC_PRODUCT.list_path}>` or `<Link to={CONFIG_UI_PUBLIC_PRODUCT.detail_path.replace(':id', product.id)}>`). This allows the host application to easily customize or prefix endpoints (e.g. changing path from `/products` to `/pub/products`) without breaking the internally-linked transitions within the module.
- **Visual Design Rules:** Do not implement basic or generic UI grids. Apply premium design aesthetics:
  - Vibrant Tailwind colors, custom gradients, and sleeker dark mode palettes (avoid default light blues and plain colors).
  - Modern card designs with borders, gradients, and micro-interactions (hover states, scaling elements).
  - Clear user state indicators (loading animations/skeletons, distinct error alerts, and success messages).
  - Beautiful glassmorphic structures (`bg-white/10 backdrop-blur-lg border border-white/20`) on top of colorful backgrounds where appropriate.

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
